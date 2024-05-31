<template>
    <a-dropdown :trigger="['click']">
      <div
        class="drag-ball"
        draggable="true"
        @dragstart="dragstart($event)"
        @dragend="dragend($event)"
        :style="`right:${elRight}px;bottom:${elBottom}px`"
      >
        <div class="scrolling-news" @mouseenter="stopScroll" @mouseleave="resumeScroll">
          <ul ref="newsContainer" :style="`top:${scrollTop}px`">
            <li v-for="(news, index) in newsList2" :key="index">
              <span class="spancontent">{{ news.title }}</span>
            </li>
          </ul>
        </div>
      </div>
      <template #overlay>
        <div class="boardDetails">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="实时">
              <a-list size="small" :data-source="newsList">
                <template #renderItem="{ item ,index}">
                  <a-list-item>
                    <span class="spanIndex">{{index}}</span>
                    <span class="spanItem">{{ item.title }}</span>
                    <span>{{ item.time }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="2" tab="今日" force-render>
              <a-list size="small" :data-source="newsList2">
                <template #renderItem="{ item, index }">
                  <a-list-item>
                    <span class="spanIndex">{{index}}</span>
                    <span class="spanItem">{{ item.title }}</span>
                    <span>{{ item.time }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            <a-tab-pane key="3" tab="七日">
              <a-list size="small" :data-source="newsList">
                <template #renderItem="{ item,index }">
                  <a-list-item>
                    <span class="spanIndex">{{index}}</span>
                    <span class="spanItem">{{ item.title }}</span>
                    <span>{{ item.time }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-dropdown>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, watchEffect, onMounted } from "vue";
  import { Tabs, TabPane } from 'ant-design-vue';
  
  interface News {
    title: string;
    time: string;
  }
  
  const activeKey = ref('1');
  const startclientX = ref(0); // 记录开始的横坐标位置
  const startclientY = ref(0); // 记录开始的纵坐标位置
  const elRight = ref(350); // 定位-初始位置
  const elBottom = ref(885); // 定位-初始位置
  const newsList: News[] = reactive([
    { title: 'Title 1', time: '2024-05-30' },
    { title: 'Title 2', time: '2024-05-31' }
  ]);
  const newsList2: News[] = reactive([
    { title: 'Title 3', time: '2024-06-01' },
    { title: 'Title 4', time: '2024-06-02' }
  ]);
  
  // 拖拽开始事件
  const dragstart = (e: any) => {
    // 记录拖拽元素初始位置
    startclientX.value = e.clientX;
    startclientY.value = e.clientY;
  };
  
  // 拖拽完成事件
  const dragend = (e: any) => {
    const x = startclientX.value - e.clientX; // 计算偏移量
    const y = startclientY.value - e.clientY;
  
    // 获取悬浮框元素
    const ball = e.target;
  
    // 获取可视窗口的宽度和高度
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  
    // 获取悬浮框相对于视口的位置信息
    const ballRect = ball.getBoundingClientRect();
    const ballWidth = ballRect.width; // 悬浮球宽度
    const ballHeight = ballRect.height; // 悬浮球高度
  
    // 计算悬浮框的目标位置
    let targetX = elRight.value + x;
    let targetY = elBottom.value + y;
  
    // 约束悬浮框在页面范围内
    targetX = Math.max(0, Math.min(targetX, windowWidth - ballWidth));
    targetY = Math.max(0, Math.min(targetY, windowHeight - ballHeight));
  
    // 更新悬浮框的位置
    elRight.value = targetX;
    elBottom.value = targetY;
  };
  
  //滚动窗口
  const scrollTop = ref(0); // 滚动的距离
  const currentIndex = ref(0); // 当前显示的标题索引
  const newsContainer = ref(null); // 新闻容器的 ref
  const isScrolling = ref(true); // 是否滚动中
  
  onMounted(() => {
    setInterval(() => {
      if (isScrolling.value) {
        scrollNews(); // 播报下一条标题
      }
    }, 1500);
  });
  
  // 监听新闻容器 ref 的变化
  watchEffect(() => {
    const container = newsContainer.value; // 获取新闻容器元素
    if (container) {
      const containerHeight = container.clientHeight; // 容器高度
      const newsItemHeight = container.firstElementChild.offsetHeight; // 单条新闻高度
  
      // 计算滚动的距离
      scrollTop.value = -currentIndex.value * newsItemHeight;
    }
  });
  
  // 滚动播报标题
  const scrollNews = () => {
    currentIndex.value++;
  
    // 如果超出新闻列表长度，则回到第一条
    if (currentIndex.value >= newsList.length) {
      currentIndex.value = 0;
    }
  };
  
  // 停止滚动
  const stopScroll = () => {
    isScrolling.value = false;
  };
  
  // 恢复滚动
  const resumeScroll = () => {
    isScrolling.value = true;
  };
  </script>
  
  <style scoped lang="less">
  .drag-ball {
    position: fixed;
    width: 250px;
    height: 40px;
    background: rgba(0, 98, 111, 1);
    box-shadow: 0px 6px 16px -8px rgb(0 0 0 / 8%),
      0px 9px 28px 0px rgb(0 0 0 / 5%), 0px 12px 48px 16px rgb(0 0 0 / 3%);
    border-radius: 23px;
    color: #fff;
    cursor: move;
    .scrolling-news {
      height: 50px;
      overflow: hidden;
      position: relative;
      .spancontent {
        width: 240px;
        white-space: nowrap;       /* 不换行 */
        overflow: hidden;          /* 内容超出隐藏 */
        text-overflow: ellipsis;   /* 使用省略号表示 */
      }
    }
  
    .scrolling-news ul {
      position: absolute;
      left: 0;
      list-style: none;
      margin: 0;
      padding: 0;
      transition: top 0.5s ease-in-out;
    }
  
    .scrolling-news li {
      line-height: 50px;
    }
  }
  .boardDetails {
    padding: 10px;
    border-radius: 5px;
    background: rgba(0, 98, 111, 1);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
    .spanItem {
      width: 700px;
      white-space: nowrap;       /* 不换行 */
      overflow: hidden;          /* 内容超出隐藏 */
      text-overflow: ellipsis;   /* 使用省略号表示 */
    }
    .spanIndex {
      width: 20px;
    }
  }
  </style>
  