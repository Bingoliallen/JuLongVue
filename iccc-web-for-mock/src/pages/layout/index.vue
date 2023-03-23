<!--
    模板布局
    @Author: hecg
    @Date: 2019-11-26
-->
<template>
  <div class="l-admin-app">
    <!-- 头部 -->
    <Navbar />
    <!-- 主体 -->
    <section class="l-main-container">
      <tags-view></tags-view>
      <!-- 面包屑功能 -->
<!--      <breadcrumb />-->
      <!-- 视图区域 -->
      <app-main></app-main>
    </section>
    <div class="copyright">Copyright ©2020 厦门市巨龙信息科技有限公司 建议使用1280*768及以上分辨率</div>
  </div>
</template>

<script>
import { Navbar, TagsView, Breadcrumb, AppMain } from './components';

export default {
  name: 'Layout',
  components: { Navbar, TagsView, Breadcrumb, AppMain }
};
</script>

<style scoped lang="scss">
.l-main-container {
  height: 100%;
}

.copyright {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
