import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import _ from 'lodash';
import nodemailer from "nodemailer";
import { EmployeeTable } from './interface';
import { EmployeeService } from "../services/employee-service"
import { getUpstream } from "../services/upstreamClient";
import * as config from "../config";


const sanitizeHtml = require('sanitize-html');
const employeeService = new EmployeeService();
export const REMOVE_DEPARTMENTS = config.REMOVE_DEPARTMENTS;
const remove_dept = _.split(REMOVE_DEPARTMENTS, ',').map((item) => _.trim(item));

export const ESRI_KEY = config.ESRI_KEY;
export const employeesRouter = express.Router();
export const DIVISIONSJSON = config.DIVISIONSJSON;
export const EMPLOYEEJSON = config.EMPLOYEEJSON;

employeesRouter.post("/", async (req: Request, res: Response) => {
    var employeesByDept = Object();
    try {
        const response = await getUpstream<any>(String(DIVISIONSJSON));
        if (!response.data || !response.data.divisions) {
            console.log("API Response:", response); 
            throw new Error("API response is missing 'divisions' field.");
        }
        var resultDivisions = response.data.divisions;
        if (!Array.isArray(resultDivisions)) {
            throw new Error(`Expected 'divisions' to be an array, but got: ${typeof resultDivisions}`);
        }
        var departments = Array();
        resultDivisions.forEach(function (element: any) {
            if (!remove_dept.includes(element.department)) {
                departments.push(element.department);
            }
        });

        var departmentsUq = departments.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });

        resultDivisions.forEach(function (element: any) {
            departments.push(element.department);
        });
        departmentsUq.forEach((elementDept: any) => {
            var keyDept = elementDept;
            var arrayElements = Array();
            var arrayElementsUq = Array();
            var keyModified = keyDept.replace(/\s/g, "-");
            resultDivisions.forEach(function (elementEm: any) {
                if (keyDept == elementEm.department && elementEm.division !== null) {
                    if (!arrayElementsUq.includes(elementEm.division)) {
                        elementEm.departmentUrl = keyModified;
                        elementEm.divisionUrl = elementEm.division.replace(/\s/g, "-");
                        arrayElements.push(elementEm);
                        arrayElementsUq.push(elementEm.division);
                    }
                }
            });
            employeesByDept[elementDept] = arrayElements;
        });
        res.send({
            data: employeesByDept,
            meta: {
            count: 0,
            stale: (response as any).__fromCache === true
            }
        });
    } catch (error: any) {
        return handleApiError(res, "Failed to fetch Divisions", error);
    }
});

employeesRouter.post("/find-employee/search/keyword=:full_name?&department=:department?", [param("full_name", "department").notEmpty()], async (req: Request, res: Response) => {

    var employeesByDept: any[] = Array();
    let groupBy = (req.body.groupBy) || 0;
    const itemsPerPage = (req.body.itemsPerPage);
    var find = '-';
    var reg = new RegExp(find, 'g');
    let paramDepartment = (req.params.department).replace(/\--/g, '-/-');
    let paramFullName = req.params.full_name;
    if (!paramFullName.includes('@')) {
        paramFullName = paramFullName.replace(".", " ");
    }

    if (paramFullName === 'any-employee') {
        paramFullName = ''
    }

    if (paramDepartment === 'any-department') {
        paramDepartment = ''
    } else {
        paramDepartment = (req.params.department.replace(reg, ' '))
    }

    await getUpstream<any>(String(EMPLOYEEJSON), { params: { department: paramDepartment, keyword: paramFullName } })
        .then((response: any) => {
            var resultEmployees = response.data.employees;
             const normalizedEmployees: EmployeeTable[] = resultEmployees.map((element: any): EmployeeTable => {
                const division = element.division?.trim() || 'Employees who are not assigned a division';
                const branch = element.branch?.trim() || 'Employees who are not assigned a branch';

                return {
                    full_name: (element.full_name ?? '').replace(".", " "),
                    formatted_name: `${element.first_name ?? ''} ${element.last_name ?? ''}`.trim(),
                    title: element.title || '-',
                    division,
                    branch,
                    email: (element.email ?? '').toLowerCase(),
                    phone_office: element.phone_office || '-',
                    department: element.department ?? '',
                    manager: element.manager ? element.manager.replace(".", " ") : '-',
                    division_url: division.replace(/\s/g, '-'),
                    full_name_url: element.full_name ?? '',
                    value: 0,
                    address: element.address ?? '',
                    community: element.community ?? '',
                    level: 0,
                };
            });
            

            employeesByDept = _.orderBy(normalizedEmployees, [employee => employee.full_name], ['asc'])

            let departments = _.groupBy(normalizedEmployees, item => `${item.department}`);

            for (const [key, value] of Object.entries(departments)) {
                const groupByDivision: any = _.groupBy(departments[key], (department) => department.division);
                departments[key] = groupByDivision;
            }

            let finalResult: any
            switch (groupBy) {
                case 0:
                    finalResult = employeesByDept
                    break;
                case 1:
                    finalResult = departments
                    break;
                case 2:
                    finalResult = _.groupBy(employeesByDept, item => `${item.address}, ${item.community}`);
                    break;
                case 3:
                    finalResult = _.groupBy(employeesByDept, item => `${item.title}`);
                    break;
            }

            res.send({ data: finalResult, meta: { count: employeesByDept.length, stale: (response as any).__fromCache === true} });
        })
        .catch((error: any) => {
            return handleApiError(res, "Failed to fetch Search by Keyword", error);
        });
});

employeesRouter.post("/find-employee/employee-detail/:department/:full_name", [param("full_name", "department").notEmpty()], async (req: Request, res: Response) => {
    try {
        var find = '-';
        var reg = new RegExp(find, 'g');
        
        let paramDepartment = (req.params.department).replace(/\--/g, '-/-').replace(reg, ' ')
        let paramFullName = (req.params.full_name)
        const result = await employeeService.getEmployee(paramDepartment, paramFullName);
        const resultEmployees = result.employees;
        const fromCache = result.stale;
        if (resultEmployees) {
                if (resultEmployees.length === 0) {
                    return res.send({ data: true })
                }

                if (resultEmployees[0] && resultEmployees[0].community && resultEmployees[0].address !== '' || null) {
                    if (resultEmployees[0].latitude !== null) {
                        resultEmployees[0].center.lat = resultEmployees[0].latitude
                        resultEmployees[0].center.lng = resultEmployees[0].longitude
                    } else {
                        await axios.get(`https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address={${resultEmployees[0].community},${resultEmployees[0].address}}&outFields={}&f=json&token=${ESRI_KEY}`)
                            .then((response: any) => {
                                
                                if(response.data.candidates){
                                    const center = response.data.candidates[0].location
                                    resultEmployees[0].center.lat = center.y;
                                    resultEmployees[0].center.lng = center.x;
                                }
                                else{
                                    console.log('Error in ESRI:' + JSON.stringify(response.data));
                                    resultEmployees[0].center = null;
                                }
                            }).catch((error: any) => {
                                console.log(error)
                            })
                    }
                } else resultEmployees[0].center = null

                let managerName: any
                var managerFilter = [];
            if (resultEmployees[0] && resultEmployees[0].manager) {
                    managerName = resultEmployees[0].manager;

                    if(managerName && managerName !== '-' && managerName !== resultEmployees[0].full_name){
                        const managerResult = await employeeService.getEmployeeSafe(paramDepartment, managerName);
                        managerFilter = managerResult.employees;
                    }
            }
            resultEmployees[0].manager = resultEmployees[0].manager !== '-' ? resultEmployees[0].manager?.replace(".", " ") : '-',
                res.send({ data: resultEmployees, meta: { manager: managerFilter ,stale: fromCache } });
        
        }else{
            return res.send({ data: true });
        }
    } catch (error: any) {
        return handleApiError(res, "Failed to fetch Employee Detail", error);
    }
});

employeesRouter.post("/find-employee/:department/:division/:branch?", [param("department", "division"), param('branch').notEmpty()], async (req: Request, res: Response) => {
    let groupBy = (req.body.groupBy) || 0;

    var managersMissing: any[] = Array();
   
    var find = '-';
    var reg = new RegExp(find, 'g');

    let paramDepartment = (req.params.department.replace(/\--/g, '-/-').replace(reg, ' '))
    let paramDivision = (req.params.division)
    let paramBranch = (req.params.branch)

    var notDivision = paramDivision === 'not-division';
    var onlyDept = paramDivision === 'only-department' && paramBranch === 'only-department'

    if (!paramDivision || paramDivision === 'not-division') {
        paramDivision = ''
    } else {
        paramDivision = (req.params.division.replace(reg, ' '))
    }

    var notBranch = paramBranch === 'not-branch';
    if (!paramBranch || paramBranch === 'all-branches' || paramBranch === 'all branches') {
        paramBranch = ''
    } else {
        paramBranch = req.params.branch.replace(reg, ' ')
    }

    var params_var = {
        department: paramDepartment,
        ...(paramDivision != '' &&  !onlyDept && { division: paramDivision }),
    };

    await getUpstream<any>(String(EMPLOYEEJSON), { params: params_var })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            const normalizedEmployees: EmployeeTable[] = resultEmployees.map((element: any): EmployeeTable => {
                const division = element.division?.trim() || 'Employees who are not assigned a division';
                const branch = element.branch?.trim() || 'Employees who are not assigned a branch';

                return {
                    full_name: (element.full_name ?? '').replace(".", " "),
                    formatted_name: `${element.first_name ?? ''} ${element.last_name ?? ''}`.trim(),
                    title: element.title || '-',
                    division,
                    branch,
                    email: (element.email ?? '').toLowerCase(),
                    phone_office: element.phone_office || '-',
                    department: element.department ?? '',
                    manager: element.manager ? element.manager.replace(".", " ") : '-',
                    division_url: division.replace(/\s/g, '-'),
                    full_name_url: element.full_name ?? '',
                    value: 0,
                    address: element.address ?? '',
                    community: element.community ?? '',
                    level: 0,
                };
            });
            
            let employeesByDivision = normalizedEmployees;
            //Get the number of employees displayed in the grid.
            let divLength = employeesByDivision.length

            if (notBranch) {
                employeesByDivision = employeesByDivision.filter(
                    (item: EmployeeTable) =>
                    item.branch === 'Employees who are not assigned a branch'
                );
             } else if (paramBranch !== '' && !onlyDept) {
                 employeesByDivision = employeesByDivision.filter(item => {
                    const branch = (item.branch || '').trim();
                    const target = paramBranch.trim();
                    return branch.includes(target);
                });
             }

            //Get all the Managers' name
            var managersNameByDivision = _.uniq(_.map(employeesByDivision, 'manager'));
            //Get all the employees' name
            var namesByDivision = _.map(employeesByDivision, 'full_name');

            //Check if all managers exist in the consulted department/branch.
            var namesMissing = _.difference(managersNameByDivision, namesByDivision);

            if (!_.isEmpty(namesMissing)) {
                managersMissing = namesMissing.map(function (name: string) {
                    let managerMissing = _.find(employeesByDivision, { full_name: name });
                    if (!_.isUndefined(managerMissing)) {
                        managerMissing.manager = managerMissing.full_name;
                        return managerMissing;
                    }
                });
            }

            managersMissing = _.compact(managersMissing);

            //Add the managers missing in the array
            if (!_.isEmpty(employeesByDivision) && !_.isEmpty(managersMissing)) {
                employeesByDivision = _.union(employeesByDivision, managersMissing);
            }

            //Get all the Managers' name
            managersNameByDivision = _.uniq(_.map(employeesByDivision, 'manager'));
            //Get all the employees' name
            namesByDivision = _.map(employeesByDivision, 'full_name');
            //Check if all managers exist in the consulted department/branch.
            namesMissing = _.difference(managersNameByDivision, namesByDivision);

            //Change the manager's name if the manager is not in the same department, remove from the hierarchy
            employeesByDivision = employeesByDivision.map(function (item: any) {
                if (_.indexOf(namesMissing, item.manager) >= 0) {
                    item.manager = item.full_name;
                }
                return item;
            });

            //Obtain all objects from managers
            let managersByDivision = employeesByDivision.filter(item => {
                if (_.isEmpty(item.manager) || item.manager === '-' || item.manager === item.full_name) {
                    item.level = 0;
                    return true;
                }
            });

            //Obtain all employee objects not in Manager's array.
            let employeesByManager = employeesByDivision.filter(function (e) {
                return !_.find(managersByDivision, { full_name: e.full_name })
            })

            const getEmployeesByManager = (employeesArray: any, currentManager: any, level: any) => {
                employeesArray = _.orderBy(employeesArray, ['full_name'],['asc']);
                const currentEmployees = employeesArray.filter(
                    (employee: any) => employee.manager === currentManager.full_name
                );
                if (!currentEmployees.length) {
                    return [currentManager];
                }
                let employeesList: any = [];
                const currentLevel = level + 1;
                employeesList = currentEmployees.map(function (item: any) {
                    item.level = currentLevel;
                    item.value += currentManager.value
                    return item;
                });
                for (const employee__ of employeesList) {
                    const employees = getEmployeesByManager(employeesArray, employee__, currentLevel);
                    employeesList = [...employeesList, employees];
                }
                return [currentManager, ...employeesList.flat()];
            }

            let result: any = [];
            let levelOfDepth: any = 0;
            managersByDivision = _.orderBy(managersByDivision, ['full_name'],['asc']);
            for (const manager of managersByDivision) {
                levelOfDepth = _.isUndefined(manager.level) ? 0 : manager.level;
                result = [...result, ...getEmployeesByManager(employeesByManager, manager, levelOfDepth)];
            }

            let resultRev = result.slice().reverse();
            let resultFilttered = resultRev.filter(function (elem: any, index: any, self: any) {
                return index == self.indexOf(elem);
            });

            let finalResult = resultFilttered.slice().reverse();
            finalResult = finalResult.filter(function (elem: any, index: any, self: any) {
                return index == self.indexOf(elem);
            });

            let endResult: any
            //Return the grouped array 
            switch (groupBy) {
                case 0:
                    endResult = finalResult
                    break;
                case 1:
                    endResult = _.groupBy(finalResult, function (item: any) { return `${item.address}, ${item.community}` });
                    break;
                case 2:
                    endResult = _.groupBy(finalResult, function (item: any) { return `${item.title}` });
                    break;
            }
            res.send({ data: endResult, meta: { branchCount: finalResult.length, divisionCount: divLength, stale: (response as any).__fromCache === true} });
        })
        .catch((error: any) => {
           return handleApiError(res, "Failed to fetch Department/Division/Branch", error);
        });
});

employeesRouter.post("/find-employee/:department/", [param("department").notEmpty()], async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    let paramDepartment = (req.params.department.replace(/\--/g, '-/-').replace(reg, ' '))
    try {

        const divisionsResponse = await getUpstream<any>(String(DIVISIONSJSON), { params: { department: paramDepartment } });
        if (divisionsResponse.data.divisions.length === 0) {
            const fromCache = (divisionsResponse as any).__fromCache === true;

            return res.json({ meta: { error: true, stale: fromCache } });
        }
        const employeesResponse = await getUpstream<any>(String(EMPLOYEEJSON), { params: { department: paramDepartment } });
        const resultEmployees = employeesResponse.data.employees;
        if (resultEmployees.length === 0) {
            const fromCacheEmployees = (employeesResponse as any).__fromCache === true;
            return res.json({ meta: { count: 0, notFound: true, stale: fromCacheEmployees } });
        }
        // Sorting and Formatting
        let employeesByDeptSorted = _.sortBy(resultEmployees, ['null', 'division', 'branch'], ['desc', 'asc']);

        const normalized = employeesByDeptSorted.map((e: any) => ({
            ...e,
            division: e.division?.trim() || 'Employees who are not assigned a division',
            branch: e.branch?.trim() || 'Employees who are not assigned a branch'
        }));

        let division: any = _.groupBy(normalized, (item: { division: any }) => item.division);
        for (const key in division) {
            division[key] = _.groupBy(division[key], (division: any) => division.branch);
        }

        return res.json({ data: division, meta: { count: resultEmployees.length, stale: (divisionsResponse as any).__fromCache } });
    } catch (error: any) {
        return handleApiError(res, "Failed to fetch Department", error);
    }
});

employeesRouter.post("/DivisionsCard", async (req: Request, res: Response) => {
    const rawDepartment = req.body?.department || '';
    const paramDepartment =  typeof rawDepartment === 'string' && rawDepartment.length > 0
    ? rawDepartment.replace(/\--/g, '-/-')
        : '';
    await getUpstream<any>(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            let employeesByDeptSorted = _.sortBy(resultEmployees, ['null', 'division', 'branch'], ['desc', 'asc'])
            const normalized = employeesByDeptSorted.map((e: any) => ({
                ...e,
                division: e.division?.trim() || 'Employees who are not assigned a division',
                branch: e.branch?.trim() || 'Employees who are not assigned a branch'
            }));

            let division: any = _.groupBy(normalized, (item: { division: any; }) => `${item.division}`);

            for (const [key, value] of Object.entries(division)) {
                const groupByDivision: any = _.groupBy(division[key], (division: any) => division.branch);
                division[key] = groupByDivision;
            }

            res.send({ data: division, meta: { count: 0, stale: (response as any).__fromCache === true} });

        })
        .catch((error: any) => {
            return handleApiError(res, "Failed to fetch division card", error);
        });
});

employeesRouter.post("/SearchBar", async (req: Request, res: Response) => {
    try {
        const response = await getUpstream<any>(String(DIVISIONSJSON));
        const fromCache = (response as any).__fromCache === true;

        // Validate API response
        if (!response.data || !Array.isArray(response.data.divisions)) {
            return res.status(500).json({ error: "Invalid response format from API" });
        }
        const departments = [...new Set(response.data.divisions.map((item: any) => item.department))];

        return res.status(200).json({ data: departments, meta: { count: departments.length, stale: fromCache } });
    } catch (error: any) {
       return handleApiError(res, "Failed to fetch employees for search", error);
    }
});

employeesRouter.post("/feedbackForm", async (req: Request, res: Response) => {
    try {
        //Content from client
        let feedbackContentSubject = sanitizeHtml(req.body.emailSubject);
        let feedbackFormContent = sanitizeHtml(req.body.emailBody);
        let emailDate = new Date();;
        let pageUrl = sanitizeHtml(req.body.pageUrl)

        const bodyContentFormatted =
            `<p><strong>Submited on:</strong> ${emailDate.toLocaleString()}</p>
        <p><strong>${feedbackContentSubject} :</strong> ${feedbackFormContent}</p> 
        <p<strong>URL:</strong> <a href="${pageUrl}">${pageUrl}</a></p>`;

        const sanitizedBody = sanitizeHtml(bodyContentFormatted)
        const emailHost = config.SMTP_SERVER;
        const emailPort = config.SMTP_PORT;
        const emailFrom = config.EMAIL_FROM;
        const nameFrom = config.NAME_FROM;
        const subject = config.EMAIL_SUBJECT;
        const selfSignedConfig = {
            host: emailHost,
            port: emailPort
        };
        var transporter = nodemailer.createTransport(selfSignedConfig);
        const info = await transporter.sendMail({
            from: nameFrom + ' ' + emailFrom,
            to: config.EMAIL_TO,
            subject: subject,
            html: sanitizedBody,
        });
        res.send({ data: 'Sent' });
    } catch (error) {
        return handleApiError(res, "Failed to feedback", error);
    }
});

// Helper to reduce repeated error handling logic
function handleApiError(res: Response, logMessage: string, error: any) {
    const errorMessage = error?.message ?? 'Unknown error occurred';
    console.error(logMessage, errorMessage);
    return res.status(500).json({
        error: logMessage,
        details: errorMessage
    });
}