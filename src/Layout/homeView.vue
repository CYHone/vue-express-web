<script setup>
import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import IndexView from '../Home/indexView.vue'
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <!-- 加一个路由出口 -->
  <IndexView/>
  <RouterView />
  <LayoutFooter />
</template> 

