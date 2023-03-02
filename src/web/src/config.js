export const applicationName = "Find a government employee | Government of Yukon eServices";
export const applicationIcon = "mdi-cash-register";

export const emailConfig = [
    {
        SecureToken: "TOKEN",
        To: "TO",
        From: "FROM",
        Subject:'Feedback from the Find a government employee service',
    }
]

export const sections = [
    {
        name: "Dashboard",
        url: "/",
        icon: "mdi-view-dashboard"
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

export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.VUE_APP_API_URL || "http://localhost:3000";
