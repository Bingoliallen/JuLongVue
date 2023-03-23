<template>
  <div class="search-page-table">
    <div v-if="topConfig" class="module-box">
      <el-form class="search-page-table__form" ref="searchForm" :label-width="formConfig.labelWidth || '6em'">
        <el-form-item
          class="selected-conditions"
          :class="{ 'is-expansion': formConfig.showAll }"
          label="已选条件："
          v-if="formConfig.items"
        >
          <span class="no-select-tip" v-show="selectedCondition.length <= 0">暂无已选条件</span>
          <dg-tag
            v-for="item in selectedCondition"
            :key="item.name"
            effect="plain"
            closable
            v-bind="item.tagBind"
            @close="tagClose(item)"
          >
            {{ item.label + (item.text || '') }}
          </dg-tag>
          <dg-button class="remove-all-tag" v-show="selectedCondition.length > 0" type="text" @click="removeAllTag"
            >清空筛选</dg-button
          >
          <dg-button
            class="btn-expansion"
            v-show="!formConfig.showAll"
            type="primary"
            ghost
            @click="formConfig.showAll = true"
          >
            展开 <i class="el-icon-arrow-down" :class="{ shrink: formConfig.showAll }"></i>
          </dg-button>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="formConfig.showAll" v-if="formReset">
            <el-form-item v-for="(item, index) in formConfig.items" :key="item.name" :label="item.label">
              <template v-if="item.comType === 'date'">
                <qs-date-pick
                  v-model="item.value"
                  v-bind="item.bind"
                  @change="
                    (...arg) => {
                      conditionChange(item, ...arg);
                    }
                  "
                ></qs-date-pick>
              </template>
              <template v-if="item.comName">
                <component
                  v-bind="item.bind"
                  :is="item.comName"
                  v-model="item.value"
                  @change="
                    (...arg) => {
                      conditionChange(item, ...arg);
                    }
                  "
                ></component>
              </template>
              <template v-if="item.comType === 'radio'">
                <dg-radio-group
                  class="u-lable-btn is-no-border"
                  v-model="item.value"
                  is-lace
                  type="button"
                  :custom-data="[{ value: '', label: '不限' }]"
                  v-bind="item.bind"
                  @change="
                    (...arg) => {
                      conditionChange(item, ...arg);
                    }
                  "
                ></dg-radio-group>
              </template>
              <template v-if="index === formConfig.items.length - 1">
                <div class="btn-expansion" v-if="formConfig.showAllBtn">
                  <dg-button v-if="formConfig.reset" class="el-icon-refresh-right" type="primary" ghost @click="reset"
                    >&nbsp;重置</dg-button
                  >
                  <dg-button type="primary" ghost @click="formConfig.showAll = false">
                    收起
                    <i class="el-icon-arrow-down" :class="{ shrink: formConfig.showAll }"></i>
                  </dg-button>
                </div>
              </template>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </el-form>
    </div>
    <div class="module-box">
      <div class="search-page-table__tool" v-if="toolConfig">
        <slot name="tool" :selectData="selectData"></slot>
        <el-input
          v-if="keyword"
          class="search-page-input"
          v-model="keyword.value"
          placeholder="请输入关键字进行搜索"
          suffix-icon="el-icon-search"
          @blur="search()"
          @keyup.native="search()"
        ></el-input>
      </div>

      <div class="search-page-table__table">
        <!--表格-->
        <template v-if="conditionBind">
          <qs-table
            ref="grid"
            v-bind="tableConfig"
            :condition="conditionBind"
            :lazyLoad="true"
            @selection-change="handleSelectionChange"
            @loaded="loaded"
          >
            <template v-for="item in scopedSlots" v-slot:[item]="scope">
              <slot :name="item" v-bind="scope"></slot>
            </template>
          </qs-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import QsTable from './../qs-table';
import { dateUtils } from '@icccPath/utils';

export default {
  name: 'search-page-table',
  components: { QsTable },
  props: {
    // 搜索条件区域
    formConfig: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 操作按钮配置，如新增、导出等按钮
    toolConfig: {
      type: [Object, Boolean],
      default: false
    },
    topConfig: {
      type: [Object, Boolean],
      default: true
    },
    // 表格配置
    tableConfig: {
      type: Object,
      default: function() {
        return {
          noDataHeight: '430px'
        };
      }
    },
    // 表格搜索条件，会合并上 formConfig.items 传给表格
    condition: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * 搜索关键词，对象格式为：{ name, value, op, type, format }；
     * 配置为 false 不会出现输入框
     */
    keyword: {
      type: [Object, Boolean],
      default() {
        return { name: 'GJZ', value: '', op: '=' };
      }
    }
  },
  computed: {
    scopedSlots: function() {
      return Object.keys(this.$scopedSlots).filter(key => key !== 'form' && key !== 'tool');
    }
  },
  data() {
    return {
      // 实际绑定的条件
      conditionBind: null,
      // 缓存起来的重置恢复值
      resetData: null,
      // 通过v-if进行表单重置功能。
      formReset: true,
      // 被选择的条件项
      selectedCondition: [],
      // 表格选中的数据
      selectData: []
    };
  },
  methods: {
    init() {
      this.defaultProps();
      this.resetData = this.$tool.deepClone(this.formConfig.items);
      this.$nextTick(this.search);
    },
    defaultProps() {
      const defaultFormConfig = {
        labelWidth: '7em',
        showAll: true,
        showAllBtn: true
      };
      Object.entries(defaultFormConfig).forEach(([key, value]) => {
        if (this.formConfig[key] === undefined) {
          this.$set(this.formConfig, key, value);
        }
      });
      if (this.tableConfig.overflow === undefined) {
        this.$set(this.tableConfig, 'overflow', 'tooltip');
      }
    },
    // region form
    getConditionBind() {
      const conditions = [...this.condition];
      if (this.keyword) {
        conditions.push(this.keyword);
      }
      this.formConfig.items.forEach(({ name, value, op, type, format }) => {
        conditions.push({ name, value, op, type, format });
      });
      this.conditionBind = conditions;
      return conditions;
    },
    // 搜索条件被选择
    conditionChange(item, value, ...arg) {
      const i = this.selectedCondition.indexOf(item);
      // value 有值，i === -1 添加
      // value 有值，i !== -1 跳过
      // value 无值，i === -1 跳过
      // value 无值，i !== -1 去除
      if (value && i === -1) {
        this.selectedCondition.push(item);
      }
      if (!value && i !== -1) {
        this.selectedCondition.splice(i, 1);
      }
      if (value) {
        if (item.getLabel) {
          this.$set(item, 'text', item.getLabel(item, value, ...arg));
        } else if (item.comType === 'date') {
          this.dateChange(item, value, ...arg);
        } else {
          this.$set(item, 'text', arg[0].label);
        }
      }
      this.search();
    },
    dateChange(item, value, label) {
      const fmt = item.bind && item.bind.type === 'datetime' ? 'yyyy年MM月dd日HH时mm分ss秒' : 'yyyy年MM月dd日';
      if (!label) {
        // 区分开始时间和结束时间，然后转换为文本显示
        let [d1, d2] = value.split(',');
        d1 = d1 ? dateUtils.strToDate(d1, false, fmt) : '';
        d2 = d2 ? dateUtils.strToDate(d2, false, fmt) : '';
        if (d1 && d2) {
          label = d1 + ' 至 ' + d2;
        }
        if (d1 && !d2) {
          label = d1 + ' 之后';
        }
        if (!d1 && d2) {
          label = d2 + ' 之前';
        }
      }
      this.$set(item, 'text', label);
    },
    // 搜索条件去除一项
    tagClose(item) {
      this.$set(item, 'text', '');
      this.$set(item, 'value', '');
      this.conditionChange(item);
    },
    // 清空筛选
    removeAllTag() {
      this.keyword.value = '';
      [...this.selectedCondition].forEach(item => {
        this.tagClose(item);
      });
    },
    reset() {
      this.formReset = false;
      this.$nextTick(() => {
        this.formConfig.items = this.$tool.deepClone(this.resetData);
        this.selectedCondition = [];
        this.formReset = true;
        this.$nextTick(this.search);
      });
    },
    // endregion form

    /**
     * 搜索数据, 页面会回到第一页
     * @return {undefined} 无
     */
    search() {
      this.getConditionBind();
      this.$refs.grid && this.$refs.grid.search();
    },
    /**
     * 重新加载数据，刷新本页数据
     * @return {undefined} 无
     */
    reload() {
      this.getConditionBind();
      this.$refs.grid && this.$refs.grid.reload();
    },
    handleSelectionChange(rows) {
      this.selectData = rows;
      this.$emit('selection-change', rows);
    },
    cancelSelection() {
      this.$refs.grid.$refs.table.clearSelection();
    },
    /**
     * 表格数据变化
     * @param {Object} result 表格带分页
     * @return {undefined} 无
     */
    loaded(result) {
      this.$set(this.tableConfig, 'data', result.content);
      this.$emit('loaded', result);
    },
    // 导出操作
    exportData() {
      // TODO: 导出操作应该是统一的，待接口出来后进行完善
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss">
.search-page-table {
  .module-box {
    padding: 1.5rem 2rem;
    background: #fff;
    & + .module-box {
      margin-top: 1rem;
    }
  }

  .search-page-table__form {
    margin-bottom: -12px;
    .el-form-item {
      margin-bottom: 0;
      padding: 12px 0;
      .el-form-item__content {
        flex: 1;
        margin-left: 0 !important;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .el-tag {
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 2px;
          height: 26px;
          line-height: 25px;
        }
        .btn-expansion {
          margin-left: auto;
        }
      }
    }
    .selected-conditions {
      &.is-expansion {
        border-bottom: 1px solid rgba(0, 0, 0, 0.09);
      }
      .no-select-tip {
        color: rgba(0, 0, 0, 0.25);
      }
      padding: 0 2rem 12px;
      margin: 0 -2rem;
      display: flex;
      align-items: flex-start;
      .remove-all-tag {
        margin-left: 0.5rem;
      }
    }
  }

  &__tool {
    margin: 0 auto 1rem;
    display: flex;
    .search-page-input {
      margin-left: auto;
      width: 400px;
    }
  }
}
</style>
