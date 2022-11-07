import express, { Request, Response } from "express";
import { EnsureAuthenticated } from "./auth"
import { AppUser, Team } from "../models/user";
import axios from "axios";

export const dataRouter = express.Router();

dataRouter.post("/", EnsureAuthenticated, async (req: Request, res: Response) => {

    axios.get('http://localhost:8080/employees.json')
    .then((response: any) => {
        var results: any = [...response.data.employees]

        const page = req.body.page || 1;
        const itemsPerPage = req.body.itemsPerPage || 10;
        const start = (page - 1) * itemsPerPage;
        const sortBy = req.body.sortBy || []; // capable of sort by multiple columns
        const sortDesc = req.body.sortDesc || []; // likewise
        var search = req.query.search;
        var searchTerm = "";


        /*for (var i = 0; i < 10000; i++) {
            results.push({ id: i, name: "Education" + i })
        }*/

        let responseResult

        if (search) {
            var find = '-';
            var reg = new RegExp(find, 'g');

            searchTerm = search.toString().trim();
            const params = searchTerm.split('-%252F-');
            const [department, division] = params;

            const formattedDepartment = department.replace(reg, ' ')
            const formattedDivision = division ? division.replace(reg, ' ') : null;

            responseResult = results.filter((item:any) => {
                if (formattedDivision) {
                    return item.department == formattedDepartment && item.division == formattedDivision;
                }
                return item.department == formattedDepartment
            })
        }

        /* if (sortBy.length > 0) {
            const sorter = sortBy[0];

            if (sorter == "id") {
                if (sortDesc[0])
                    results = results.sort((a:any, b:any) => { return a.id - b.id; })
                else
                    results = results.sort((a:any, b:any) => { return b.id - a.id; })
            }
            else if (sorter == "name") {
                if (sortDesc[0])
                    results = results.sort((a:any, b:any) => { return a.name.localeCompare(b.name); })
                else
                    results = results.sort((a:any, b:any) => { return b.name.localeCompare(a.name); })
            }
        }

        res.send({ data: results.slice(start, start + itemsPerPage), meta: { count: results.length } }); */
        const responseResultFiltred = responseResult.map((item: any, index: number) => {
            return ({
                id: index,
                name: `${item.first_name} ${item.last_name}`,
                position: item.title,
                department: item.department,
                division: item.division,
                branch: item.branch,
            })
        }).slice(start, start + itemsPerPage);

        res.send({ data: responseResultFiltred,  meta: { count: responseResult.length } });

    })
    .catch((error: any) => {
        console.log(error);
    });
});
