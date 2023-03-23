<template>
  <!-- 标签页 -->
  <div class="l-main-tags">
    <!--菜单检索-->
    <el-popover
      placement="bottom"
      :visible-arrow="false"
      popper-class="tags-menu-popper"
      transition="bounce"
      width="650"
      @after-enter="popoverEnter"
      @after-leave="popoverLeave"
      trigger="click"
    >
      <div class="search-menu">
        <!--搜索区域-->
        <div class="search-menu__input">
          <el-input placeholder="搜索模块" clearable v-model="searchInput">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </div>
        <!-- 最近访问 -->
        <div class="search-menu__list">
          <h4 class="item-title">最近访问</h4>
          <div class="item-list">
            <span v-for="tag in historyViewsTen" @click="routerLink(tag)" :key="tag.id" class="history">
              {{ generateTitle(tag.title) }}
            </span>
          </div>
        </div>
        <!-- 搜索结果 -->
        <p class="search-menu__result" v-show="showResult">
          共搜索到<span class="num">{{ searchNum }}</span
          >个与 <span class="key">{{ searchInput }}</span
          >相关的模块
        </p>
        <!-- 搜索结果菜单 -->
        <div class="search-menu__list all-menu">
          <div class="search-menu__list--item" v-for="item in menuData" :key="item.id">
            <h4 class="item-title">{{ item.codeName }}</h4>
            <div v-if="$lodash.isArray(item.childernList) && item.childernList.length > 0">
              <div class="item-list" v-for="child in item.childernList" :key="child.id" @click="routerLink(child)">
                <a :class="{ active: child.code === curRouteParentId }">{{ child.codeName }}</a>
              </div>
            </div>
            <div class="item-list" v-else @click="routerLink(item)">
              <a :class="{ active: item.code === curRouteParentId }" :path="curRoutePath">{{ item.codeName }}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="l-main-tags__left " slot="reference">
        <!-- TODO 更新iconfont -->
        <i class="icon iconl-menu"></i>
      </div>
    </el-popover>

    <!-- 遮罩 -->
    <div
      v-if="showMask"
      class="layui-layer-shade"
      style="z-index: 2001; background-color: rgb(0, 0, 0); opacity: 0.3;"
    ></div>

    <!--左移按钮-->
    <div class="l-main-tags__left" v-if="showTagsList" @click="moveTag('left')">
      <i class="el-icon-d-arrow-left"></i>
    </div>

    <!-- 菜单栏 -->
    <div class="l-main-tags__container" ref="mian-tags" style="position: relative;left: -1px">
      <scroll-pane ref="scrollPane" class="l-main-tags__list">
        <router-link
          v-for="(tag, index) in visitedViews"
          ref="tag"
          :class="isActive(tag) ? 'active' : ''"
          :to="{
            path: tag.path,
            query: tag.query,
            fullPath: tag.fullPath
          }"
          :key="tag.fullPath"
          tag="span"
          class="l-main-tags__item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag, index, $event)"
        >
          <span class="l-main-tags__name" :title="generateTitle(tag.title)">{{ generateTitle(tag.title) }}</span>
          <span
            v-if="visitedViews.length != 1"
            v-show="tag.name !== 'dashboard'"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          ></span>
        </router-link>
      </scroll-pane>
    </div>

    <!--右移按钮-->
    <div class="l-main-tags__right" v-if="showTagsList" @click="moveTag()">
      <i class="el-icon-d-arrow-right"></i>
    </div>

    <!-- 右键操作区域 -->
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      :class="[$route.path == '/keyword/index' ? 'l-main-tags__keywordContext' : '', 'l-main-tags__context']"
    >
      <li @click="closeAllTags" v-show="selectedTag.path !== '/dashboard'">
        关闭全部
      </li>
      <li
        @click="closeSelectedTag(selectedTag)"
        v-if="visitedViews.length != 1"
        v-show="selectedTag.path !== '/dashboard'"
      >
        关闭当前标签
      </li>
      <li @click="closeRightTags(selectedTag)">关闭右侧标签</li>
      <li @click="closeOthersTags">关闭其他标签</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { generateTitle } from 'ui-jz-v4-common/src/utils/i18n.js';
import ScrollPane from '@icccPath/components/layout/scroll-pane';

export default {
  name: 'tags-view',
  components: { ScrollPane },
  data() {
    return {
      top: 0,
      left: 0,
      searchNum: 0,
      visible: false,
      showTagsList: false,
      showResult: false,
      showMask: false,
      searchInput: '',
      menuData: [],
      originMenuData: [],
      selectedTag: {}
    };
  },
  computed: {
    ...mapGetters(['visitedViews', 'historyViews', 'keepAliveList', 'menuTree']),
    curRoutePath() {
      return this.$route.path;
    },
    curRouteParentId() {
      return this.$route.meta.parentId;
    },
    historyViewsTen() {
      return this.historyViews.slice(0, 4);
    }
  },
  watch: {
    $route(to) {
      if (!to.meta.latestHide) {
        this.addHistoryTags(to);
      }
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
    /**
     * 检测标签页数目改变
     *
     */
    visitedViews() {
      this.iShowTagsBtn();
    },
    searchInput(newVal) {
      if (!newVal) {
        this.showResult = false;
        this.menuData = this.originMenuData;
        return;
      }
      this.debounce(this.search, 500)();
    }
  },
  methods: {
    generateTitle,
    ...mapActions(['getMenuTree', 'updateDeleteTag', 'setKeepAlive']),
    isActive(route) {
      return route.fullPath === this.$route.fullPath;
    },
    addHistoryTags(to) {
      if (to.name) {
        document.title = to.meta.title ? to.meta.title : 'no-name';
        this.$store.dispatch('addHistoryView', to);
      }
    },
    addViewTags() {
      const { name } = this.$route;
      if (name) {
        const route = {
          ...this.$route,
          tagName: this.$route.params.tagName || this.$route.meta.title
        };
        this.$store.dispatch('addView', route);
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (let tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);

            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedView', this.$route);
            }
            break;
          }
        }
      });
    },
    /* refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view;
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            });
          });
        });
      }, */
    closeSelectedTag(view) {
      if (view.meta.isKeepAlive && this.isActive(view)) {
        let index = null;
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            index = i;
            break;
          }
        }
        const nextRoute = index ? this.visitedViews[index - 1] : '/';
        this.$tool
          .confirm('关闭页面后数据会被清空，请确认是否关闭？')
          .then(() => {
            this.$store.dispatch('delView', view).then(() => {
              this.handleKeepAlive(view);
              this.$router.push(nextRoute);
            });
          })
          .catch(() => {});
      } else {
        this.$store.dispatch('delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
              this.$router.push(latestView);
            } else {
              this.$router.push('/');
            }
            return;
          }
          this.handleKeepAlive(view);
        });
      }
    },
    handleKeepAlive(view) {
      if (this.keepAliveList.includes(view.fullPath)) {
        const list = [...this.keepAliveList];
        const index = list.findIndex(kpItem => kpItem === view.fullPath);
        list.splice(index, 1);
        this.setKeepAlive(list);
      }
    },
    closeRightTags(view) {
      this.$store.dispatch('delRightViews', view);
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews');
      this.$router.push('/');
    },
    openMenu(tag, index, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 16; // 16: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY + 5;

      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    /**
     * 检测是否显示 Tags 全部按钮
     *
     */
    iShowTagsBtn() {
      this.$nextTick(() => {
        // 容器的宽度
        const offsetWidth = this.$refs['mian-tags'].offsetWidth;
        // 标签列表
        const tagsArray = this.$refs.tag; // tags list
        // 预留的空间位置
        const leaveSpace = 60;
        // 计算标签列表所占的宽度
        let tagsWrapperWidth = 0;

        // 检测标签列是否存在
        if (tagsArray) {
          // 计算列表宽度总和
          tagsArray.forEach(item => {
            tagsWrapperWidth += item.$el.offsetWidth;
          });
        }
        // 更改显示值
        this.showTagsList = tagsWrapperWidth + leaveSpace > offsetWidth;
      });
    },
    /**
     * 向移动tab页面
     */
    moveTag(flag) {
      if (flag == 'left') {
        this.$refs.scrollPane.moveLeft();
      } else {
        this.$refs.scrollPane.moveRight();
      }
    },
    /**
     * 初始化数据
     *
     */
    async initMenu() {
      if (!this.menuTree.length) {
        this.originMenuData = await this.getMenuTree();
        return;
      }
      this.originMenuData = this.menuTree;
      this.menuData = JSON.parse(JSON.stringify(this.originMenuData));
    },
    /**
     * 菜单过滤
     */
    search() {
      if (!this.searchInput) return;
      const sourceData = JSON.parse(JSON.stringify(this.originMenuData));
      let searchArr = [];
      let num = 0;
      sourceData.map(p => {
        let childArr = [];
        let pResult = false;
        if (p.childernList && p.childernList.length > 0) {
          // let childArr = p.childernList.filter(c => c.codeName.includes(this.searchInput));
          p.childernList.map(c => {
            if (c.codeName.includes(this.searchInput)) {
              childArr.push(c);
              pResult = true;
              num++;
            }
          });
        }
        if (p.codeName.includes(this.searchInput)) {
          pResult = true;
          num++;
        }
        if (childArr.length > 0) {
          p.childernList = childArr;
        }
        if (pResult) {
          searchArr.push(p);
        }
      });
      this.showResult = true;
      this.searchNum = num;
      this.$set(this, 'menuData', searchArr);
    },
    /**
     * 搜索防抖
     */
    debounce(method, wait) {
      let result,
        _this = this;
      let _debounce = function(...args) {
        return new Promise(resolve => {
          let context = this;
          if (_this.timer) {
            clearTimeout(_this.timer);
          }
          _this.timer = setTimeout(() => {
            _this.setCustomData = false;
            result = method.apply(context, args);
            resolve(result);
          }, wait);
        });
      };

      // 扩展取消防抖
      _debounce.cancel = function() {
        clearTimeout(this.timer);
        this.timer = null;
      };

      return _debounce;
    },
    routerLink(row) {
      if (row.sfwbyy == '1') {
        let url = row.yyurl.replace('http://', '');
        window.open('http://' + url, '_blank');
      } else {
        this.$router.push({ path: row.yyurl || row.url || row.path, query: row.query, fullPath: row.fullPath });
      }
      // 关闭搜索菜单弹框
      document.body.click();
    },
    /**
     * 弹窗进入
     */
    popoverEnter() {
      this.showMask = true;
    },
    /**
     * 弹窗离开
     */
    popoverLeave() {
      this.showMask = false;
    }
  },
  async mounted() {
    // 添加标签页
    this.addViewTags();
    await this.initMenu();
    // 窗口 resize 监听事件
    window.addEventListener('resize', this.iShowTagsBtn);
  },
  beforeDestroy() {
    // 移除窗口监听事件
    window.removeEventListener('resize', this.iShowTagsBtn);
  }
};
</script>
<style scoped lang="scss">
.search-menu {
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  &__input {
    padding-left: 0.5rem;
  }
  &__result {
    color: rgba(0, 0, 0, 0.65);
    margin: 10px 0px;
    .num {
      padding: 0px 5px;
      color: #fd2322;
    }
    .key {
      padding: 0px 5px;
      color: rgb(64, 144, 255);
      background: #f5f5f5;
    }
  }
  &__list {
    margin: 10px auto;
    &.all-menu {
      // display: flex;
      // flex-wrap: wrap;
      column-count: 4;
      column-gap: 0;
    }
    &--item {
      break-inside: avoid;
      width: 100%;
      margin-bottom: 10px;
      // width: 25%;
      // margin-bottom: 5px;
    }
    .item-title {
      padding: 1.4rem 0 0.3rem 0.5rem;
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
    }
    .item-list {
      a,
      .history {
        padding-left: 0.5rem;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.65);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
        &.active {
          color: #1890ff;
          background: url(../../../assets/images/icon/angle.png) no-repeat 0 center !important;
        }
      }
      .history {
        display: inline-block;
        width: 25%;
      }
      a {
        display: block;
      }
    }
  }
}

.iconl-menu {
  background: #1890ff;
  color: #fff;
  &:hover {
    background: rgba(#1890ff, 0.8);
  }
}

/* 自适应
  ---------------------------------------------*/
@media screen and (max-width: 1366px) {
  .item-title {
    font-size: 14px;
  }
  .item-list a,
  .item-list .history {
    font-size: 12px;
  }
}

@media screen and (max-width: 1680px) and (min-width: 1367px) {
  .item-title {
    font-size: 16px;
  }
  .item-list a,
  .item-list .history {
    font-size: 14px;
  }
}

@media screen and (min-width: 1681px) {
  .item-title {
    font-size: 16px;
  }
  .item-list a,
  .item-list .history {
    font-size: 14px;
  }
}

@media screen and (max-width: 1366px) {
  .l-main-tags /deep/ {
    .layui-layer-shade {
      top: 84px !important;
    }
  }
}

@media screen and (max-width: 1680px) and (min-width: 1367px) {
  .l-main-tags /deep/ {
    .layui-layer-shade {
      top: 98px !important;
    }
  }
}

@media screen and (min-width: 1681px) {
  .l-main-tags /deep/ {
    .layui-layer-shade {
      top: 112px !important;
    }
  }
}
</style>
