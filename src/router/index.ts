import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const staticRoutes = [
 
  {
    path: "",
    meta: {
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "layout" */ "../components/layouts/mainLayout/Layout.vue"
      ),
    children: [
      {
        name: "home",
        path: "",
        meta: {
          requiresAuth: true,
        },
        component: () =>
          import(/* webpackChunkName: "HomePage" */ "../views/Home.vue"),
      },
    ],
  },
 
];

const routes: Array<RouteRecordRaw> = [
  ...staticRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
