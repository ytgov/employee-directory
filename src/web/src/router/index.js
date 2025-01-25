import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/NotFound.vue";
import Grid from "../components/Grid";
import Employees from "../components/Employees";
import Department from "../components/Department";
import EmployeeDetail from "../components/EmployeeDetail";
import EmployeeSearch from "../components/EmployeeSearch";
import { breadcrumbsSyncLocaleWithRoute } from "@/utils/localeUtils.js";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: {name: "Find a government employee"}
  },
  {
    path: "/:locale/find-employee/employee-detail/:department/:full_name",
    name: "Employee Detail",
    component: EmployeeDetail,
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_a_government_employee', link: '/:locale/find-employee'},
        {name: 'breadcrumbs.department', link: '/:locale/find-employee/Department' , dynamic: true},
        {name: 'breadcrumbs.division', link: '/:locale/find-employee/Department/Division' , dynamic: true},
        {name: 'breadcrumbs.branch', link: '/:locale/find-employee/Department/Division/Branch' , dynamic: true},
        {name: 'breadcrumbs.username', dynamic: true}
      ]
    }
  },
  {
    path: "/:locale/find-employee/search/keyword=:full_name&department=:department?",
    name: "Search Employee",
    component: EmployeeSearch,
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_a_government_employee', link: '/:locale/find-employee'},
        {name: 'breadcrumbs.search', dynamic: true},
      ]
    }
  },
  {
    path: "/:locale/find-employee/:department/:division/:branch?", 
    name: "Data grid",
    component: Grid,
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_a_government_employee', link: '/:locale/find-employee'},
        {name: 'breadcrumbs.department', link: '/:locale/find-employee/Department', dynamic: true},
        {name: 'breadcrumbs.division', link: '/:locale/find-employee/Department/Division', dynamic: true},
        {name: 'breadcrumbs.branch', dynamic: true}
      ]
    }
  },
  {
    path: "/:locale/find-employee/:department",
    name: "Department",
    component: Department,
    
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_a_government_employee', link: '/:locale/find-employee'},
        {name: 'breadcrumbs.department', dynamic: true}
      ]
    }
  },
  {
    path: "/:locale/page-not-found",
    name: "Not Found",
    component: NotFound,
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_employee', link: `/:locale/find-employee`},
        {name: 'breadcrumbs.page_not_found'},
      ]
    }
  },
  {
    path: "/:locale/find-employee/",
    name: "Find a government employee ",
    component: Employees,
    child: [

    ],
    meta: {
      breadcrumb: [
        {name: 'breadcrumbs.home', link: 'https://yukon.ca/:locale'},
        {name: 'breadcrumbs.find_a_government_employee'},
      ]
}  },
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
});

export default router;
