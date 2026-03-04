import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import _ from 'lodash';
import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import { EmployeeTable } from './interface';
import { EmployeeService } from "../services";

const sanitizeHtml = require('sanitize-html');
const employeeService = new EmployeeService();
export const REMOVE_DEPARTMENTS = process.env.REMOVE_DEPARTMENTS;
const remove_dept = _.split(REMOVE_DEPARTMENTS, ',').map((item) => _.trim(item));

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

export const ESRI_KEY = process.env.ESRI_KEY;
export const employeesRouter = express.Router();
export const DIVISIONSJSON = process.env.DIVISIONSJSON;
export const EMPLOYEEJSON = process.env.EMPLOYEEJSON;

employeesRouter.post("/", async (req: Request, res: Response) => {

    var employeesByDept = Object();
    axios.get(String(DIVISIONSJSON))
        .then((response: any) => {
            if (!response.data || !response.data.divisions) {
                console.log("API Response:", response); 
                throw new Error("API response is missing 'divisions' field.");
            }
            var resultEmployees = response.data.divisions;
            if (!Array.isArray(resultEmployees)) {
                throw new Error(`Expected 'divisions' to be an array, but got: ${typeof resultEmployees}`);
            }

            var departments = Array();
            resultEmployees.forEach(function (element: any) {
                if (!remove_dept.includes(element.department)) {
                    departments.push(element.department);
                }
            });

            var departmentsUq = departments.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });

            resultEmployees.forEach(function (element: any) {
                departments.push(element.department);
            });

            departmentsUq.forEach((elementDept: any) => {
                var keyDept = elementDept;
                var arrayElements = Array();
                var arrayElementssUq = Array();
                var keyModified = keyDept.replace(/\s/g, "-");

                resultEmployees.forEach(function (elementEm: any) {
                    if (keyDept == elementEm.department && elementEm.division !== null) {
                        if (!arrayElementssUq.includes(elementEm.division)) {
                            elementEm.departmentUrl = keyModified;
                            elementEm.divisionUrl = elementEm.division.replace(/\s/g, "-");
                            arrayElements.push(elementEm);
                            arrayElementssUq.push(elementEm.division);
                        }
                    }
                });

                employeesByDept[elementDept] = arrayElements;
            });
            res.send({ data: employeesByDept, meta: { count: 0 } });

        })
        .catch((error: any) => {
            let errorMessage =  error.message ?? 'Unknown error occurred';
            console.error("Error load department:", errorMessage);
            return res.status(500).json({
                error: "Failed to fetch departments",
                details:  errorMessage
            });
        });
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
    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment, keyword: paramFullName } })
        .then((response: any) => {
            var resultEmployees = response.data.employees;

            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, '-') : '';
                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'formatted_name': element.first_name + ' ' + element.last_name,
                    'title': element.title !== '' ? element.title : '-',
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '',
                    'email': element.email.toLowerCase(),
                    'phone_office': element.phone_office !== '' ? element.phone_office : '-',
                    'department': element.department,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                    'value': 0,
                    'address': element.address,
                    'community': element.community,
                };

                employeesByDept.push(employee);

            });

            employeesByDept = _.orderBy(employeesByDept, [employee => employee.full_name], ['asc'])

            let departments = _.groupBy(employeesByDept, item => `${item.department}`);

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

            res.send({ data: finalResult, meta: { count: employeesByDept.length } });
        })
        .catch((error: any) => {
            console.error("Error in /find-employee/search endpoint:", error);
            const errorMessage = error?.message ?? "Unknown error occurred";
            return res.status(500).json({
                error: "Failed to fetch employees for search",
                details: errorMessage,
            });
        });
});

employeesRouter.post("/find-employee/employee-detail/:department/:full_name", [param("full_name", "department").notEmpty()], async (req: Request, res: Response) => {
    try {
        var employeeArr: any[] = Array();
        var find = '-';
        var reg = new RegExp(find, 'g');

        let paramDepartment = (req.params.department).replace(/\--/g, '-/-').replace(reg, ' ')
        let paramFullName = (req.params.full_name)
        var resultEmployees = await employeeService.getEmployee(paramDepartment, paramFullName);
        console.log('hola');
        if(resultEmployees){
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
                if (resultEmployees[0] && resultEmployees[0].manager){
                    managerName = resultEmployees[0].manager;
                    if(managerName){
                        managerFilter = await employeeService.getEmployee(paramDepartment, managerName);
                    }
                }
                res.send({ data: resultEmployees, meta: { manager: managerFilter } });
        
        }else{
            return res.send({ data: true });
        }
    } catch (error: any) {
        console.error("Route error:", error.message);

        return res.status(500).json({
            error: "Failed to fetch employee detail",
            details: error.message
        });
    }
});

employeesRouter.post("/find-employee/:department/:division/:branch?", [param("department", "division"), param('branch').notEmpty()], async (req: Request, res: Response) => {
    let groupBy = (req.body.groupBy) || 0;

    var employeesByDept: any[] = Array();
    var managersMissing: any[] = Array();
    var _ = require("lodash");
   
    var find = '-';
    var reg = new RegExp(find, 'g');

    let paramDepartment = (req.params.department.replace(/\--/g, '-/-').replace(reg, ' '))
    let paramDivision = (req.params.division)
    let paramBranch = (req.params.branch)

    var notDivision = paramDivision === 'not-division';
    var onlyDept = paramDivision === 'only-department' && paramBranch === 'only-department'

    if (paramDivision === 'not-division') {
        paramDivision = ''
    } else {
        paramDivision = (req.params.division.replace(reg, ' '))
    }

    var notBranch = paramBranch === 'not-branch';
    if (paramBranch === 'all-branches' || paramBranch === 'all branches') {
        paramBranch = ''
    } else {
        paramBranch = req.params.branch.replace(reg, ' ')
    }

    var params_var = {
        department: paramDepartment,
        ...(paramDivision != '' &&  !onlyDept && { division: paramDivision }),
    };

    axios.get(String(EMPLOYEEJSON), { params: params_var })
        .then((response: any) => {

            var resultEmployees = response.data.employees;

            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, '-') : '';
                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'formatted_name': element.first_name + ' ' + element.last_name,
                    'title': element.title !== '' ? element.title : '-',
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '',
                    'email': element.email.toLowerCase(),
                    'phone_office': element.phone_office !== '' ? element.phone_office : '-',
                    'department': element.department,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                    'value': 0,
                    'address': element.address,
                    'community': element.community,

                };

                employeesByDept.push(employee);
            });
            
            let employeesByDivision = employeesByDept
            //Get the number of employees displayed in the grid.
            let divLength = employeesByDivision.length

            if (notBranch) {
                employeesByDivision = employeesByDivision.filter(item => { return item.branch === '-' || _.isUndefined(item.branch) || _.isEmpty(item.branch) })
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
            res.send({ data: endResult, meta: { branchCount: finalResult.length, divisionCount: divLength } });
        })
        .catch((error: any) => {
           let errorMessage =  error.message ?? 'Unknown error occurred';
            console.error("Failed to fetch departments:", errorMessage);

            return res.status(500).json({
                error: "Failed to fetch departments",
                details: errorMessage
            });
        });
});

employeesRouter.post("/find-employee/:department/", [param("department").notEmpty()], async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    var _ = require("lodash");
    let paramDepartment = (req.params.department.replace(/\--/g, '-/-').replace(reg, ' '))
    let error = false
    try {

        const divisionsResponse = await axios.get(String(DIVISIONSJSON), { params: { department: paramDepartment } });
        if (divisionsResponse.data.divisions.length === 0) {
            return res.json({ meta: { error: true } });
        }
        const employeesResponse = await axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } });
        const resultEmployees = employeesResponse.data.employees;
        if (resultEmployees.length === 0) {
            return res.json({ meta: { count: 0, notFound: true } });
        }
        // Sorting and Formatting
        let employeesByDeptSorted = _.sortBy(resultEmployees, ['null', 'division', 'branch'], ['desc', 'asc']);

        employeesByDeptSorted.forEach((element: any) => {
            if (!element.division) {
                element.division = 'Employees who are not assigned a division';
            }
            if (!element.branch) {
                element.branch = 'Employees who are not assigned a branch';
            }
        });

        let division: any = _.groupBy(employeesByDeptSorted, (item: { division: any }) => item.division);
        for (const key in division) {
            division[key] = _.groupBy(division[key], (division: any) => division.branch);
        }

        return res.json({ data: division, meta: { count: resultEmployees.length } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

employeesRouter.post("/DivisionsCard", async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    const paramDepartment = req.body.department.replace(/\--/g, '-/-')
    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            let employeesByDeptSorted = _.sortBy(resultEmployees, ['null', 'division', 'branch'], ['desc', 'asc'])

            resultEmployees.forEach((element: any) => {
                if (element.division === null) {
                    element.division = 'Employees who are not assigned a division'
                }
                if (element.branch === null) {
                    element.branch = 'Employees who are not assigned a branch'
                }
            })

            let division: any = _.groupBy(employeesByDeptSorted, (item: { division: any; }) => `${item.division}`);


            for (const [key, value] of Object.entries(division)) {
                const groupByDivision: any = _.groupBy(division[key], (division: any) => division.branch);

                division[key] = groupByDivision;

            }

            res.send({ data: division, meta: { count: 0 } });

        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/SearchBar", async (req: Request, res: Response) => {
    try {
        const response = await axios.get(String(DIVISIONSJSON));
        // Validate API response
        if (!response.data || !Array.isArray(response.data.divisions)) {
            return res.status(500).json({ error: "Invalid response format from API" });
        }
        const departments = [...new Set(response.data.divisions.map((item: any) => item.department))];

        return res.status(200).json({ data: departments, meta: { count: departments.length } });
    } catch (error: any) {
       let errorMessage =  error.message ?? 'Unknown error occurred';
        console.error("Error fetching search bar:", errorMessage);

        return res.status(500).json({
            error: "Failed to fetch departments",
            details: errorMessage
        });
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
        const emailHost = process.env.SMTP_SERVER;
        const emailPort: string = process.env.SMTP_PORT!;
        const emailFrom = process.env.EMAIL_FROM;
        const nameFrom = process.env.NAME_FROM;
        const subject = process.env.EMAIL_SUBJECT;
        const selfSignedConfig = {
            host: emailHost,
            port: parseInt(emailPort)
        };
        var transporter = nodemailer.createTransport(selfSignedConfig);
        const info = await transporter.sendMail({
            from: nameFrom + ' ' + emailFrom,
            to: process.env.EMAIL_TO,
            subject: subject,
            html: sanitizedBody,
        });
        res.send({ data: 'Sent' });
    } catch (error) {
        console.log(error);
    }
});
