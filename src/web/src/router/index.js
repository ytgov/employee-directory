import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Dashboard from "../components/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import Form from "../components/Form";
import Grid from "../components/Grid";
import Login from "../components/Login";
import LoginComplete from "../components/LoginComplete";
import Profile from "../components/Profile";
import store from "../store";
import Employees from "../components/Employees";
import Department from "../components/Department";
import EmployeeDetail from "../components/EmployeeDetail";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/form",
    name: "Basic Form",
    component: Form,
  },
  {
    path: "/Find-Employee/:department/:division",
    name: "Data grid",
    component: Grid,
    meta: {
      breadcrumb: [
        {name: 'Home', link: '/'},
        {name: 'Find a government employee', link: '/Find-Employee'},
        {name: 'Department', link: '/Find-Employee/Department', dynamic: true},
        {name: 'Division', dynamic: true}
      ]
    }
  },


  {
    path: "/Find-Employee/:department",
    name: "Department",
    component: Department,
    
    meta: {
      breadcrumb: [
        {name: 'Home', link: '/'},
        {name: 'Find a government employee', link: '/Find-Employee'},
        {name: 'Department', dynamic: true}
      ]
    }
  },
  {
    path: "/sign-in",
    name: "Login",
    component: Login
  },
  {
    path: "/Employee-Detail",
    name: "Employee Detail",
    component: EmployeeDetail
  },
  {
    path: "/login-complete",
    name: "LoginComplete",
    component: LoginComplete
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound
  },
  {
    path: "/Find-Employee/",
    name: "Find a government employee",
    component: Employees,
    child: [

    ],
    meta: {
      breadcrumb: [
        {name: 'Home', link: '/'},
        {name: 'Find a government employee'},
      ]
    }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
