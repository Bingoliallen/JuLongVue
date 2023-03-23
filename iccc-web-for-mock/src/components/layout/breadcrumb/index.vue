<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <i class="icon iconl-location"></i>
    <transition-group name="breadcrumb">
      <template v-for="(item, index) in levelList">
        <el-breadcrumb-item
          class="no-redirect"
          v-if="item.redirect === 'noredirect' || index === levelList.length - 1"
          :key="item.path"
        >
          {{ generateTitle(item.meta.title) }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else :key="item.path" :to="item.path">
          {{ generateTitle(item.meta.title) }}
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@icccPath/common';

export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      this.levelList = this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== 0);
    },
    handleLink(item, index) {
      if (index === 0) return;
      const { query, params } = this.$route;
      this.$router.push({
        name: item.name,
        query,
        params
      });
    }
  }
};
</script>

<style scoped></style>
