import * as dotenv from 'dotenv';
dotenv.config();
export const applicationName = "Template App";
export const applicationIcon = "mdi-cash-register";
export const hasSidebar = true;
export const hasSidebarClosable = false;

export const sections = [
    {
        name: "Dashboard",
        url: "/",
        icon: "mdi-view-dashboard"
    },
    {
        name: "Basic Form",
        url: "/form",
        icon: "mdi-book-open-variant"
    },
    {
        name: "Data grid",
        url: "/grid",
        icon: "mdi-table-large"
    },
    {
        name: "Employees",
        url: "/employees",
        icon: "mdi-account-group"
    }
];

export const GMAPS_KEY = process.env.VUE_APP_GMAPS_KEY || '';
export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
