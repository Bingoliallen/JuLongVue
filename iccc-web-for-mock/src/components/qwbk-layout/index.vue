<template>
  <div class="qwbk-layout">
    <div class="qwbk-layout__menu">
      <div>
        <div
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          :class="{ active: item.value === menuActive }"
          :title="item.label"
          @click="changeMenu(item)"
        >
          <dg-badge :value="item.num" :max="99" :hidden="!item.num">
            <i class="iconfont" :class="item.icon"></i>
          </dg-badge>
        </div>
      </div>
      <i
        v-if="!pageExpand"
        class="iconfont menu-item"
        :class="[isSlide ? 'iconl-outdent' : 'iconl-indent']"
        @click="onSlide"
      ></i>
    </div>
    <div class="qwbk-layout__transition">
      <transition name="move-rtl">
        <div v-if="!pageExpand" class="qwbk-layout__content move-rtl flex">
          <template v-if="leftListConfig">
            <div class="qwbk-layout__left" :class="{ 'slide-to-right': !isSlide, 'slide-to-left': isSlide }">
              <div class="qwbk-layout__left-title">
                <slot name="leftTitle">
                  <div class="title-1">{{ leftTitle }}</div>
                </slot>
              </div>
              <conditions-popover-with-input
                class="qwbk-layout__left-tool"
                :key="menuActive"
                :show-export="showExport"
                :popover-key="popoverKey"
                :placeholder="placeholder"
                :show-popover="leftListConfig.showPopover"
                @search="search"
                @export-data="exportData"
              ></conditions-popover-with-input>
              <infinite-scroll
                v-if="leftListConfig.url"
                :key="menuActive + leftListConfig.url"
                class="qwbk-layout__left-content"
                ref="scroll"
                v-model="scrollModel"
                :url="leftListConfig.url"
                :searchCondition="leftListConfig.searchCondition"
                :sortProps="leftListConfig.sortProps"
                :module="module"
                :dataFilter="dataFilter"
                :lazy="true"
                :primaryKey="primaryKey"
                :activeFirst="leftListConfig.activeFirst"
                :nodeFilter="leftListConfig.nodeFilter"
                @change="$emit('changeCard', $event)"
                @load="infiniteLoad"
              >
                <template slot="prepend">
                  <slot name="prepend"></slot>
                </template>
                <template slot="empty">
                  <slot name="empty"></slot>
                </template>
                <template v-slot:list="bind">
                  <slot name="list" v-bind="bind"></slot>
                </template>
                <template v-slot="row">
                  <slot v-bind="row"></slot>
                </template>
              </infinite-scroll>
              <div class="qwbk-layout__left-content" v-else>
                <slot name="leftContent"></slot>
              </div>
            </div>
          </template>
          <template v-else>
            <slot
              name="left"
              :className="{ 'qwbk-layout__left': true, 'slide-to-right': !isSlide, 'slide-to-left': isSlide }"
            ></slot>
          </template>
          <div class="qwbk-layout__right">
            <slot name="view">
              <keep-alive exclude="monitor-apply">
                <router-view ref="detail" @page-change="pageChange" @updateSearch="search"></router-view>
              </keep-alive>
            </slot>
          </div>
        </div>
      </transition>
      <transition name="move-ltr">
        <div v-if="pageExpand" class="qwbk-layout__content move-ltr">
          <slot name="expand"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import ConditionsPopoverWithInput from '@icccPath/components/conditions-popover/with-input';
import { EventBus } from '@icccPath/pages/qwbk/group-detail/event-bus';
import { mapGetters, mapMutations } from 'vuex';
const QWBK_LEFT_MENU_ACTIVE = 'qwbk-left-menu-active';

export default {
  name: 'qwbk-layout',
  model: {
    prop: 'menuActive',
    event: 'input'
  },
  components: { ConditionsPopoverWithInput },
  props: {
    menuItems: Array,
    popoverKey: String,
    popoverIgnoreKey: {
      type: Set,
      default() {
        return new Set(['GJZ']);
      }
    },
    menuActive: String,
    // 页面展开
    pageExpand: Boolean,
    leftTitle: String,
    placeholder: String,
    showExport: Boolean,
    module: String,
    leftListConfig: {
      type: [Object, Boolean],
      default() {
        return {};
      }
    },
    dataFilter: Boolean,
    // 主键
    primaryKey: [Boolean, String]
  },
  computed: {
    ...mapGetters(['searchCallBack'])
  },
  data() {
    return {
      isSlide: false,
      scrollModel: ''
    };
  },
  watch: {
    $route: {
      handler() {
        this.updateScrollModel(this.$route.params.id);
      },
      immediate: true
    }
  },
  methods: {
    init() {
      try {
        let menuActive = JSON.parse(window.sessionStorage.getItem(QWBK_LEFT_MENU_ACTIVE));

        let value = menuActive.value;
        if (this.$route.fullPath === menuActive.fullPath) {
          if (this.menuItems.every(e => e.value !== value)) {
            // 确保选中菜单一定在菜单项里面
            value = this.menuItems[0].value;
          }
          this.$emit('input', value);
        }
      } catch (e) {
        // 无需处理
      }
    },
    bindEvent() {
      EventBus.$on('update-list', arg => {
        this.search(...arg);
      });
      window.addEventListener('beforeunload', this.beforeunload);
    },
    unbindEvent() {
      EventBus.$off();
      window.removeEventListener('beforeunload', this.beforeunload);
    },
    changeMenu({ value }) {
      if (this.menuActive === value) {
        return;
      }
      this.scrollModel = '';
      if (this.isSlide) {
        this.onSlide();
      }
      this.$emit('input', value);
      this.$emit('change', value);
    },
    search(searchCondition, cb, resetSelected) {
      if (cb) {
        this.SET_SEARCH_CALLBACK(cb);
      }
      if (searchCondition) {
        this.$emit('updateCondition', searchCondition);
      }
      if (resetSelected) {
        this.scrollModel = '';
      }
      this.$nextTick(() => {
        const instance = this.$refs.scroll;
        if (instance) {
          instance.reinit();
        } else {
          this.$emit('search');
        }
      });
    },
    infiniteLoad(result, nodeList) {
      this.$emit('load', result, nodeList);
      if (this.searchCallBack) {
        this.searchCallBack();
      }
    },
    onSlide() {
      this.isSlide = !this.isSlide;
    },
    exportData(...arg) {
      this.$emit('export-data', ...arg);
    },
    /**
     * 上一条下一条切换
     * @param {Number} type 取值 -1: 上一条, 1: 下一条
     * @param callback 回调函数，回调参数是左侧列表的数据，如果没有上一页或者下一页，回调参数为空
     * @param id
     * @param idKey
     * @param scrollIntoView 默认滚动
     */
    pageChange({ type, callback, idKey = 'id', id = this.$route.params.id, scrollIntoView = true }) {
      if (!id) {
        callback();
      }
      const scroll = this.$refs.scroll;
      const nodeListShow = scroll && scroll.nodeListShow;
      if (nodeListShow && nodeListShow.length > 0) {
        const index = nodeListShow.findIndex(e => e.data[idKey] === id) + +type;
        const node = nodeListShow[index];
        if (node) {
          const { name, params, query } = this.$route;
          params.id = node.data[idKey];
          this.$router.push({ name, query, params });
          callback({
            data: node.data,
            node,
            last: nodeListShow[index - 1],
            next: nodeListShow[index + 1]
          });
          if (scrollIntoView) {
            this.$nextTick(() => {
              const el = scroll.$el.querySelector('.infinite-list__item.active');
              el && el.scrollIntoView();
            });
          }
          return;
        }
      }
      callback();
    },
    updateScrollModel(id) {
      this.scrollModel = id;
    },
    beforeunload() {
      // 在这里缓存选中项菜单
      window.sessionStorage.setItem(
        QWBK_LEFT_MENU_ACTIVE,
        JSON.stringify({ value: this.menuActive, fullPath: this.$route.fullPath })
      );
    },
    ...mapMutations(['SET_SEARCH_CALLBACK'])
  },
  mounted() {
    this.bindEvent();
  },
  created() {
    this.init();
  },
  activated() {
    this.bindEvent();
  },
  deactivated() {
    this.unbindEvent();
  },
  destroyed() {
    this.unbindEvent();
  }
};
</script>

<style lang="scss">
// 左中右3列布局
$menu-width: 4rem;
@mixin click-style() {
  cursor: pointer;
  &:hover,
  &.active {
    color: var(--color-primary);
  }
}
.qwbk-layout {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  &__menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-right: var(--border-light);
    flex: 0 0 $menu-width;
    background: var(--background-color);
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 2;
    .menu-item {
      color: var(--color-text-placeholder);
      border-right: 2px solid transparent;
      height: $menu-width;
      line-height: $menu-width;
      text-align: center;
      transition: all 150ms;
      &:hover {
        cursor: pointer;
        color: var(--color-primary);
        background: var(--background-color-weak);
      }
      &.active {
        border-right-color: var(--color-primary);
        color: var(--color-primary);
        background: var(--background-color-weak);
      }
      .iconfont {
        font-size: 24px;
      }
    }
    .iconl-outdent,
    .iconl-indent {
      font-size: 24px;
    }
  }
  &__transition {
    flex: 1;
    position: relative;
  }
  &__content {
    &.flex {
      display: flex;
      flex-wrap: nowrap;
    }
  }
  &__left {
    /*margin: 0 1rem 0 1px;*/
    flex: 0 0 24.5rem;
    background: #fff;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 9;
    box-shadow: 2px 0 2px 0 var(--border-color-extra-light);
    &-title {
      display: flex;
      align-items: center;
      border-bottom: var(--border-light);
      padding: 0 1.5rem;
      height: 3.5rem;
      .flex-1 {
        flex: 1;
      }
    }
    &-tool {
      position: relative;
      padding: 1rem 1.5rem;
    }
    &-content {
      flex: 1;
      height: 0;
    }
    .el-input__icon {
      @include click-style;
    }
  }
  &__form {
    padding: 1.5rem 2rem 0;
    &-btn {
      text-align: center;
      padding: 1rem;
    }
    /deep/ {
      .el-radio-button.is-active {
        .el-radio-button__inner {
          color: var(--color-primary);
          background-color: transparent !important;
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background: url('../../assets/images/icon/check.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  &__right {
    flex: 1;
    overflow: hidden;
    background: #fff;
    padding-left: 1rem;
    .el-scrollbar__view {
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
  }
  .el-button {
    .iconl-fullscreen {
      color: var(--color-text-regular);
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  .slide-to-left {
    flex: 0;
    margin-right: 0;
    transform: translateX(-24.5rem);
    transition: 0.8s;
  }
  .slide-to-right {
    // 下面这行会影响定位，不要加
    // transform: translateX(0);
    transition: 0.8s;
  }
}
</style>
