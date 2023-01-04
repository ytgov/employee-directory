import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import _ from 'lodash';

import * as dotenv from "dotenv";

let path;
switch (process.env.NODE_ENV) {
    default:
        path = `.env.development`;
}
dotenv.config({ path: path });

export const EMPLOYEEJSON = process.env.EMPLOYEEJSON;
export const DIVISIONSJSON = process.env.DIVISIONSJSON;


export const employeesRouter = express.Router();

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


    let paramDepartment = (req.params.department)

    if (paramDepartment === 'any-department') {
        paramDepartment = ''
    } else {
        paramDepartment = (req.params.department.replace(reg, ' '))
    }
    let paramFullName = (req.params.full_name).replace(".", " ")


    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment, full_name: paramFullName } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;



            interface EmployeeTable {
                full_name: string
                title: string
                division: string
                branch: string
                email: String
                phone_office: String
                department: string
                manager: string
                managerSorter: string
                division_url: string
                full_name_url: string
                value: number
                address: String
                community: String
            }


            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, '-') : '';

                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'title': element.title !== '' ? element.title : '-',
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '',
                    'email': element.email,
                    'phone_office': element.phone_office !== '' ? element.phone_office : '-',
                    'department': element.department,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'managerSorter': '',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                    'value': 0,
                    'address': element.address,
                    'community': element.community,
                };


                employeesByDept.push(employee);

            });

            employeesByDept = employeesByDept.filter(item => { return item.full_name.toLowerCase().indexOf(paramFullName) >= 0 })

            employeesByDept = employeesByDept.filter(item => { return item.department.toLowerCase().indexOf(paramDepartment) >= 0 })


            let departments = _.groupBy(employeesByDept, item => `${item.department}`);


            for (const [key, value] of Object.entries(departments)) {
                const groupByDivision: any = _.groupBy(departments[key], (department) => department.division);

                departments[key] = groupByDivision;

            }

            let location = _.groupBy(employeesByDept, item => `${item.address}, ${item.community}`);

            let position = _.groupBy(employeesByDept, item => `${item.title}`);

            let finalResult: any

            if (groupBy === 0) {
                finalResult = employeesByDept
            } else if (groupBy === 1) {
                finalResult = departments
            } else if (groupBy === 2) {
                finalResult = location
            } else if (groupBy === 3) {
                finalResult = position
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

    let paramDepartment = (req.params.department).replace(reg, ' ')
    let paramFullName = (req.params.full_name)



    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment, full_name: paramFullName } })
        .then((response: any) => {
            var resultEmployees = response.data.employees;
            interface EmployeeTable {
                full_name: string
                organization: String
                department: string
                division: string
                branch: string
                unit: String
                title: string
                email: String
                suite: String
                phone_office: String
                fax_office: String
                mobile: String
                office: String
                address: String
                po_box: String
                community: String
                postal_code: String
                latitude: String
                longitude: String
                manager: string
                division_url: string
                full_name_url: string
            }
            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, "-") : '';

                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'organization': element.organization,
                    'department': element.department,
                    'division': element.division,
                    'branch': element.branch,
                    'unit': element.unit,
                    'title': element.title,
                    'email': element.email,
                    'suite': element.suite,
                    'phone_office': element.phone_office,
                    'fax_office': element.fax_office,
                    'mobile': element.mobile,
                    'office': element.office,
                    'address': element.address,
                    'po_box': element.po_box,
                    'community': element.community,
                    'postal_code': element.postal_code,
                    'latitude': element.latitude,
                    'longitude': element.longitude,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                };

                employeeArr.push(employee);

            });

            let employeeFilteredByDpt = employeeArr.filter(item => { return item.department.toLowerCase().indexOf(paramDepartment) >= 0 })

            let employeeFiltered = employeeFilteredByDpt.filter(item => { return item.full_name_url.toLowerCase().indexOf(paramFullName) >= 0 })

            let managerName: any

            employeeFiltered.forEach((element) => {
                managerName = element.manager
            })

            let managerFilter = employeeArr.filter(item => { return item.full_name.indexOf(managerName) >= 0 })

            
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

    let paramDepartment = (req.params.department.replace(reg, ' '))
    let paramDivision = (req.params.division)
    let paramBranch = (req.params.branch)

    if (paramDivision === 'not-division') {
        paramDivision = ''
    } else {
        paramDivision = (req.params.division.replace(reg, ' '))
    }

    var notBranch =  paramBranch === 'not-branch' ;
    if (paramBranch === 'all-branches' || paramBranch === 'all branches') {
        paramBranch = ''
    } else {
        paramBranch = req.params.branch.replace(reg, ' ')
    }

    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            interface EmployeeTable {
                full_name: string
                title: string
                division: string
                branch: string
                email: String
                phone_office: String
                department: string
                manager: any
                division_url: string
                full_name_url: string
                value: number
                address: string
                community: string
            }
            
            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, '-') : '';
                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'title': element.title !== '' ? element.title : '-',
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '',
                    'email': element.email,
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
            //Filter by Division
            employeesByDivision = _.filter(employeesByDivision, (employee: any) => employee.full_name !== employee.manager);
            if (paramDivision !== '') {
                employeesByDivision = employeesByDept.filter(item => { return item.division.toLowerCase().indexOf(paramDivision) >= 0 })
            }
            //Filter by Branch
            if(notBranch){
                employeesByDivision = employeesByDivision.filter(item => {return  _.isUndefined(item.branch) || _.isEmpty(item.branch)  })
            }else if (paramBranch !== '') {
                employeesByDivision = employeesByDivision.filter(item => { return item.branch.toLowerCase().indexOf(paramBranch) >= 0 })
            }

            //Get all the Managers' name
            var managersNameByDivision = _.uniq(_.map(employeesByDivision, 'manager'));
            //Get all the employees' name
            var namesByDivision = _.map(employeesByDivision, 'full_name');

            //Check if all managers exist in the consulted department/branch.
            var namesMissing = _.difference(managersNameByDivision, namesByDivision);
           
            if(!_.isEmpty(namesMissing)){
                managersMissing =  namesMissing.map(function(name:string) {
                    let managerMissing = _.find(employeesByDept, {full_name:name});
                    if(!_.isUndefined(managerMissing)){
                        managerMissing.manager = managerMissing.full_name;
                        return managerMissing;
                    }
                });
            }
            managersMissing = _.compact(managersMissing);

            //Add the managers missing in the array
            if(!_.isEmpty(employeesByDivision) && !_.isEmpty(managersMissing)){
                 employeesByDivision = _.union(employeesByDivision, managersMissing);
            }

            //Obtain all objects from managers
            let managersByDivision = employeesByDivision.filter(item => {
                if( _.isEmpty(item.manager) || item.manager === '-' ||  item.manager === item.full_name){
                     item.level = 0;
                     return true;
                }
            });
            //Obtain all employee objects that are not in the Managers array.
            let employeesByManager = employeesByDivision.filter(function (e) {
                return !_.find(managersByDivision, {full_name:e.full_name})
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
                employeesList = currentEmployees.map(function(item:any) {
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
                levelOfDepth = _.isUndefined(manager.level) ?  0 : manager.level;
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
            //Get the number of the employees display in the grid.
            let divLength = finalResult.length

            let endResult: any
            //Return the grouped array 
            if (groupBy === 0) {
                endResult = finalResult
            } else if (groupBy === 1) {
                endResult =  _.groupBy(finalResult, function (item: any) { return `${item.address}, ${item.community}` });
            } else if (groupBy === 2) {
                endResult = _.groupBy(finalResult, function (item: any) { return `${item.title}` });
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
    let paramDepartment = (req.params.department.replace(reg, ' '))
    var employeesByDept = Object();

    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;



            employeesByDept = resultEmployees.filter(function (e: any) {
                return e.department.toLowerCase().indexOf(paramDepartment) >= 0
            })

            let employeesByDeptSorted = _.sortBy(employeesByDept, ['null', 'division', 'branch'], ['desc', 'asc'])

            employeesByDept.forEach((element: any) => {
                if (element.division === null) {
                    element.division = 'N/A'
                }
                if (element.branch === null) {
                    element.branch = 'N/A'
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

employeesRouter.post("/DivisionsCard", async (req: Request, res: Response) => {

    var find = '-';
    var reg = new RegExp(find, 'g');
    const paramDepartment = req.body.department

    var employeesByDept = Object();


    axios.get(String(EMPLOYEEJSON), { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;

            employeesByDept = resultEmployees.filter(function (e: any) {
                return e.department.toLowerCase().indexOf(paramDepartment) >= 0
            })

            let employeesByDeptSorted = _.sortBy(employeesByDept, ['null', 'division', 'branch'], ['desc', 'asc'])

            employeesByDept.forEach((element: any) => {
                if (element.division === null) {
                    element.division = 'N/A'
                }
                if (element.branch === null) {
                    element.branch = 'N/A'
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