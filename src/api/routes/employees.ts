import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import _ from 'lodash';
import * as dotenv from "dotenv";
import nodemailer from "nodemailer";

import { EmployeeTable } from './interface';

let path;
switch (process.env.NODE_ENV) {
    case "test":
      path = `.env.test`;
      break;
    case "production":
      path = `.env.production`;
      break;
    default:
      path = `.env.development`;
  }
dotenv.config({ path: path });

import employee_json from '../json/employees.json';
import division_json from '../json/division.json';

export const EMPLOYEEJSON = process.env.EMPLOYEEJSON_local;
export const DIVISIONSJSON = process.env.DIVISIONSJSON_local;

export const ESRI_KEY = process.env.ESRI_KEY;

export const employeesRouter = express.Router();

employeesRouter.get("/json/:file", async (req: Request, res: Response) => {
    const filename = req.params.file;
    const file = `../json/${filename}`;

    if (filename == 'employees.json') res.send(employee_json);
    if (filename == 'division.json') res.send(division_json);
});


employeesRouter.post("/", async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get(String(DIVISIONSJSON))
        .then((response: any) => {

            var resultEmployees = response.data.divisions;
            var search = req.query.search;
            var searchTerm = "";
            var departments = Array();

            resultEmployees.forEach(function (element: any) {
                departments.push(element.department);
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
            console.log(error);
        });
});

employeesRouter.post("/find-employee/search/keyword=:full_name?&department=:department?", [param("full_name", "department").notEmpty()], async (req: Request, res: Response) => {

    var employeesByDept: any[] = Array();
    let groupBy = (req.body.groupBy) || 0;
    const itemsPerPage = (req.body.itemsPerPage);
    var find = '-';
    var reg = new RegExp(find, 'g');
    let paramDepartment = (req.params.department).replace(/\--/g, '-/-')
    let paramFullName = (req.params.full_name).replace(".", " ")

    if (paramFullName === 'any-employee') {
        paramFullName = ''
    } else {
        paramFullName = paramFullName
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

            if (paramDepartment !== '') {
                employeesByDept = employeesByDept.filter(item => { return item.department.indexOf(paramDepartment) >= 0 })
            }

            employeesByDept = _.orderBy(employeesByDept, [employee => employee.full_name], ['asc'])

            let departments = _.groupBy(employeesByDept, item => `${item.department}`);

            for (const [key, value] of Object.entries(departments)) {
                const groupByDivision: any = _.groupBy(departments[key], (department) => department.division);

                departments[key] = groupByDivision;

            }

            let location = _.groupBy(employeesByDept, item => `${item.address}, ${item.community}`);
            let position = _.groupBy(employeesByDept, item => `${item.title}`);
            let finalResult: any
            switch (groupBy) {
                case 0:
                    finalResult = employeesByDept
                    break;
                case 1:
                    finalResult = departments
                    break;
                case 2:
                    finalResult = location
                    break;
                case 3:
                    finalResult = position
                    break;
            }

            res.send({ data: finalResult, meta: { count: employeesByDept.length } });
        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/find-employee/employee-detail/:department/:full_name", [param("full_name", "department").notEmpty()], async (req: Request, res: Response) => {

    var employeeArr: any[] = Array();

    var find = '-';
    var reg = new RegExp(find, 'g');

    let paramDepartment = (req.params.department).replace(/\--/g, '-/-').replace(reg, ' ')
    let paramFullName = (req.params.full_name)

    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment, keyword: paramFullName } })
        .then(async (response: any) => {
            var resultEmployees = response.data.employees;

            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, "-") : '';

                interface EmployeeDetail extends EmployeeTable {

                    unit: String
                    fax_office: String
                    postal_code: String
                    mailcode: string
                    full_name_url: string
                    center: any
                    latitude: Number
                    longitude: Number
                }

                var employee: EmployeeDetail = {
                    'full_name': element.full_name.replace(".", " "),
                    'formatted_name': element.first_name + ' ' + element.last_name,
                    'department': element.department,
                    'division': element.division,
                    'branch': element.branch,
                    'unit': element.unit,
                    'title': element.title,
                    'email': element.email.toLowerCase(),
                    'phone_office': element.phone_office,
                    'fax_office': element.fax_office,
                    'address': element.address,
                    'community': element.community,
                    'postal_code': element.postal_code,
                    'mailcode': element.mailcode,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                    'latitude': element.latitude,
                    'longitude': element.longitude,
                    'value': 0,
                    'center': { "lat": 0, "lng": 0 }
                };

                employeeArr.push(employee);

            });
            let employeeFilteredByDpt = employeeArr.filter(item => { return item.department.indexOf(paramDepartment) >= 0 })

            let employeeFiltered = employeeFilteredByDpt.filter(item => { return item.full_name_url.indexOf(paramFullName) >= 0 })

            if (employeeFiltered.length === 0) {
                return res.send({ data: true })
            }


            if (employeeFiltered[0].community && employeeFiltered[0].address !== '' || null) {
                if (employeeFiltered[0].latitude !== null) {
                    employeeFiltered[0].center.lat = employeeFiltered[0].latitude
                    employeeFiltered[0].center.lng = employeeFiltered[0].longitude
                } else {

                    await axios.get(`https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address={${employeeFiltered[0].community},${employeeFiltered[0].address}}&outFields={}&f=json&token=${ESRI_KEY}`)
                        .then((response: any) => {
                            const center = response.data.candidates[0].location
                            employeeFiltered[0].center.lat = center.y
                            employeeFiltered[0].center.lng = center.x
                        }).catch((error: any) => {
                            console.log(error)
                        })
                }
            } else employeeFiltered[0].center = null

            let managerName: any

            employeeFiltered.forEach((element) => {
                managerName = element.manager
            })

            let managerFilter: any[] = employeeArr.filter(item => { return item.full_name.indexOf(managerName) >= 0 })
            res.send({ data: employeeFiltered, meta: { manager: managerFilter } });
        })
        .catch((error: any) => {
            console.log(error);
        });
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

    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
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

            employeesByDept = employeesByDept.filter(item => {
                return item.department.indexOf(paramDepartment) >= 0
            })

            let employeesByDivision = employeesByDept

            //Filter by Division  
            if(onlyDept){

            } else if (notDivision) {
                employeesByDivision = employeesByDivision.filter(item => { return item.division === '-' || _.isUndefined(item.division) || _.isEmpty(item.division) })
            } else {
                employeesByDivision = employeesByDept.filter(item => { return item.division.indexOf(paramDivision) >= 0 })
            }

            //Get the number of employees displayed in the grid.
            let divLength = employeesByDivision.length

            //Filter by Branch
            if(onlyDept) {

            } else if (notBranch) {
                employeesByDivision = employeesByDivision.filter(item => { return item.branch === '-' || _.isUndefined(item.branch) || _.isEmpty(item.branch) })
            } else if (paramBranch !== '') {
                employeesByDivision = employeesByDivision.filter(item => { return item.branch.indexOf(paramBranch) >= 0 })
            }

            //Get all the Managers' name
            var managersNameByDivision = _.uniq(_.map(employeesByDivision, 'manager'));
            //Get all the employees' name
            var namesByDivision = _.map(employeesByDivision, 'full_name');

            //Check if all managers exist in the consulted department/branch.
            var namesMissing = _.difference(managersNameByDivision, namesByDivision);

            if (!_.isEmpty(namesMissing)) {
                managersMissing = namesMissing.map(function (name: string) {
                    let managerMissing = _.find(employeesByDept, { full_name: name });
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
            console.log(error);
        });
});

employeesRouter.post("/find-employee/:department/", [param("department").notEmpty()], async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    var _ = require("lodash");
    let paramDepartment = (req.params.department.replace(reg, ' ').replace(/\--/g, '-/-'))
    var employeesByDept = Object();
    let error = false

    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;

            employeesByDept = resultEmployees.filter(function (e: any) {
                return e.department.indexOf(paramDepartment) >= 0
            })

            if (employeesByDept.length == 0) {
                res.send({  meta: { count: 0, error: true } });
                return
            }

            let employeesByDeptSorted = _.sortBy(employeesByDept, ['null', 'division', 'branch'], ['desc', 'asc'])

            employeesByDept.forEach((element: any) => {
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

            res.send({ data: division, meta: { count: 0, error } });

        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/DivisionsCard", async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    const paramDepartment = req.body.department.replace(/\--/g, '-/-')

    var employeesByDept = Object();


    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;

            employeesByDept = resultEmployees.filter(function (e: any) {
                return e.department.indexOf(paramDepartment) >= 0
            })


            let employeesByDeptSorted = _.sortBy(employeesByDept, ['null', 'division', 'branch'], ['desc', 'asc'])

            employeesByDept.forEach((element: any) => {
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

    axios.get(String(DIVISIONSJSON))
        .then((response: any) => {

            var resultEmployees = response.data.divisions;
            var departments = Array();
            resultEmployees.forEach(function (element: any) {
                departments.push(element.department);
            });

            var departmentsUq = departments.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
            res.send({ data: departmentsUq, meta: { count: 0 } });

        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/feedbackForm", async (req: Request, res: Response) => {
    try {
        //Content from client
        let feedbackContentSubject = (req.body.emailSubject);
        let feedbackFormContent = (req.body.emailBody);
        let emailDate = new Date();;
        let pageUrl = (req.body.pageUrl)

        const bodyContentFormatted = 
        `<p><strong>Submited on:</strong> ${emailDate.toLocaleString()}</p>
        <p><strong>${feedbackContentSubject} :</strong> ${feedbackFormContent}</p> 
        <p<strong>URL:</strong> <a href="${pageUrl}">${pageUrl}</a></p>`;


        const emailHost = process.env.SMTP_SERVER;
        const emailPort:string = process.env.SMTP_PORT!;
        const emailFrom = process.env.EMAIL_FROM;
        const emailPass = process.env.SMTP_PASS;
        const nameFrom = process.env.NAME_FROM;
        const subject =  process.env.EMAIL_SUBJECT;
        const transporter = nodemailer.createTransport({
            host: emailHost,
            port: parseInt(emailPort),
            requireTLS: false,
            secure: false,
            auth: {
                user: emailFrom,
                pass: emailPass + 'pp',
            },
            });

        const info = await transporter.sendMail({
            from: nameFrom +' ' + emailFrom,
            to: process.env.EMAIL_TO,
            subject: subject,
            html: bodyContentFormatted,
        });
        
        res.send({ data: 'Sent' });
    } catch (error) {
        console.log(error);
    }
});