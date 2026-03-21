import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as config from "../config";
import NodeCache from "node-cache";
import { EmployeeTable, CacheRecord } from '../routes/interface';

let breakerOpenUntil = 0;
const refreshingMap: Record<string, boolean> = {};
export const EMPLOYEEJSON = config.EMPLOYEEJSON;
export const DIVISIONSJSON = config.DIVISIONSJSON;

const upstreamCache = new NodeCache({
  stdTTL: 0,
  checkperiod: 0,
  useClones: true
});
const EMPLOYEES_KEY = "ALL_EMPLOYEES";
const DIVISIONS_KEY = "ALL_DIVISIONS";

const isEmployeesUrl = (url: string) => url === String(EMPLOYEEJSON);
const isDivisionsUrl = (url: string) => url === String(DIVISIONSJSON);

const getCacheKeyByUrl = (url: string) => {
  if (isEmployeesUrl(url)) return EMPLOYEES_KEY;
  if (isDivisionsUrl(url)) return DIVISIONS_KEY;
  return null;
};

export class ServiceUnavailableError extends Error {
  public readonly code: string;

  constructor(message: string) {
    super(message);
    this.code = "SERVICE_UNAVAILABLE";
  }
}

const logError = (message: string, error: unknown): void => {
  const err = error as Error & { stack?: string };
  console.error(
    JSON.stringify({
      level: "error",
      tag: "UPSTREAM_DOWN",
      time: new Date().toISOString(),
      message,
      errorMessage: err?.message ?? "Unknown error"
    }),
  );
};

const openBreaker = (): void => {
  breakerOpenUntil = Date.now() + config.BREAKER_TTL_SECONDS * 1000;
};

export const isBreakerOpen = (): boolean => Date.now() < breakerOpenUntil;

export const getBreakerRetryAfterSeconds = (): number => {
  if (!isBreakerOpen()) {
    return 0;
  }

  return Math.ceil((breakerOpenUntil - Date.now()) / 1000);
};

export const checkUpstreamHealth = async (url: string): Promise<boolean> => {
  if (isBreakerOpen()) {
    return false;
  }

  try {
    await axios.get(url, { timeout: config.UPSTREAM_TIMEOUT_MS });
    return true;
  } catch (error) {
    logError("Upstream health check failed", error);
    openBreaker();
    return false;
  }
};

export const getUpstream = async <T>(url: string, requestConfig: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
  const cacheKey = getCacheKeyByUrl(url);
  const cached = cacheKey
    ? upstreamCache.get<CacheRecord>(cacheKey)
    : undefined;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const isStale = !cached || (Date.now() - cached.updatedAt > ONE_DAY);   

  const lastUpdate = cached ? new Date(cached.updatedAt).toDateString() : null;
  
  if (isBreakerOpen()) {
    if (cached) {
      console.warn("Returning cached data because upstream request failed");
      let filtered = cached.data;
      const filterFn = getFilter(url);
      if (filterFn) {
        const params = requestConfig?.params || {};
        filtered = filterFn(cached.data, params);
      }

      const response = buildCachedResponse<T>(url, filtered, requestConfig);
      (response as any).__fromCache = true;
      return response;
    }

    const breakerMessage = "Employee upstream API unavailable (circuit breaker open)";
    const error = new ServiceUnavailableError(breakerMessage);
    logError(breakerMessage, error);
    throw error;
  }

  try {
    const response =  await axios.get<T>(url, {
      timeout: config.UPSTREAM_TIMEOUT_MS,
      ...requestConfig,
    });
    (response as any).__fromCache = false;
    if (isStale && cacheKey && !refreshingMap[cacheKey]) {
      refreshingMap[cacheKey] = true;
      axios.get(url, {
        timeout: config.UPSTREAM_TIMEOUT_MS
      }).then(fullResponse => {
        const payload = isEmployeesUrl(url)
          ? (fullResponse.data as any)?.employees
          : isDivisionsUrl(url)
            ? (fullResponse.data as any)?.divisions
            : null;

        if (Array.isArray(payload) && payload.length > 0) {
          upstreamCache.set(cacheKey, {
            data: payload,
            updatedAt: Date.now(),
          });
        }

      }).catch(() => {
        console.warn("Failed to refresh upstream cache");
      }).finally(() => {
        refreshingMap[cacheKey] = false;
      });
    }

    return response;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } } & Error;
    const status = axiosError.response?.status;
    const isUpstreamFailure = !status || status >= 500;

    if (isUpstreamFailure) {
      openBreaker();
      logError("Failed to fetch upstream resource", error);
      if (cached && cacheKey) {
        console.warn("Returning cached data because upstream request failed");
        let filtered = cached.data;
        const filterFn = getFilter(url);
        if (filterFn) {
          const params = requestConfig?.params || {};
          filtered = filterFn(cached.data, params);
        }
        const response = buildCachedResponse<T>(url, filtered, requestConfig);
        (response as any).__fromCache = true;
        return response;
      }

      throw new ServiceUnavailableError("Upstream employee service unavailable");
      
    }

    throw error;
  }
};
const filterEmployees = (data: any[], params: any = {}) => {
  let result = data;

  if (params.department) {
    result = result.filter((e: any) =>
      e.department?.toLowerCase() === params.department.toLowerCase()
    );
  }

  if (params.division) {
    result = result.filter((e: any) =>
      e.division?.toLowerCase() === params.division.toLowerCase()
    );
  }

  if (params.keyword) {
    const normalize = (val: string) =>
      (val || "")
        .toLowerCase()
        .replace(/[\-().\s]/g, "");

    const keyword = params.keyword.toLowerCase();
    const keywordNoDots = keyword.replace(".", " ");
    const keywordNormalized = normalize(params.keyword);

    result = result.filter((e: any) => {
      const fullName = e.full_name?.toLowerCase() || "";
      const fullNameNoDots = fullName.replace(".", " ");
      const firstLast = `${e.first_name || ""} ${e.last_name || ""}`.toLowerCase();

      const jobTitle = e.title?.toLowerCase() || "";
      const email = e.email?.toLowerCase() || "";
      const phone = normalize(e.phone_office || "");

      const department = e.department?.toLowerCase() || "";
      const division = e.division?.toLowerCase() || "";
      const branch = e.branch?.toLowerCase() || "";
      const unit = e.unit?.toLowerCase() || "";
      const office = e.office?.toLowerCase() || "";
      const username = e.username?.toLowerCase() || "";

      return (
        fullName.includes(keyword) ||
        fullNameNoDots.includes(keywordNoDots) ||
        firstLast.includes(keywordNoDots) ||
        jobTitle.includes(keyword) ||
        email.includes(keyword) ||
        phone.includes(keywordNormalized) ||
        department.includes(keyword) ||
        division.includes(keyword) ||
        branch.includes(keyword) ||
        unit.includes(keyword) ||
        office.includes(keyword) ||
        username.includes(keyword)
      );
    });
  }

  return result;
};

const buildCachedResponse = <T>(
  url: string,
  data: any[],
  requestConfig: AxiosRequestConfig
): AxiosResponse<T> => {
  const responseData = isEmployeesUrl(url)
    ? { employees: data }
    : isDivisionsUrl(url)
      ? { divisions: data }
      : data;

  return {
    data: responseData as unknown as T,
    status: 200,
    statusText: "OK",
    headers: {},
    config: requestConfig,
  };
};

const filterDivisions = (data: any[], params: any = {}) => {
  let result = data;

  if (params.department) {
    const department = params.department.toLowerCase();
    result = result.filter((d: any) =>
      d.department?.toLowerCase().includes(department)
    );
  }

  if (params.division) {
    const division = params.division.toLowerCase();
    result = result.filter((d: any) =>
      d.division?.toLowerCase().includes(division)
    );
  }

  return result;
};

const getFilter = (url: string) => {
  if (isEmployeesUrl(url)) return filterEmployees;
  if (isDivisionsUrl(url)) return filterDivisions;
  return null;
};

export const normalizeName = (val: string) =>
  (val || "")
    .toLowerCase()
    .replace(/['’]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const findEmployeeBySamAccount = (
  employees: any[],
  samaccountname: string,
  department?: string
) => {
  const search = normalizeFullName(samaccountname);

  let result = employees.filter((e: any) => {
    const fullName = normalizeFullName(e.full_name || '');

    return (
      fullName === search);
  });

  if (department) {
    const normalizedDept = normalizeFullName(department);
    result = result.filter((e: any) => {
      const empDept = normalizeFullName(e.department || '');
      return empDept === normalizedDept;
    });
  }

  return result;
};

export const getCachedEmployees = () => {
  return upstreamCache.get<CacheRecord>(EMPLOYEES_KEY);
};

const normalizeFullName = (str: string) => {
  return (str || '')
    .toLowerCase()
    .replace(/[.\-']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};