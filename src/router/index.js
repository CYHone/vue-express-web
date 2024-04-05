import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
     {
       path:'/',
       name:'首页',
       component:() => import('@/Layout/homeView.vue')
     },
  ]
})


export default router
