import express, { Request, Response } from "express";
import axios from "axios";
import { body, param } from "express-validator";
import { basename } from "path";

import sortBy from "lodash/sortBy";
import e from "express";

export const employeesRouter = express.Router();

employeesRouter.post("/", async (req: Request, res: Response) => {

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

employeesRouter.post("/Find-Employee/:department/:division", [param("department"),param('division'),param('branch').notEmpty()], async (req: Request, res: Response) => {
    const page = req.body.page || 1;
    const itemsPerPage = req.body.itemsPerPage || 100;
    const start = (page - 1) * itemsPerPage;
    // const sortBy = req.body.sortBy || []; // capable of sort by multiple columns
    const sortDesc = req.body.sortDesc || []; // likewise
    let branches= 'Service Innovation and Support';
    
    var search = req.query.search;
    var searchTerm = "";
    var employeesByDept: any[] = Array();

    

    let paramDepartment = (req.params.department)

   

    
    
    let paramDivision = (req.params.division)
    let paramBranch = (req.params.branch)
    axios.get('http://localhost:8080/json/employees.json', { params: { department: paramDepartment, division: paramDivision, branch: paramBranch, } })
        .then((response: any) => {
            var resultEmployees = response.data.employees;

            interface EmployeeTable {
                full_name: string
                title: string
                division: string
                branch: string
                department: string
                manager: string
                managerSort: string
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
                    'managerSort': '',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                };
                
                employeesByDept.push(employee);

            });
            employeesByDept.forEach(function (element:any){
                if(element.manager == null) {
                    element.manager = '-'
                }
                if(element.manager === '-' ) {
                    element.managerSort = element.full_name
                } else {
                    element.managerSort = element.manager
                }
            })

            employeesByDept = employeesByDept.filter(item => { return item.department.indexOf(req.params.department) >= 0 })
            

            let employeesSorted = sortBy(employeesByDept, ['managerSort']);

            employeesSorted = employeesSorted.filter(item => { return item.branch.indexOf(branches) >= 0 })
            
            
            let smn = employeesSorted.filter(item => {
                return item.full_name == item.managerSort
            })
            
            console.log(smn)
            
            

            if (search?.length) {
                searchTerm = search.toString().trim();
                employeesSorted = employeesSorted.filter(item => { return item.full_name.indexOf(searchTerm) >= 0 || item.title.indexOf(searchTerm) >= 0 || item.division.indexOf(searchTerm) >= 0 || item.branch.indexOf(searchTerm) >= 0 })
            }

            // if (sortBy.length > 0) {
            //     const sorter = sortBy[0];
            //     if (sortDesc[0]) {
            //         employeesByDept = employeesByDept.sort((a, b) => { return a[sorter].localeCompare(b[sorter]); })
            //     } else {
            //         employeesByDept = employeesByDept.sort((a, b) => { return b[sorter].localeCompare(a[sorter]); })
            //     }
            // }

            res.send({ data: employeesSorted.slice(start, start + itemsPerPage), meta: { count: employeesSorted.length } });
        })
        .catch((error: any) => {
            console.log(error);
        });
});



employeesRouter.post("/Find-Employee/:department/", [param("department").notEmpty()], async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get('http://localhost:8080/json/employees.json')
        .then((response: any) => {

            var find = '-';
            var reg = new RegExp(find, 'g');
            var resultEmployees = response.data.employees;
            var urlDepartment = req.params.department.replace(reg, " ");
            var departments = Array();
            var divisions = Array();
            

            resultEmployees.forEach(function (element: any) {
                if (element.department === urlDepartment){
                    departments.push(element.department);  
                    if (element.division == null ) {
                        element.division = 'N/A'
                    }
                    divisions.push(element.division);
                    divisions.push(divisions.splice(divisions.indexOf('N/A'), 1)[0]);     
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
                    } else if(elementDiv.branch == null) {      
                        elementDiv.branch = 'N/A'
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