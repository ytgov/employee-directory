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
                    'organization':element.organization,
                    'department': element.department,
                    'division': element.division !== null ? element.division : '-',
                    'branch': element.branch !== null ? element.branch : '-',
                    'unit': element.unit,
                    'title': element.title !== '' ? element.title : '-',
                    'email':element.email,
                    'suite':element.suite,
                    'phone_office':element.phone_office,
                    'fax_office':element.fax_office,
                    'mobile': element.mobile,
                    'office': element.office,
                    'address':element.address,
                    'po_box':element.po_box,
                    'community':element.community,
                    'postal_code':element.postal_code,
                    'latitude': element.latitude,
                    'longitude':element.longitude,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'division_url': division_url,
                    'full_name_url': element.full_name,
                };
                
                employeeArr.push(employee);
               
            });

            let employeeFiltered = employeeArr.filter(item => { return item.full_name_url.indexOf(req.params.full_name) >= 0 })

            console.log(employeeFiltered)
            res.send({ data: employeeFiltered });
        })
        .catch((error: any) => {
            console.log(error);
        });
});

employeesRouter.post("/Find-Employee/:department/:division/:branch", [param("department"),param('division'),param('branch').notEmpty()], async (req: Request, res: Response) => {
    const page = req.body.page || 1;
    const itemsPerPage = req.body.itemsPerPage || 100;
    const start = (page - 1) * itemsPerPage;
    // const sortBy = req.body.sortBy || []; // capable of sort by multiple columns
    const sortDesc = req.body.sortDesc || []; // likewise
    
    var search = req.query.search;
    var searchTerm = "";
    var employeesByDept: any[] = Array();
    var find = '-';
    var reg = new RegExp(find, 'g');
    let paramDepartment = (req.params.department.replace(reg,' '))
    let paramDivision = (req.params.division)
    let paramBranch = (req.params.branch)
    console.log(paramBranch)

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
                managerSort: string
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
                    'branch': element.branch !== null ? element.branch : '-',
                    'email':element.email,
                    'phone_office': element.phone_office,
                    'department': element.department,
                    'manager': element.manager !== '' ? element.manager?.replace(".", " ") : '-',
                    'managerSort': '',
                    'employee': null,
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

            employeesByDept = employeesByDept.filter(item => { return item.department.indexOf(paramDepartment) >= 0 })

            if(paramBranch !== '-') {
                employeesByDept = employeesByDept.filter(item => { return item.branch.indexOf(paramBranch.replace(reg,' ')) >= 0 })
            }
            

            let managerArr = employeesByDept.map (a => a.manager)
            

            managerArr = managerArr.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
        
        
            let managers = employeesByDept.filter(function (e){
                return managerArr.includes(e.full_name)
            })
            let employeesByManager = employeesByDept.filter(function (e){
                return !managerArr.includes(e.full_name)
            })

            

            

            managers.forEach(element => {

                element.employee = employeesByManager.filter(item => {return item.manager.includes(element.full_name)})
                
            });
            
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

            res.send({ data: managers.slice(start, start + itemsPerPage), meta: { count: managers.length+employeesByManager.length } });
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