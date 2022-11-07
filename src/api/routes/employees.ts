import express, { Request, Response } from "express";
import { EnsureAuthenticated } from "./auth"
import { AppUser, Team } from "../models/user";
import axios from "axios";

export const employeesRouter = express.Router();

employeesRouter.post("/", EnsureAuthenticated, async (req: Request, res: Response) => {

    var employeesByDept = Object();

    axios.get('http://localhost:8080/employees.json')
    .then((response: any) => {

        var resultEmployees = response.data.employees;
        var search = req.query.search;
        var searchTerm = "";
        var departments = Array();

        resultEmployees.forEach(function (element: any) {
            departments.push(element.department);
        });

        var departmentsUq = departments.filter(function(elem, index, self) {
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
                if(keyDept == elementEm.department && elementEm.division !== null ){
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
