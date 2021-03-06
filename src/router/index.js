import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: function () {
    //   return import(/* webpackChunkName: "about" */ '../views/Settings.vue')
    // }
  },
  {
    path: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
