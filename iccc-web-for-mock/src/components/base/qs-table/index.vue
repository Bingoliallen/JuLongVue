<template>
  <dg-table-replace
    class="qs-table"
    ref="table"
    v-bind="bindProps"
    stripe
    :border="false"
    v-on="$listeners"
    @loaded="loaded"
  >
    <template v-for="(column, index) in tableColumns">
      <dg-table-column :key="index" v-bind="column" v-slot="scope">
        <template v-if="!column.type || column.type === 'text'">
          <span v-if="column.code">{{ scope.formatValue | doFilters(column.doFilters) }}</span>
          <span v-else>{{ scope.row[column.prop] | doFilters(column.doFilters) }}</span>
        </template>
        <slot v-else v-bind="scope" :name="column.prop"></slot>
      </dg-table-column>
    </template>
    <!--无数据-->
    <slot name="empty" slot="empty">
      <no-record :height="noDataHeight"></no-record>
    </slot>
  </dg-table-replace>
</template>

<script>
import * as $filters from '@icccdPath/filters';
import DgTableReplace from './dg-table-replace';
import DgTable from '@srcPath/components/jz-base/table';
import NoRecord from './../no-record';
import { addResizeListener, removeResizeListener } from 'ui-component-v4/src/utils/resize-event';
import _ from 'lodash';

// 宽度转em，如果有返回值表示可转且成功
const width2px = (width, { rem, em }) => {
  let fontSize = 1;
  // 数值直接返回
  if (typeof width === 'number') {
    return width;
  }
  // 列宽可使用数字或者字符串；如果使用的是字符串并且不是用百分百，可以直接将字符串转为数字（宽度的单位是px）
  if ('string' === typeof width && !width.endsWith('%')) {
    if (width.endsWith('rem')) {
      fontSize = rem;
      width = width.substr(0, width.length - 3);
    } else if (width.endsWith('em')) {
      fontSize = em;
      width = width.substr(0, width.length - 2);
    }
    return (Number(width) * fontSize) << 0;
  }
};

export default {
  // 表格配置组件
  name: 'qs-table',
  mixins: [{ props: DgTable.props }],
  components: { DgTableReplace, NoRecord },
  props: {
    // 列配置
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 无数据时显示的高度
    noDataHeight: {
      type: String,
      default: '430px'
    },
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    // 分页配置
    paginationProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 默认数据
    data: {
      type: Array,
      default: () => []
    },
    condition: Array,
    // 排序
    sortProps: {
      type: [Array, Object],
      default() {
        return {};
      }
    }
  },
  // 组件内部参数
  data() {
    const defaultPageConfig = {
      currentPage: 1,
      pageSizes: [5, 10, 20, 30, 40, 50],
      pageSize: 10,
      layout: 'total, sizes, prev, pager, next, jumper'
    };
    const propPageConfig = Object.keys(this.paginationProps).length
      ? Object.assign({}, defaultPageConfig, this.paginationProps)
      : defaultPageConfig;

    const search = _.debounce(refresh => {
      const table = this.$refs.table;
      if (!refresh) {
        // 回到第一页
        table.paginationOptions.currentPage = 1;
      }
      table.loadData();
    }, 100);
    return {
      // 分页设置
      paginationPropsData: propPageConfig,
      tableColumns: [],
      search
    };
  },
  computed: {
    bindProps() {
      const bindProps = { ...this.$props };
      // 移除不传递的参数
      delete bindProps.columns;
      delete bindProps.noDataHeight;
      return bindProps;
    }
  },
  watch: {
    // 对列配置进行处理，支持使用 % 和 em 进行宽度配置
    columns: {
      handler: function(newVal) {
        this.setTableColumns(newVal);
      },
      immediate: true
    }
  },
  methods: {
    setTableColumns(columns) {
      if (Object.prototype.toString.call(columns) !== '[object Array]') {
        return;
      }
      this.$nextTick(() => {
        const style = window.getComputedStyle(this.$el);
        const tableWidth = parseInt(style.width);
        const rem = parseInt(window.getComputedStyle(document.querySelector('html')).fontSize);
        const em = parseInt(style.fontSize);
        let lastWidth = tableWidth;
        const tableColumns = [];
        // 统计并计算剩余的列宽
        columns.forEach(column => {
          const item = { ...column };
          let width = width2px(item.width, { rem, em });
          if (width) {
            item.width = width;
            lastWidth -= width;
          }
          tableColumns.push(item);
        });
        if (lastWidth <= 0) {
          lastWidth = tableWidth;
        }
        this.tableColumns = tableColumns.map(item => {
          if ('string' === typeof item.width && item.width.endsWith('%')) {
            const width = parseInt(item.width);
            item.width = ((lastWidth * width) / 100) << 0;
          }
          if (item['min-width']) {
            item.minWidth = item.minWidth || item['min-width'];
            delete item['min-width'];
          }
          if (item['max-width']) {
            item.maxWidth = item.maxWidth || item['max-width'];
            delete item['max-width'];
          }
          if ('string' === typeof item.minWidth) {
            if (item.minWidth.endsWith('%')) {
              item.minWidth = ((lastWidth * parseInt(item.minWidth)) / 100) << 0;
            }
            const width = width2px(item.minWidth, { rem, em });
            if (width) {
              item.minWidth = width;
              if (item.width < item.minWidth) {
                item.width = item.minWidth;
              }
            }
          }
          if ('string' === typeof item.maxWidth) {
            if (item.maxWidth.endsWith('%')) {
              item.maxWidth = ((lastWidth * parseInt(item.maxWidth)) / 100) << 0;
            }
            const width = width2px(item.maxWidth, { rem, em });
            if (width) {
              item.maxWidth = width;
              if (item.width > item.maxWidth) {
                item.width = item.maxWidth;
              }
            }
          }
          if (item.type === 'selection') {
            // 设置表格复选框可点击状态
            const selectable = item.selectable;
            item.selectable = (row, index) => {
              if (selectable) {
                return selectable(row, index);
              }
              /**
               * @config.selectDisables 复选框禁用 符合 `row[key] === val` 会禁止选中
               * eg: [{key: 'id', val: 'ff80808172a7bd390172b677546000b1'}]
               */
              const arr = item.selectDisables || [];
              return !arr.some(({ key, val }) => row[key] === val);
            };
          }
          return item;
        });
      });
    },
    loaded(data) {
      this.$nextTick(() => {
        const { pageSize, currentPage } = this.$refs.table.paginationOptions;
        this.$emit('loaded', {
          pageNum: currentPage,
          pageSize: pageSize,
          condition: this.condition,
          ...data
        });
      });
    },
    resize() {
      this.setTableColumns(this.columns);
    }
  },
  filters: {
    doFilters(str, filters) {
      const emptyFlag = str === null || str === undefined || (typeof str === 'string' && str.trim() === '');
      if (!emptyFlag && filters) {
        filters.split(',').forEach(filter => {
          str = $filters[filter](str);
        });
      }
      str = emptyFlag ? '-' : str;
      return str;
    }
  },
  mounted() {
    addResizeListener(this.$el, this.resize);
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.resize);
  }
};
</script>

<style lang="scss" scoped></style>
