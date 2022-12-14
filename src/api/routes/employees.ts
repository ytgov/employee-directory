import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import { basename } from "path";

import sortBy from "lodash/sortBy";
import e from "express";
import { forEach } from "lodash";

export const employeesRouter = express.Router();

employeesRouter.post("/", async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get('http://localhost:8080/json/division.json')
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

employeesRouter.post("/Find-Employee/Employee-Detail/:full_name", [param("full_name").notEmpty()], async (req: Request, res: Response) => {

    var employeeArr: any[] = Array();
    let paramFullName = (req.params.full_name)
    axios.get('http://localhost:8080/json/employees.json', { params: { full_name: paramFullName } })
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

            let employeeFiltered = employeeArr.filter(item => { return item.full_name_url.indexOf(req.params.full_name) >= 0 })

            res.send({ data: employeeFiltered });
        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/find-employee/:department/:division/:branch?", [param("department", "division"), param('branch').notEmpty()], async (req: Request, res: Response) => {
    const page = req.body.page || 1;
    const itemsPerPage = req.body.itemsPerPage || 100;
    const start = (page - 1) * itemsPerPage;
    // const sortBy = req.body.sortBy || []; // capable of sort by multiple columns
    const sortDesc = req.body.sortDesc || []; // likewise

    var search = req.query.search;
    var searchTerm = "";
    var employeesByDept: any[] = Array();
    var employeesFullList: any[] = Array();

    var _ = require("lodash");

    var find = '-';
    var reg = new RegExp(find, 'g');

    let paramDepartment = (req.params.department.replace(reg, ' '))
    let paramDivision = (req.params.division.replace(reg, ' '))
    let paramBranch = (req.params.branch)

    if (paramBranch === '3ajd9h') {
        paramBranch = ''
    } else {
        paramBranch = req.params.branch.replace(reg, ' ')
    }

    axios.get('http://localhost:8080/json/employees.json', { params: { department: paramDepartment, division: paramDivision, branch: paramBranch, } })
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
                employee: any
                division_url: string
                full_name_url: string
            }
            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, "-") : '';

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
                    'employee': null,
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                };

                employeesByDept.push(employee);



            });
            employeesByDept.forEach(function (element: any) {
                if (element.manager == null || element.manager == '' || element.manager == '-') {
                    element.manager = '-'
                }
                if (element.manager === '-') {
                    element.managerSorter = element.full_name
                } else {
                    element.managerSort = element.manager
                }
            })



            employeesByDept = employeesByDept.filter(item => { return item.department.toLowerCase().indexOf(paramDepartment) >= 0 })

            let compare = employeesByDept.filter(item => { return item.department.toLowerCase().indexOf(paramDepartment) >= 0 })

            let employeesByDivision = employeesByDept = employeesByDept.filter(item => { return item.division.toLowerCase().indexOf(paramDivision) >= 0 })

            let divLength = employeesByDivision.length

            if (paramBranch !== '' ) {
                employeesByDivision = employeesByDivision.filter(item => { return item.branch.toLowerCase().indexOf(paramBranch) >= 0 })
            }


            let managerArr = employeesByDivision.map(a => a.manager)


            managerArr = managerArr.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });


            let managers = compare.filter(function (e) {
                return managerArr.includes(e.full_name)
            })

            
            let employeesByManager = employeesByDivision.filter(function (e) {
                return !managers.includes(e.full_name)
            })

            const getEmployeesByManager = (employeesArray: any, currentManager: any) => {
                const currentEmployees = employeesArray.filter((employee: any) => employee.manager === currentManager.full_name);

                if (!currentEmployees.length) {
                    return currentManager;
                }

                let employeesList: any = [];
                for (const manager of currentEmployees) {
                    const employees = getEmployeesByManager(employeesArray, manager);
                    employeesList = [...employeesList, employees];
                }
                return [currentManager, ...employeesList.flat()];
            }

            let result: any = [];

            for (const manager of managers) {
                result = [...result, ...getEmployeesByManager(employeesByManager, manager)];
            }

            if (search?.length) {
                searchTerm = search.toString().trim();
                employeesByDept = employeesByDept.filter(item => { return item.full_name.indexOf(searchTerm) >= 0 || item.title.indexOf(searchTerm) >= 0 || item.division.indexOf(searchTerm) >= 0 || item.branch.indexOf(searchTerm) >= 0 })
            }

            // if (sortBy.length > 0) {
            //     const sorter = sortBy[0];
            //     if (sortDesc[0]) {
            //         employeesByDept = employeesByDept.sort((a, b) => { return a[sorter].localeCompare(b[sorter]); })
            //     } else {
            //         employeesByDept = employeesByDept.sort((a, b) => { return b[sorter].localeCompare(a[sorter]); })
            //     }
            // }

            result = result.filter(function (elem:any, index:any, self:any) {
                return index === self.indexOf(elem);
            });

            res.send({ data: result.slice(start, start + itemsPerPage), meta: { branchCount: result.length, divisionCount: divLength } });
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

    axios.get('http://localhost:8080/json/employees.json', { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            var urlDepartment = req.params.department.replace(reg, " ");
            var departments = Array();
            var divisions = Array();


            resultEmployees.forEach(function (element: any) {
                if (element.department.toLowerCase() == urlDepartment) {
                    departments.push(element.department);
                    if (element.division == null) {
                        element.division = 'N/A'
                    }
                    divisions.push(element.division);
                    divisions.push(divisions.splice(divisions.indexOf('N/A'), 1)[0]);
                }
            });


            var divisionsReady = divisions.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });

            divisionsReady.forEach((elementDiv: any) => {
                var keyDiv = elementDiv;
                var arrayDivElements = Array();
                var arrayDivElementssUq = Array();

                resultEmployees.forEach(function (elementDiv: any) {
                    if (keyDiv == elementDiv.division && elementDiv.branch !== null) {
                        if (!arrayDivElementssUq.includes(elementDiv.branch)) {
                            arrayDivElements.push(elementDiv);
                            arrayDivElementssUq.push(elementDiv.branch)

                        }
                    }
                    if (elementDiv.branch == null) { elementDiv.branch = 'N/A' }

                })

                employeesByDept[elementDiv] = arrayDivElements;

            });


            res.send({ data: employeesByDept, meta: { count: 0 } });

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


    axios.get('http://localhost:8080/json/employees.json', { params: { department: paramDepartment } })
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            var urlDepartment = paramDepartment;
            var departments = Array();
            var divisions = Array();


            resultEmployees.forEach(function (element: any) {
                if (element.department.toLowerCase() == urlDepartment) {
                    departments.push(element.department);
                    if (element.division == null) {
                        element.division = 'N/A'
                    }
                    divisions.push(element.division);
                    divisions.push(divisions.splice(divisions.indexOf('N/A'), 1)[0]);
                }
            });


            var divisionsReady = divisions.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });

            divisionsReady.forEach((elementDiv: any) => {
                var keyDiv = elementDiv;
                var arrayDivElements = Array();
                var arrayDivElementssUq = Array();

                resultEmployees.forEach(function (elementDiv: any) {
                    if (keyDiv == elementDiv.division && elementDiv.branch !== null) {
                        if (!arrayDivElementssUq.includes(elementDiv.branch)) {
                            arrayDivElements.push(elementDiv);
                            arrayDivElementssUq.push(elementDiv.branch)

                        }
                    }
                    if (elementDiv.branch == null) { elementDiv.branch = 'N/A' }
                })

                employeesByDept[elementDiv] = arrayDivElements;

            });

            res.send({ data: employeesByDept, meta: { count: 0 } });

        })
        .catch((error: any) => {
            console.log(error);
        });
});