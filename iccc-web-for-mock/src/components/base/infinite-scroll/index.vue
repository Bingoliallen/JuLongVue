<!--滚动加载-->
<template>
  <dg-scrollbar ref="scrollbar" v-if="initScroll">
    <div
      class="infinite-list"
      :class="infiniteClass"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      infinite-scroll-immediate="true"
      infinite-scroll-distance="100"
    >
      <slot name="prepend"></slot>
      <slot name="list" :list="nodeListShow">
        <div
          v-for="(node, index) in nodeListShow"
          :key="node.key + '-' + index"
          class="infinite-list__item"
          :class="{ active: value === node.key }"
          @click="valueChange(node)"
        >
          <slot :class="{ active: value === node.key }" :node="node" :data="node.data" :index="index"></slot>
        </div>
      </slot>
      <slot name="loading" v-if="pageTip.loading">
        <p class="infinite-list__loading">加载中...</p>
      </slot>
      <slot name="noMore" v-if="pageTip.noMore">
        <div class="infinite-list__no-more">
          <div class="no-more_line"></div>
          <div class="no-more_tip">已经到底部啦～</div>
        </div>
      </slot>
      <slot name="empty" v-if="pageTip.empty">
        <no-record class="infinite-list__empty" :text="emptyText" :height="height"></no-record>
      </slot>
    </div>
  </dg-scrollbar>
</template>

<script>
import NoRecord from './../no-record';
import request from '@icccPath/utils/request';
import { Cancel, CancelToken } from 'axios';
import qs from 'qs';
import _ from 'lodash';

export default {
  name: 'infinite-scroll',
  components: { NoRecord },
  props: {
    module: String,
    // 后端接口地址，必填
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: 'post'
    },
    // 查询条件 [{ name, value, op, type, format }]
    searchCondition: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    // 排序
    sortProps: {
      type: [Array, Object],
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default: '250px'
    },
    infiniteClass: {
      type: String
    },
    pageSize: {
      type: Number,
      default: 10
    },
    // 主键
    primaryKey: [Boolean, String],
    // 选中项
    value: String,
    // 默认选中第一项
    activeFirst: {
      type: Boolean,
      default: true
    },
    dataFilter: Boolean,
    emptyText: String,
    // 组件初始化时不会自动加载数据，只有当条件改变时才会
    lazy: Boolean,
    nodeFilter: Function
  },
  data() {
    return {
      source: CancelToken.source(),
      // 用于初始化组件
      initScroll: false,
      loading: false,
      noMore: false,
      error: false,
      nodeList: [],
      pageNum: 0,
      // 重新初始化
      reinit: _.debounce(() => {
        this.source.cancel('搜索条件改变，取消上次的数据请求！');
        this.init();
      }, 100),
      unWatchFn: null,
      ticket: ''
    };
  },
  computed: {
    pageTip() {
      const pageTip = { loading: false, noMore: false, empty: false };
      if (this.loading) {
        pageTip.loading = true;
      } else if (this.nodeList.length <= 0) {
        pageTip.empty = true;
      } else if (this.noMore) {
        pageTip.noMore = true;
      }
      return pageTip;
    },
    disabled() {
      return this.loading || this.noMore || this.error;
    },
    nodeListShow() {
      return this.dataFilter ? this.nodeList.filter(node => !node.hide) : this.nodeList;
    }
  },
  methods: {
    // 页面初始化，当搜索条件改变时，需要重新调用这个方法
    init() {
      this.initScroll = false;
      this.$nextTick(() => {
        this.source = CancelToken.source();
        this.pageNum = 0;
        this.loading = false;
        this.noMore = false;
        this.error = false;
        this.nodeList = [];
        this.initScroll = true;
        this.load();
      });
    },
    load() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.pageNum++;
      const params = {
        sort: JSON.stringify(this._getSort()),
        searchCondition: JSON.stringify(this._getConditions()),
        page: this.pageNum - 1,
        size: this.pageSize,
        ticket: this.ticket
      };
      request({
        url: this.url,
        method: this.method,
        module: this.module,
        cancelToken: this.source.token,
        data: qs.stringify(params)
      })
        .then(res => {
          const result = res.data;
          this.ticket = result.ticket;
          let addList = result.content.map(data => ({
            key: this.primaryKey ? data[this.primaryKey] : this.$tool.generateKey(),
            index: this.nodeList.length,
            data
          }));
          if (this.nodeFilter) {
            addList = this.nodeFilter(addList);
          }
          this.nodeList.push(...addList);
          // 满足以下条件，回到第一条
          if (
            // 配置为默认选中第一条
            this.activeFirst &&
            // 第一页
            this.pageNum === 1 &&
            // 列表有数据
            this.nodeList.length > 0 &&
            // 没有默认选中项
            !this.value
          ) {
            this.valueChange(this.nodeList[0]);
          }
          // 数据全部加载完，就不需要再次加载了
          if (this.nodeList.length >= result.totalElements) {
            this.noMore = true;
          }
          this.loading = false;
          result.pageNum = this.pageNum;
          result.pageSize = this.pageSize;
          this.$emit('load', result, this.nodeList);
        })
        .catch(e => {
          console.log('查询后端数据报错\nparams:', params, 'error:', e);
          if (e instanceof Cancel) {
            return;
          }
          this.pageNum--;
          this.loading = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 1000);
        });
    },
    /**
     * 替换表格搜索条件处理方法
     * @return {Object|Array} 处理后的搜索条件
     */
    _getConditions() {
      const handCondition = condition => {
        if (!condition) {
          return false;
        }
        // and
        if (condition.and) {
          const and = handCondition(condition.and);
          return and ? (and instanceof Array ? { and } : and) : false;
        }
        // or
        if (condition.or) {
          const or = handCondition(condition.or);
          return or ? (or instanceof Array ? { or } : or) : false;
        }
        // 数组
        if (condition instanceof Array) {
          const arr = [];
          condition.forEach(item => {
            const newItem = handCondition(item);
            if (newItem) {
              if (newItem instanceof Array) {
                arr.push(...newItem);
              } else {
                arr.push(newItem);
              }
            }
          });
          return arr.length === 1 ? arr[0] : arr.length > 1 ? arr : false;
        }
        // 普通对象，当条件处理
        const { name, value, op = '=', type = '', format = '', mergerName } = condition;
        // 添加有值的条件
        if (value || value === 0) {
          if (name === 'GJZ' && mergerName) {
            return [{ or: mergerName.split(',').map(key => ({ name: key, value, op, type, format })) }];
          }
          if (op === 'rangeDate' || op === 'date8Range' || op === 'date14Range') {
            const [t1, t2] = value instanceof Array ? value : value.split(',');
            const arr = [];
            if (t1) {
              arr.push({ name, value: t1, op: '>=', type, format });
            }
            if (t2) {
              arr.push({ name, value: t2, op: '<=', type, format });
            }
            return arr;
          }

          return [{ name, value, op, type, format }];
        }
      };

      const conditionResult = handCondition(this.searchCondition);
      // 如果计算之后的搜索条件是一个对象并且不是 and 或 or， 将搜索条件放到 and 里面
      return !conditionResult
        ? []
        : conditionResult instanceof Array || conditionResult.and || conditionResult.or
        ? conditionResult
        : [conditionResult];
    },
    _getSort() {
      let sort = {};
      if (this.sortProps instanceof Array) {
        this.sortProps.forEach(e => {
          sort = { ...sort, ...e };
        });
      } else {
        sort = this.sortProps;
      }
      Object.entries(sort).forEach(([key, val]) => {
        if (val) {
          sort[key] = val.toUpperCase();
        }
      });
      return sort;
    },
    valueChange(node) {
      this.$emit('input', node.key);
      this.$emit('change', node.data, node);
    },
    goScrollToTop(...arg) {
      this.$refs.scrollbar.goScrollToTop(...arg);
    },
    resize() {
      // 如果没有自动更新，那么需要手动调用这个方法
      this.$nextTick(this.$refs.scrollbar.update);
    },
    exportData() {}
  },
  created() {
    const unUrl = this.$watch(
      'url',
      val => {
        if (val) {
          this.reinit();
        }
      },
      { immediate: !this.lazy }
    );
    const unSearchCondition = this.$watch(
      'searchCondition',
      () => {
        this.reinit();
      },
      { immediate: !this.lazy, deep: true }
    );
    this.unWatchFn = () => {
      unUrl();
      unSearchCondition();
    };
  },
  beforeDestroy() {
    this.source.cancel('关闭页面，取消上次的数据请求！');
    this.unWatchFn && this.unWatchFn();
  }
};
</script>

<style lang="scss" scoped>
.infinite-list {
  &__item {
    cursor: pointer;
    &.active {
      cursor: default;
    }
  }
  &__loading {
    text-align: center;
    line-height: 3;
    font-size: 12px;
    color: var(--infinite-scroll_loading_color);
  }
  &__no-more {
    $top: 3rem;
    position: relative;
    padding: $top 0 1.5rem;
    .no-more_line {
      width: 100%;
      height: 0;
      border-bottom: var(--border-light);
    }
    .no-more_tip {
      background: #fff;
      padding: 0 1rem;
      color: var(--color-text-placeholder);
      position: absolute;
      top: $top;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  &__empty,
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
