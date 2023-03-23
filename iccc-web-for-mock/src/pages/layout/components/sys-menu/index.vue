/** *@author: cyp *@createTime: 2019/11/6 16:32 *@description: *@功能: */
<template>
  <el-menu
    id="sys-menu"
    :default-active="$route.path"
    :routerValue="routerValue"
    class="head-el-menu"
    background-color="#333842"
    text-color=""
    mode="horizontal"
  >
    <template v-for="(item, index) in menuData">
      <el-submenu v-if="item.childernList.length" :key="index" :index="index + ''" :class="filterClass(item)">
        <template slot="title">
          <div class="uo-menu-item">
            <i :class="['icon', item.pic]"></i>
            <span class="menu-title">{{ item.codeName }}</span>
          </div>
        </template>
        <el-menu-item
          v-for="citem in item.childernList"
          :key="citem.url + index"
          :index="citem.url"
          @click="routerToPath(citem)"
          >{{ citem.codeName }}</el-menu-item
        >
      </el-submenu>

      <el-menu-item
        v-else
        :key="item.url + index"
        :index="item.url"
        @click="routerToPath(item)"
        :class="filterClass(item)"
      >
        <div class="uo-menu-item">
          <i :class="['icon', item.pic]"></i>
          <span class="menu-title">{{ item.codeName }}</span>
        </div>
      </el-menu-item>
    </template>

    <div v-if="dropdownMenu.length" class="drop-menu">
      <el-menu mode="horizontal">
        <el-submenu index="6">
          <template slot="title">
            <div class="uo-menu-item">
              <i class="iconfont iconf-more-gengduo"></i>
            </div>
          </template>
          <el-submenu
            v-for="(item, index) in dropdownMenu"
            :key="`drop${index}`"
            :index="item.url"
            :class="filterClass(item)"
            @click="routerToPath(item)"
          >
            <template slot="title">{{ item.codeName }}</template>
            <el-menu-item
              v-for="citem in item.childernList"
              :key="citem.url"
              :index="citem.url"
              @click="routerToPath(citem)"
            >
              {{ citem.codeName }}
            </el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'sysMenu',
  data() {
    return {
      showMenu: [],
      dropdownMenu: [],
      menuData: [],
      allMenu: [],
      menuWidth: 0
    };
  },
  computed: {
    ...mapGetters(['menuTree']),
    /**
     * 路由监听
     */
    routerValue: function() {
      let path = this.$route.fullPath;
      return path;
    },
    menuParentId() {
      return this.$route.meta.parentId ? this.$route.meta.parentId : this.$route.meta.id;
    }
  },
  watch: {
    /* $route() {
      this.filterCurMenu();
    } */
    // menuWidth(newVal) {}
  },
  components: {},
  methods: {
    ...mapActions(['getMenuTree']),
    /**
     * 样式过滤
     */
    filterClass(item) {
      let className = '';
      let classFlag = false;
      let the = this;

      if (item.childernList.length >= 1) {
        item.childernList.map(p => {
          if (p.code == this.menuParentId) {
            classFlag = true;
            return;
          }
        });
        className = classFlag ? 'is-active' : '';
      } else if (item.code == this.menuParentId) {
        className = 'is-active';
      }
      return className;
    },
    /**
     * 页面跳转
     * @param {String} citem 路由
     */
    routerToPath(citem) {
      let regUrl = citem.url;
      if (!regUrl.endsWith('/')) {
        // 添加一个路径，匹配以 url 开头的地址
        regUrl = regUrl + '/';
      }
      if ((this.$route.path + '/').startsWith(regUrl)) {
        this.$router.replace({
          path: '/refresh'
        });
        return;
      }
      if (citem.url) {
        // 添加外部跳转
        if (regUrl.substr(0, 7).toLowerCase() === 'http://' || regUrl.substr(0, 8).toLowerCase() === 'https://') {
          window.open(citem.url);
          return;
        }

        this.$router.push(citem.url);
      }
    },
    transVal: function(v) {
      return (v = v.replace(/^,+/, '').replace(/,+$/, ''));
    },
    // 筛选出当前模块的菜单
    filterCurMenu() {
      for (let item of this.allMenu) {
        if (item.code === this.menuParentId) {
          this.menuData = item.childernList;
          break;
        }
      }
    },
    async initMenu() {
      if (!this.menuTree.length) {
        this.menuData = await this.getMenuTree();
        return;
      }
      this.menuData = this.menuTree;
    }
  },
  async created() {
    await this.initMenu();
    // await this.filterCurMenu();
  },
  mounted: function() {
    // TODO:根据浏览器宽度设置菜单显示数量
    /* const _this = this;
    window.onresize = () => {
      return (() => {
        _this.menuWidth = document.getElementById('sys-menu').offsetWidth;
      })();
    }; */
  }
};
</script>

<style lang="scss" scoped>
.drop-menu {
  .iconf-more-gengduo {
    color: rgba(255, 255, 255, 0.65);
  }
  & /deep/ {
    .el-menu {
      border-right: none;
      .el-submenu__title {
        width: 25px !important;
        background-color: rgb(51, 56, 66) !important;
        &:hover {
          background-color: #292d35 !important;
          .iconf-more-gengduo {
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>
