import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `.env.test`;
    break;
  case "production":
    path = `.env`;
    break;
  default:
    path = `.env.development`;
}

dotenv.config({ path: path });

export const API_PORT = parseInt(process.env.API_PORT || "3000");
export const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:8080";
export const NODE_ENV = process.env.NODE_ENV;
export const REMOVE_DEPARTMENTS = process.env.REMOVE_DEPARTMENTS || "";

export const ESRI_KEY = process.env.ESRI_KEY || process.env.ESRI_KEY || "";
export const DIVISIONSJSON = process.env.DIVISIONSJSON || process.env.DIVISIONSJSON || "";
export const EMPLOYEEJSON = process.env.EMPLOYEEJSON || process.env.EMPLOYEEJSON || "";
export const EMPLOYEEDETAILJSON = process.env.EMPLOYEEDETAILJSON  || "";

//For feedback form email configuration
export const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_TO || "";
export const NAME_FROM = process.env.NAME_FROM || process.env.NAME_FROM || "";
export const EMAIL_SUBJECT = process.env.EMAIL_SUBJECT || "Find a government employee - feedback received";

//Config for SMTP server
export const SMTP_SERVER = process.env.SMTP_SERVER || process.env.SMTP_SERVER || "";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_FROM || "";

//Cache and circuit breaker configuration
export const UPSTREAM_TIMEOUT_MS = parseInt(process.env.UPSTREAM_TIMEOUT_MS || "50000");
export const BREAKER_TTL_SECONDS = parseInt(process.env.BREAKER_TTL_SECONDS || "180");
export const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || "300");
