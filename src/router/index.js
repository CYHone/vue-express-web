import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
     {
       path:'/',
       name:'首页',
       component:() => import('@/Layout/homeView.vue')
     },
     {
      path:'/login',
      name:'登录',
      component:() => import('@/components/login.vue')
     },
     {
      path:'/register',
      name:'注册',
      component:() => import('@/components/register.vue')
     },
     {
      path:'/shipment',
      name:'运单',
      component:() => import('@/components/createShipment.vue')
     },
     {
      path:'/package',
      name:'包裹',
      component:() => import('@/components/createPackage.vue')
     },
     {
      path:'/inquire',
      name:'查询',
      component:() => import('@/inquire/inquireView.vue')
     },
     {
      path:'/inquire/MapContainer',
      name:'运单查询',
      component:() => import('@/inquire/MapContainer.vue')
     },
     {
      path:'/user',
      name:'用户',
      component:() => import('@/components/user.vue')
     },
     {
      path:"/address",
      name:'地址簿',
      component:() => import('@/components/address.vue')
     }
  ]
})


export default router
