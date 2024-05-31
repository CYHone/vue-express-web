<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from '@/utils/axios-config';
import AMapLoader from '@amap/amap-jsapi-loader';
import { ElMessage, ElTimeline, ElTimelineItem } from 'element-plus';

let map = null;
const activities = ref([]);

const loadPackageHistory = async (packageId) => {
  try {
    const response = await axios.get(`package/getPackageHistory?id=${packageId}`);
    if (response.data.code === 200) {
      ElMessage.success(response.data.message);

      // 提取并格式化所有数据
      activities.value = response.data.data.map(item => {
        const [time, status] = Object.entries(item)[0];
        return {
          timestamp: new Date(time).toLocaleString(),
          content: status
        };
      });

    } else {
      ElMessage.error(response.data.message);
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后重试');
    console.error(error);
  }
};

onMounted(async () => {
  // 设置高德地图的安全配置
  window._AMapSecurityConfig = {
    securityJsCode: 'a5603493b03449c9ef9a720b7e0c9d17',
  };

  // 加载高德地图
  AMapLoader.load({
    key: 'c425c856a78bf66103539f7f48fe8428',
    version: '2.0',
    plugins: ['AMap.Scale'],
  })
    .then(async (AMap) => {
      // 创建地图实例
      map = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 11,
        center: [116.397428, 39.90923],
      });

      // 从 URL 中获取包裹 ID
      const packageId = new URLSearchParams(window.location.search).get('packageId');
      console.log('获得的包裹号为', packageId);
      if (!packageId) {
        console.error('Package ID not found.');
        return;
      }

      // 加载物流进度信息
      await loadPackageHistory(packageId);

      // 发送异步请求获取包裹位置历史信息
      axios.get(`location/getPackageLocation?id=${packageId}`)
        .then(response => {
          const locations = response.data.data;
          console.log('返回的包裹位置历史信息为', locations);
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

onUnmounted(() => {
  map?.destroy();
});

function drawPath(locations) {
  if (!map || locations.length === 0) return;

  const path = locations.map(location => new AMap.LngLat(location.coordinates[1], location.coordinates[0]));

  const polyline = new AMap.Polyline({
    path: path,
    borderWeight: 2,
    strokeColor: '#3366FF',
    lineJoin: 'round',
  });

  map.add(polyline);
}
</script>

<template>
  <div id="container"></div>
  <el-timeline class="timeline-container" v-if="activities.length">
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp"
    >
      {{ activity.content }}
    </el-timeline-item>
  </el-timeline>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}

.timeline-container {
  position: absolute;
  top: 10px;
  right: 10px;
  max-width: 300px;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  max-height: 90vh;
}
</style>


<!-- <script setup>
import { onMounted, onUnmounted } from "vue";
import axios from '@/utils/axios-config';
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
      axios.get(`location/getPackageLocation?id=${packageId}`)
        .then(response => {
          // 获取返回的位置历史信息数组
          const locations = response.data.data;

          //const coordinates = response.data.data.coordinates;
          console.log('返回的包裹位置历史信息为'+locations);

          response.data.data.forEach(location => {
              console.log('经纬度:', location.coordinates);
          });


          //console.log('返回的包裹位置经纬度信息为', coordinates);
          console.log('返回的包裹位置历史信息为', JSON.stringify(locations));

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

function drawPath(locations) {
  // 判断地图实例是否存在和位置历史信息是否为空
  if (!map || locations.length === 0) return;

  // 将经纬度数组转换为 AMap.LngLat 对象数组
  const path = locations.map(location => new AMap.LngLat(location.coordinates[1], location.coordinates[0]));

  // 创建路径对象
  const polyline = new AMap.Polyline({
    path: path, // 设置路径的经纬度点数组
    borderWeight: 100, // 线条宽度
    strokeColor: "#3366FF", // 线条颜色
    lineJoin: "round", // 连接处样式
  });

  // 将路径添加到地图中
  map.add(polyline);
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
