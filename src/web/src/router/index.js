import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/NotFound.vue";
import Grid from "../components/Grid";
import Employees from "../components/Employees";
import Department from "../components/Department";
import EmployeeDetail from "../components/EmployeeDetail";
import EmployeeSearch from "../components/EmployeeSearch";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: {name: "Find a government employee"}
  },
  {
    path: "/find-Employee/employee-detail/:department/:full_name",
    name: "Employee Detail",
    component: EmployeeDetail,
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.FindAGovernmentEmployee', link: '/Find-Employee'},
        {name: 'Router.department', link: '/find-employee/Department' , dynamic: true},
        {name: 'Router.division', link: '/find-employee/Department/Division' , dynamic: true},
        {name: 'Router.branch', link: '/find-employee/Department/Division/Branch' , dynamic: true},
        {name: 'Router.username', dynamic: true}
      ]
    }
  },
  {
    path: "/find-employee/search/keyword=:full_name&department=:department?",
    name: "Search Employee",
    component: EmployeeSearch,
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.FindAGovernmentEmployee', link: '/Find-Employee'},
        {name: 'Router.department', link: '/find-employee/Department' , dynamic: true},
        {name: 'Router.search', dynamic: true},
      ]
    }
  },
  {
    path: "/find-employee/:department/:division/:branch?", 
    name: "Data grid",
    component: Grid,
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.FindAGovernmentEmployee', link: '/find-employee'},
        {name: 'Router.department', link: '/find-employee/Department', dynamic: true},
        {name: 'Router.division', link: '/find-employee/Department/Division', dynamic: true},
        {name: 'Router.branch', dynamic: true}
      ]
    }
  },
  {
    path: "/find-employee/:department",
    name: "Department",
    component: Department,
    
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.FindAGovernmentEmployee', link: '/find-employee'},
        {name: 'DeRouter.departmentpartment', dynamic: true}
      ]
    }
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound,
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.findEmployee', link: `/find-employee`},
        {name: 'Router.pageNotFound'},
      ]
    }
  },
  {
    path: "/find-employee/",
    name: "Find a government employee ",
    component: Employees,
    child: [

    ],
    meta: {
      breadcrumb: [
        {name: 'Router.home', link: 'https://yukon.ca/'},
        {name: 'Router.FindAGovernmentEmployee'},
      ]
    }
  },
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
});

export default router;
