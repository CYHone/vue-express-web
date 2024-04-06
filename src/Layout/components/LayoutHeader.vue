<template>
    <header class="app-header">
      <div class="container">
        <!-- Logo -->
        <h1 class="logo">
          <RouterLink to="/"></RouterLink>
        </h1>
       
        <!-- 导航菜单 -->
        <ul class="app-header-nav" style="list-style-type: none;">
          <li>
            <RouterLink to="/" class="nav-link">首页</RouterLink>
          </li>
          <li>
            <RouterLink to="/order" class="nav-link">快递下单</RouterLink>
          </li>
          <li>
            <RouterLink to="/" class="nav-link">查询物流</RouterLink>
          </li>
          <li>
            <RouterLink to="/" class="nav-link">网点查询</RouterLink>
          </li>
        </ul>
      </div>
    </header>
  </template>
  
  <style scoped lang='scss'>
  .app-header {
    background: whitesmoke;
    border-bottom: 1px solid #ccc; /* 在底部添加边框线 */
  
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      height: 60px;
      
    }
  
    .logo {
      width: 80px;
      margin-right: 40px;
  
      a {
        display: block;
        height: 50px;
        width: 100%;
        text-indent: -9999px;
        background: url('@/assets/logo.png') no-repeat center / contain;
      }
    }
  
    .app-header-nav {
      display: flex;
  
      li {
        margin-right: 200px; /* 调整导航菜单项之间的间距 */
  
        .nav-link {
          font-size: 30px; /* 调整导航菜单链接字体大小 */
          color: #333;
          transition: color 0.3s;
  
          &:hover {
            color: skyblue;
          }
        }
  
        &.active {
          .nav-link {
            color: skyblue;
          }
        }
      }
    }
  }
  </style>
  