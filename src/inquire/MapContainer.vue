<script setup>
import { onMounted, onUnmounted } from "vue";
import axios from "axios";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;

onMounted(async () => {
  // 设置高德地图的安全配置
  window._AMapSecurityConfig = {
    securityJsCode: "a5603493b03449c9ef9a720b7e0c9d17",
  };
  // 加载高德地图
  AMapLoader.load({
    key: "c425c856a78bf66103539f7f48fe8428", 
    version: "2.0",
    plugins: ["AMap.Scale"], 
  })
    .then((AMap) => {
      // 创建地图实例
      map = new AMap.Map("container", {
        viewMode: "3D", // 设置地图为3D模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
      
      // 从 URL 中获取包裹 ID
      const packageId = new URLSearchParams(window.location.search).get('packageId');
      console.log('获得的包裹号为'+packageId);
      if (!packageId) {
        console.error("Package ID not found.");
        return;
      }

      // 发送异步请求获取包裹位置历史信息
      axios.get(`package/getPackageLocation?id=${packageId}`)
        .then(response => {
          // 获取返回的位置历史信息数组
          const locations = response.data.locations;
          // 绘制路径
          drawPath(locations);
        })
        .catch(error => {
          console.error('Failed to get package location history:', error);
        });
    })
    .catch((e) => {
      console.log(e);
    });
});

// 组件销毁时销毁地图实例
onUnmounted(() => {
  map?.destroy();
});

// 绘制路径的函数
function drawPath(locations) {
  // 判断地图实例是否存在和位置历史信息是否为空
  if (!map || locations.length === 0) return;

  // 将经纬度数组转换为 AMap.LngLat 对象数组
  const path = locations.map(location => new AMap.LngLat(location[0], location[1]));

  // 创建路径对象
  const polyline = new AMap.Polyline({
    path: path, // 设置路径的经纬度点数组
    borderWeight: 2, // 线条宽度
    strokeColor: "#3366FF", // 线条颜色
    lineJoin: "round", // 连接处样式
  });

  // 将路径添加到地图中
  map.add(polyline);
}
</script>

<template>
  <!-- 地图容器 -->
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>


<!-- <script setup>
import { onMounted, onUnmounted } from "vue";
import axios from "axios";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;

onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "a5603493b03449c9ef9a720b7e0c9d17",
  };
  AMapLoader.load({
    key: "c425c856a78bf66103539f7f48fe8428", 
    version: "2.0",
    plugins: ["AMap.Scale"], 
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D", 
        zoom: 11, 
        center: [116.397428, 39.90923], 
      });
      
      // 异步请求获取包裹位置历史信息
      const packageId = 'your_package_id'; // 替换为实际的包裹 ID
      axios.get(`package/getPackageLocation?id=${packageId}`)
        .then(response => {
          const locations = response.data.locations; // 假设返回的数据中包含位置历史信息数组
          drawPath(locations); // 调用绘制路径的函数
        })
        .catch(error => {
          console.error('获取包裹位置历史信息失败：', error);
        });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});

// 绘制路径的函数
function drawPath(locations) {
  // 假设 locations 是一个包含经纬度的数组，如 [[lng1, lat1], [lng2, lat2], ...]
  if (!map || locations.length === 0) return;

  const path = locations.map(location => new AMap.LngLat(location[0], location[1])); // 将经纬度数组转换为 AMap.LngLat 对象数组

  const polyline = new AMap.Polyline({
    path: path,
    borderWeight: 2,
    strokeColor: "#3366FF",
    lineJoin: "round",
  });

  map.add(polyline); // 将路径添加到地图中
}
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style> -->



<!-- <script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "a5603493b03449c9ef9a720b7e0c9d17",
  };
  AMapLoader.load({
    key: "c425c856a78bf66103539f7f48fe8428", 
    version: "2.0",
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style> -->
