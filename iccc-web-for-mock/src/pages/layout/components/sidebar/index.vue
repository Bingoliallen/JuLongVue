<template>
  <div class="l-sidebar__container">
    <div class="l-sidebar__header">
      <i class="el-icon-s-fold" :class="[isCollapse ? 'is-active' : '']" @click="toggleSideBar"></i>
    </div>
    <div class="l-sidebar__content">
      <el-scrollbar wrap-class="l-sidebar__scrollbar">
        <div class="u-menu">
          <el-menu
            class="u-menu__container"
            :show-timeout="200"
            :default-active="$route.path"
            :collapse="isCollapse"
            :collapse-transition="false"
            mode="vertical"
          >
            <sidebar-item
              class="u-menu__list"
              v-for="route in permission_routers"
              :key="route.path"
              :item="route"
              :base-path="route.path"
            />
          </el-menu>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './sidebar-item';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    }
  }
};
</script>
