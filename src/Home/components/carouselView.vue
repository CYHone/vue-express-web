<template>
    <div class="container">
      <!-- 轮播图容器 -->
      <div class="carousel-container">
        <!-- 轮播图内容 -->
        <div class="block text-center">
          <!-- <span class="demonstration">轮播图</span> -->
          <!-- 轮播图组件 -->
          <el-carousel height="600px" motion-blur :interval="2000">
            <el-carousel-item v-for="(item, index) in imageList" :key="index">
              <!-- 图片 -->
              <img :src="item.src" :alt="'Slide ' + index" class="carousel-image">
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 日历容器 -->
      <div class="calendar-container">
        <!-- 日历内容 -->
        <div class="block text-center">
          <!-- <span class="demonstration">日历</span> -->
          <!-- 日历组件 -->
          <el-calendar v-model="value" class="calendar"></el-calendar>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const value = ref(new Date())
  
  const imageList = [
    { src: 'src/assets/images/1.jpg' },
    { src: 'src/assets/images/2.jpg' },
    { src: 'src/assets/images/3.jpg' },
    { src: 'src/assets/images/4.png' },
    // Add more images as needed
  ];
  </script>
  
  <style scoped>
  /* 容器样式 */
  .container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* height: 800px; 修改容器的高度 */
  }
    
    /* 轮播图和日历容器样式 */
    .carousel-container {
    margin: 20px;
    width: 75%; /* 修改为占70% */
    }

    .calendar-container {
    margin: 20px;
    width: 25%; /* 剩下的30%给日历容器 */
    }

  
  /* 块级元素样式 */
  .block {
    border: 2px solid #ddd;
    border-radius: 10px;
    padding: 20px;
  }
  
  /* 标题样式 */
  .demonstration {
    font-size: 20px;
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
  }
  
  /* 轮播图图片样式 */
  .carousel-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
  
  /* 日历样式 */
  .calendar {
    width: 100%; /* 将日历宽度设置为100%，以充满容器 */
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  </style>
  