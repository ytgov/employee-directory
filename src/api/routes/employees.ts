import express, { Request, Response } from "express";
import { EnsureAuthenticated } from "./auth"
import { AppUser, Team } from "../models/user";
import axios from "axios";
import { body, param } from "express-validator";

export const employeesRouter = express.Router();

employeesRouter.post("/", EnsureAuthenticated, async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get('http://localhost:8080/json/employees.json')
        .then((response: any) => {

            var resultEmployees = response.data.employees;
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

employeesRouter.post("/organization-detail/:department/:division", [param("department", "division").notEmpty()], EnsureAuthenticated, async (req: Request, res: Response) => {
    const page = req.body.page || 1;
    const itemsPerPage = req.body.itemsPerPage || 100;
    const start = (page - 1) * itemsPerPage;
    const sortBy = req.body.sortBy || []; // capable of sort by multiple columns
    const sortDesc = req.body.sortDesc || []; // likewise
    var search = req.query.search;
    var searchTerm = "";
    var employeesByDept: any[] = Array();
    let paramDepartment = (req.params.department).replace('-', " ");
    axios.get('http://localhost:8080/json/employees.json', { params: { department: paramDepartment } })
        .then((response: any) => {
            var resultEmployees = response.data.employees;

            interface EmployeeTable {
                full_name: string
                title: string
                division: string
                branch: string
                department: string
                manager: string
                division_url: string
                full_name_url: string
            }
            resultEmployees.forEach(function (element: any) {
                var division_url = element.division !== null ? element.division.replace(/\s/g, "-") : '';

                var employee: EmployeeTable = {
                    'full_name': element.full_name.replace(".", " "),
                    'title': element.title !== '' ? element.title : '-',
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '-',
                    'department': element.department,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                };

                employeesByDept.push(employee);


            });

            employeesByDept = employeesByDept.filter(item => { return item.department.indexOf(req.params.department) >= 0 })

            if (search?.length) {
                console.log(search)
                searchTerm = search.toString().trim();
                employeesByDept = employeesByDept.filter(item => { return item.full_name.indexOf(searchTerm) >= 0 || item.title.indexOf(searchTerm) >= 0 || item.division.indexOf(searchTerm) >= 0 || item.branch.indexOf(searchTerm) >= 0 })
            }
            if (sortBy.length > 0) {
                const sorter = sortBy[0];
                if (sortDesc[0]) {
                    employeesByDept = employeesByDept.sort((a, b) => { return a[sorter].localeCompare(b[sorter]); })
                } else {
                    employeesByDept = employeesByDept.sort((a, b) => { return b[sorter].localeCompare(a[sorter]); })
                }
            }
            res.send({ data: employeesByDept.slice(start, start + itemsPerPage), meta: { count: employeesByDept.length } });
        })
        .catch((error: any) => {
            console.log(error);
        });
});



employeesRouter.post("/organization-detail/:department/", [param("department").notEmpty()], EnsureAuthenticated, async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get('http://localhost:8080/json/employees.json')
        .then((response: any) => {

            var resultEmployees = response.data.employees;
            var urlDepartment = req.params.department;
            var departments = Array();
            var divisions = Array();
            

            resultEmployees.forEach(function (element: any) {
                if (element.department === urlDepartment){
                    departments.push(element.department);  
                    divisions.push(element.division);      
                }
            });

            var divisionsReady = divisions.filter(function (elem, index, self) {
                return index === self. indexOf(elem);
            });

            divisionsReady.forEach((elementDiv: any) => {
                var keyDiv = elementDiv;
                var arrayDivElements = Array();
                var arrayDivElementssUq = Array();

                resultEmployees.forEach(function (elementDiv: any) {
                    if(keyDiv == elementDiv.division && elementDiv.branch !== null) {
                        if(!arrayDivElementssUq.includes(elementDiv.branch)) {
                            arrayDivElements.push(elementDiv);
                            arrayDivElementssUq.push(elementDiv.branch)
                            
                        }
                    }
                    
                })
                employeesByDept[elementDiv] = arrayDivElements;
            });
            res.send({ data: employeesByDept, meta: { count: 0 } });

        })
        .catch((error: any) => {
            console.log(error);
        });
});