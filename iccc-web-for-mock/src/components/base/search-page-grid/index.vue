<template>
  <div class="search-page-grid" :class="{ scroll }" v-loading="loadding">
    <div class="search-page-grid__tool" v-if="toolConfig" :class="toolConfig.class">
      <el-checkbox
        v-if="toolConfig.checkbox"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange('all')"
        >全选</el-checkbox
      >
      <slot name="tool" :selectedData="selectedData" :search="search"></slot>
    </div>
    <no-record
      class="search-page-grid__content"
      :class="{ scroll__content: scroll }"
      v-if="nodeList.length === 0"
    ></no-record>
    <div
      class="search-page-grid__content"
      v-show="nodeList.length !== 0"
      :class="{ scroll__content: scroll, 'use-checkbox': toolConfig && toolConfig.checkbox }"
    >
      <div class="search-page-grid__content-wrap" :class="{ grid: gridConfig }" :style="gridStyle">
        <div
          class="search-page-grid__item"
          v-for="(node, index) in nodeList"
          :key="node.key"
          @click="handleActiveChange(node)"
        >
          <el-checkbox
            v-if="toolConfig && toolConfig.checkbox && !node.disabled"
            v-model="node.checked"
            @change="handleCheckAllChange('one', node)"
          ></el-checkbox>
          <slot :node="node" :data="node.data" :nodeIndex="index"></slot>
        </div>
      </div>
    </div>
    <!-- 分页区域 -->
    <template v-if="pagination && renderData.length > 0">
      <el-pagination
        class="search-page-grid__pagination"
        v-bind="paginationOptions"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      >
      </el-pagination>
    </template>
    <template v-else>
      <slot name="pagination"></slot>
    </template>
  </div>
</template>

<script>
import DgTable from '@srcPath/components/jz-base/table';
import _ from 'lodash';

export default {
  name: 'search-page-grid',
  mixins: [DgTable],
  props: {
    toolConfig: [Object, Boolean],
    // 表格内部是否滚动；对应两种页面布局，滚动的话会固定表格高度且固定分页在页面底部；
    scroll: {
      type: Boolean,
      default: true
    },
    //  网格布局配置
    gridConfig: {
      type: [Object, Boolean],
      default() {
        return {
          // 格子宽
          itemWidth: '448px',
          // 格子高
          itemHeight: '120px',
          // 间距
          gap: '1rem'
        };
      }
    },
    // 分页参数配置
    paginationProps: {
      type: Object,
      default() {
        return {
          currentPage: 1,
          pageSizes: [6, 12, 24, 48, 96],
          pageSize: 12,
          layout: 'total, sizes, prev, pager, next, jumper',
          total: this.paginationTotal
        };
      }
    },
    nodeFilter: Function,
    condition: Array,
    // 排序
    sortProps: {
      type: [Array, Object],
      default() {
        return [];
      }
    }
  },
  data() {
    const search = _.debounce(refresh => {
      if (!refresh) {
        // 回到第一页
        this.paginationOptions.currentPage = 1;
      }
      this.loadData();
    }, 100);
    return {
      currentPageLimit: null,
      // 缓存表格数据
      tempNodeList: [],
      // 被选中项
      selectedData: [],
      isIndeterminate: false,
      checkAll: false,
      search
    };
  },
  computed: {
    nodeList() {
      const nodeList = this.tempNodeList;
      return this.nodeFilter ? this.nodeFilter(nodeList) : nodeList;
    },
    gridStyle() {
      const gridConfig = this.gridConfig;
      const style = {};
      if (gridConfig) {
        style['--item-width'] = gridConfig.itemWidth || '';
        style['--item-height'] = gridConfig.itemHeight || '';
        style['--gap'] = gridConfig.gap || '';
      }
      return style;
    }
  },
  watch: {
    renderData: {
      handler(val) {
        const tempNodeList =
          (val &&
            val.map(data => {
              return {
                data,
                key: this.$tool.generateKey(),
                active: false,
                checked: false
              };
            })) ||
          [];
        this.gridReset(tempNodeList);
        this.tempNodeList = tempNodeList;
      }
    }
  },
  methods: {
    /**
     * 替换表格搜索条件处理方法
     * @return {Object|Array} 处理后的搜索条件
     */
    _getConditions() {
      const and = [];
      const condition = this.condition;
      condition.forEach(({ name, value, op = '=', type = '', format = '', mergerName }) => {
        // 添加有值的条件
        if (value || value === 0) {
          if (name === 'GJZ' && mergerName) {
            and.push({ or: mergerName.split(',').map(key => ({ name: key, value, op, type, format })) });
            return;
          }
          if (op === 'rangeDate' || op === 'date8Range' || op === 'date14Range') {
            const [t1, t2] = value instanceof Array ? value : value.split(',');
            if (t1) {
              and.push({ name, value: t1, op: '>=', type, format });
            }
            if (t2) {
              and.push({ name, value: t2, op: '<=', type, format });
            }
            return;
          }

          and.push({ name, value, op, type, format });
        }
      });

      return and.length > 0 ? { and } : {};
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
    // 多选框的改变
    handleCheckAllChange(type, node) {
      if (type === 'all') {
        const checked = this.checkAll;
        this.nodeList.forEach(node => {
          node.checked = checked;
        });
        this.selectedData = checked ? this.nodeList.map(node => node.data) : [];
        this.isIndeterminate = false;
      }
      if (type === 'one') {
        if (node.checked) {
          this.selectedData.push(node.data);
        } else {
          this.selectedData.splice(this.selectedData.indexOf(node.data), 1);
        }
        let checkAll = this.nodeList.every(node => node.checked);
        this.checkAll = checkAll;
        this.isIndeterminate = !checkAll && this.selectedData.length > 0;
      }
    },
    // 单选
    handleActiveChange(node) {
      this.nodeList.forEach(node => {
        this.$set(node, 'active', false);
      });
      this.$set(node, 'active', true);
      this.$emit('active-change', node.data, node);
    },
    // 清空多选
    clearSelection() {
      this.checkAll = false;
      this.handleCheckAllChange('all');
    },
    gridReset() {
      this.selectedData = [];
      this.checkAll = false;
      this.isIndeterminate = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-page-grid {
  &__tool {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    line-height: 2;
    margin-bottom: 0.375rem;
    > .el-checkbox {
      margin-right: 1rem;
    }
    .sort-list {
      flex: 1;
      text-align: right;
      .sort-button:not(.active) {
        color: var(--color-text-placeholder);
      }
    }
  }
  &__content {
    &-wrap {
    }
    &.use-checkbox {
      padding-right: 1rem;
      position: relative;
      .search-page-grid__item {
        position: relative;
        > .el-checkbox {
          position: absolute;
          margin-left: -2rem;
        }
      }
      .grid {
        .el-checkbox {
          top: 0.75rem;
          right: 0.75rem;
          line-height: 1;
          margin: 0;
        }
      }
    }
    .grid {
      margin: 1.5rem 0 1rem;
      display: grid;
      justify-content: space-between;
      padding-left: 0;
      grid-template-columns: repeat(auto-fill, var(--item-width));
      grid-template-rows: repeat(auto-fill, var(--item-height));
      grid-gap: var(--gap);
      gap: var(--gap);
    }
  }
  &__pagination {
    text-align: right;
  }
}

@include flex-dc('.scroll', true) {
  height: 100%;
}
</style>
