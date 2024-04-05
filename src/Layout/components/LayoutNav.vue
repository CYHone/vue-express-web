<script setup>

</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      
      <!-- 将列表样式设置为无，这样就不会显示小圆点了 -->
      <ul  style="list-style-type: none;">
        <template v-if="true">

          <li>
            <!--  表示点击后执行 JavaScript 代码，但未指定具体的操作 -->
            <a href="javascript:;">
              <img src="@/assets/user.png" alt="用户图标" style="width: 40px; height: 40px;">
            </a>
          </li>
            <!-- 用户名 -->
          <li><a href="javascript:;">张三</a></li>

          <li>
            <!-- Vue 组件，用于显示确认框 -->
            <el-popconfirm title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>

          <li><a href="javascript:;">查询订单</a></li>
          <li><a href="javascript:;">会员中心</a></li>

        </template>

        <template v-else>
          <li><a href="javascript:;">请先登录</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 60px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: skyblue;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>