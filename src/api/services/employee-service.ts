import axios from "axios";
import _ from 'lodash';
import { EmployeeTable } from '../routes/interface';
import * as dotenv from "dotenv";
import { getUpstream } from "./upstreamClient";
import * as config from "../config";
import { getCachedEmployees, findEmployeeBySamAccount, normalizeName } from "./upstreamClient";


export const EMPLOYEEDETAILJSON = config.EMPLOYEEDETAILJSON;

export function getDisplayPhone(title: string, department: string, phoneOffice: string): string {
    if (title === 'Minister' && department !== 'Cabinet Office') {
        return '-';
    }
    return phoneOffice !== '' ? phoneOffice : '-';
}

const mapEmployee = (element: any) => {
  const division_url = element.division !== null ? element.division.replace(/\s/g, "-") : '';

  return {
    full_name: element.full_name.replace(".", " "),
    formatted_name: element.first_name + ' ' + element.last_name,
    department: element.department,
    division: element.division,
    branch: element.branch,
    unit: element.unit,
    title: element.title,
    email: element.email.toLowerCase(),
    phone_office: getDisplayPhone(element.title, element.department, element.phone_office),
    fax_office: element.fax_office,
    address: element.address,
    community: element.community,
    postal_code: element.postal_code,
    mailcode: element.mailcode,
    manager: element.manager !== '' ? element.manager: '-',
    division_url,
    full_name_url: element.full_name,
    latitude: element.latitude,
    longitude: element.longitude,
    value: 0,
    center: { lat: 0, lng: 0 }
  };
};

const maybeEscapeApostrophes = (value: string): string => {
  const shouldEscape = (process.env.ESCAPE_APOSTROPHES || '').toLowerCase() === 'true';
  if (!shouldEscape || !value) return value;
  return value.replace(/'/g, "''");
};


export class EmployeeService {
    async getEmployeeSafe(paramDepartment: string, paramFullName: string) {
        try {
            return await this.getEmployee(paramDepartment, paramFullName);
        } catch {
            return { employees: [], stale: true };
        }
    }
    
    async getEmployee(paramDepartment: string, paramFullName: string): Promise<{ employees: any[]; stale: boolean }> {
        // Normalize names that do not contain a dot at all
        let samaccountname = (paramFullName || '').trim();
        if (!samaccountname.includes('.')) {
            samaccountname = normalizeName(samaccountname);
        }

        // Apply optional apostrophe escaping for upstream SQL bug
        samaccountname = maybeEscapeApostrophes(samaccountname);
        let resultEmployees: any[] = [];
        let fromCache = false;
        try {
            const response = await getUpstream<any>(String(EMPLOYEEDETAILJSON), {params: { samaccountname }});
            fromCache = (response as any).__fromCache === true;
            resultEmployees = response.data.employees || [];
            if (resultEmployees.length === 0) {
                return {
                    employees: [],
                    stale: fromCache
                };
            }

        let filteredEmployees = resultEmployees;
        if (resultEmployees.length > 1 && paramDepartment) {
            filteredEmployees = resultEmployees.filter((emp: any) => emp.department === paramDepartment);
        }

        if (filteredEmployees.length === 0) {
            filteredEmployees = [resultEmployees[0]];
        }
        return {
            employees: filteredEmployees.map(mapEmployee),
            stale: fromCache
            };
        } catch (error: any) {
        const errorMessage = error.message ?? 'Unknown error occurred';
        console.error("Error loading employee:", errorMessage);
        console.warn("Detail API failed, trying ALL_EMPLOYEES cache");
        const cached = getCachedEmployees();
        if (cached?.data?.length) {
            console.warn("Returning cached data because upstream request failed");
            const matched = findEmployeeBySamAccount(
                cached.data,
                samaccountname,
                paramDepartment
            );

            if (matched.length > 0) {
                return {
                    employees: matched.map(mapEmployee),
                    stale: true
                };
            }
        }
        throw new Error(errorMessage);
    }
  }

}
