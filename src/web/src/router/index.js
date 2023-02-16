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
    redirect: {name: "Find a government employee"},
    // validate: (to, from, next) => {
    //   const pattern = /^[-a-zA-Z0-9@:%._\+~#=]{2,256}$/
    //   if (pattern.test(to.params.url)) {
    //     try {
    //       console.log('TEST!!!')
    //       to.params.url = decodeURIComponent(to.params.url.replace(/%/g, '%25'))
    //       next()
    //     } catch (error) {
    //       next({ name: 'Not Found' })
    //     }
    //   } else {
    //     next({ name: 'Not Found' })
    //   }
    // }
  },
  {
    path: "/find-Employee/employee-detail/:department/:full_name",
    name: "Employee Detail",
    component: EmployeeDetail,
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Find a government employee', link: '/Find-Employee'},
        {name: 'Department', link: '/find-employee/Department' , dynamic: true},
        {name: 'Division', link: '/find-employee/Department/Division' , dynamic: true},
        {name: 'Branch', link: '/find-employee/Department/Division/Branch' , dynamic: true},
        {name: 'Username', dynamic: true}
      ]
    }
  },
  {
    path: "/find-employee/search/keyword=:full_name&department=:department?",
    name: "Search Employee",
    component: EmployeeSearch,
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Find a government employee', link: '/Find-Employee'},
        {name: 'Department', link: '/find-employee/Department' , dynamic: true},
        {name: 'Search', dynamic: true},
      ]
    }
  },
  {
    path: "/find-employee/:department/:division/:branch?", 
    name: "Data grid",
    component: Grid,
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Find a government employee', link: '/find-employee'},
        {name: 'Department', link: '/find-employee/Department', dynamic: true},
        {name: 'Division', link: '/find-employee/Department/Division', dynamic: true},
        {name: 'Branch', dynamic: true}
      ]
    }
  },
  {
    path: "/find-employee/:department",
    name: "Department",
    component: Department,
    
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Find a government employee', link: '/find-employee'},
        {name: 'Department', dynamic: true}
      ]
    }
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound,
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Page not found'},
      ]
    }
  },
  {
    path: "/find-employee/",
    name: "Find a government employee",
    component: Employees,
    child: [

    ],
    meta: {
      breadcrumb: [
        {name: 'Home', link: 'https://yukon.ca/'},
        {name: 'Find a government employee'},
      ]
    }
  },
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
});

// router.beforeEach((to, from, next) => {
//   console.log('test')
//   return next();
// });

export default router;
