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
