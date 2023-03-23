<!--
 审批-list
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="bksp-expend">
    <div class="bksp-expend_title">
      <div class="flex-1">
        <span class="title-text">{{ leftTitle }}</span>
        <span class="bkdx-num">{{ total.toLocaleString() }}个</span>
      </div>
      <el-button
        type="text"
        icon="iconfont iconl-reducescreen"
        title="收缩"
        @click="$emit('pageExpand', false)"
      ></el-button>
    </div>
    <search-page-grid
      ref="page"
      class="monitor-list warning-trajectory"
      :url="leftListConfig.url"
      :condition="finalSearchCondition"
      :sortProps="sortProps"
      :toolConfig="toolConfig"
      :gridConfig="gridConfig"
      @loaded="handleLoaded"
    >
      <template v-slot:tool="{ selectedData }">
        <!--        <dg-button type="primary">新增布控</dg-button>-->
        <!-- <dg-button type="primary" @click="exportBkdx(selectedData)">导出</dg-button> -->

        <sort-button type="primary" v-model="sortProps.SQSJ" @change="search">
          <span class="text"> 申请时间排序</span></sort-button
        >
        <dg-select
          code="BM_BKSQ_SQZT"
          clearable
          v-model="searchCondition[0].value"
          class="monitor-list__select prefix__select"
          @change="search"
        >
          <template slot="prefix">
            审批状态:
          </template>
        </dg-select>
        <dg-select
          code="BM_BKSQ_BKJB"
          clearable
          v-model="searchCondition[1].value"
          class="monitor-list__select prefix__select"
          @change="search"
        >
          <template slot="prefix">
            布控级别:
          </template>
        </dg-select>
        <dg-tree-drop
          class="monitor-list__select prefix__select"
          style="margin-left: 12px;"
          lazy-load
          filterable
          clearable
          collapse-tags
          placeholder="请选择"
          code="BM_BKSQ_BKLB"
          :props="{
            value: 'value',
            label: 'label',
            children: 'children'
          }"
          v-model="searchCondition[2].value"
          @change="search"
          @input="treeSearch"
        >
          <template slot="prefix">
            布控类别:
          </template>
        </dg-tree-drop>

        <dg-tree-drop
          class="monitor-list__select prefix__select"
          style="margin-left: 12px;"
          v-model="searchCondition[3].value"
          placeholder="请选择"
          :filterable="true"
          :clearable="true"
          :check-leaf="true"
          :check-strictly="true"
          :lazy-load="false"
          @change="search"
          :props="{
            value: 'value'
          }"
          code="BM_BKDX_HMLX"
        >
          <template slot="prefix">
            布控对象:
          </template>
        </dg-tree-drop>

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="searchCondition[4].value"
          clearable
          type="daterange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="申请开始时间"
          end-placeholder="申请截止时间"
          format="yyyy-MM-dd"
          value-format="yyyyMMddHHmmss"
          :default-time="['00:00:00', '23:59:59']"
          ref="picker"
          @change="search"
        >
        </dg-date-picker>
        <div class="bkdx__head">
          <el-input
            v-model="searchCondition[5].value"
            v-trim
            placeholder="请输入任务名称查询"
            suffix-icon="el-icon-search"
            clearable
            @blur="search()"
            @keyup.enter.native="search()"
          ></el-input>
          <!-- @keyup.native="search()" -->
        </div>
        <dg-button type="primary" @click="reset" plain style="margin: 0 0 0 0.6rem;">重置</dg-button>
      </template>
      <template v-slot="{ node, data }">
        <!--        <el-popover-->
        <!--          :key="data.ID"-->
        <!--          placement="bottom-start"-->
        <!--          trigger="click"-->
        <!--          v-model="data.CHECKED"-->
        <!--          :width="popoverWidth"-->
        <!--          popper-class="dark"-->
        <!--        >-->
        <!--          <control-object-popover-content></control-object-popover-content>-->
        <!--          -->
        <!--        </el-popover>-->
        <iccc-card-item
          slot="reference"
          is-detail
          card-type="bksp"
          :key="data.ID"
          :data="data"
          @click.native="$emit('changeCard', data)"
        ></iccc-card-item>
      </template>
    </search-page-grid>
  </div>
</template>
<script>
import { dateUtils } from '@icccPath/utils';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import ControlObjectPopoverContent from '@icccPath/components/scenes-bkdx/modules/control-object-popover-content';
import SortButton from '../../../components/base/sort-button/index';
export default {
  name: 'bksp-list',
  props: {
    leftTitle: String,
    leftListConfig: Object,
    module: String
  },
  components: { IcccCardItem, ControlObjectPopoverContent, SortButton }, // 注册局部组件
  // 页面数据绑定
  data() {
    return {
      searchCondition: [
        { name: 'SQZT', value: '' },
        { name: 'BKJB', value: '' },
        { name: 'BKLB', value: '' },
        { name: 'HMLXS', op: 'like', value: '' },
        { name: 'SQSJ', value: this.time, op: 'rangeDate' },
        { name: 'GJZ', op: 'like', value: '', mergerName: 'SQMC' }
      ],
      sortProps: { SQDZT: 'ASC', SQSJ: 'DESC' },
      popoverWidth: 1280,
      manType: '',
      ztType: '',
      time: '',
      total: 123,
      keyword: '',
      toolConfig: {
        class: 'monitor-list__tool',
        checkbox: true
      },
      gridConfig: {
        // 格子宽
        itemWidth: '315px',
        // 间距
        gap: '1rem'
      },
      // 参数名称及默认值
      relevanceShow: false, // 获取关联弹窗是否显示
      relevanceDis: false, // 获取关联按钮是否禁用
      form: {}, // 获取关联弹窗Form
      attributeList: [
        { label: '手机号', value: 'sjh' },
        { label: 'QQ', value: 'qq' }
      ],
      relationalObjectList: [
        { label: '配偶', value: 'po' },
        { label: '儿子', value: 'ez' }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '近七天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    finalSearchCondition() {
      this.$nextTick(() => {
        this.search();
      });

      if (!this.$lodash.isEmpty(this.sqzt)) {
        return [...this.searchCondition, this.sqzt];
      }

      return this.searchCondition;
    },
    sqzt() {
      const sqzt = this.leftListConfig.searchCondition.filter(item => item.name == 'SQZT');
      let result = {};
      if (sqzt.length > 0) {
        result = sqzt[0];
      }
      return result;
    }
  },
  methods: {
    handleLoaded(res) {
      this.total = res.totalElements;
    },
    init() {
      this.popoverWidth = this.$refs.page.$el.clientWidth;
    },
    exportBkdx(selectData) {
      this.$refs.page.exportData();
    },
    dateChange(value) {
      const fmt = 'yyyy-MM-dd  HH:mm:ss';
      return dateUtils.strToDate(value, false, fmt);
    },
    reset() {
      this.searchCondition[0].value = '';
      this.searchCondition[1].value = '';
      this.searchCondition[2].value = '';
      this.searchCondition[3].value = '';
      this.searchCondition[4].value = '';
      this.searchCondition[5].value = '';
      this.search();
    },
    search() {
      this.$refs.page.search();
    },
    treeSearch(value) {
      if (value) {
        this.search();
      }
    },
    change() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.bksp-expend {
  height: 100%;
  background-color: var(--background-color);
  &_title {
    display: flex;
    align-items: center;
    border-bottom: var(--border-light);
    padding: 0 2rem;
    height: 3.5rem;
    .flex-1 {
      flex: 1;
    }
    .title-text {
      font-weight: 700;
      margin-right: 5px;
      @include mq($large) {
        font-size: 18px;
      }
      @include mq($medium) {
        font-size: 16px;
      }
      @include mq($small) {
        font-size: 14px;
      }
    }
  }
  .monitor-list.scroll {
    height: calc(100% - 3.5rem);
  }
}
.bksp_target {
  background-color: var(--background-color);
  display: flex;
}
.monitor-list {
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  /deep/ .monitor-list__tool {
    position: relative;
  }
  &__select {
    width: 150px;
    margin-left: 10px;
    /deep/ .el-input__prefix {
      padding: 0px 2px;
      color: var(--color-text-primary);
    }
    /deep/.el-input__inner {
      padding-left: 74px;
    }
  }
  &.warning-trajectory /deep/ {
    .search-page-grid__item {
      .el-checkbox {
        top: 0.45rem !important;
        left: 0.55rem !important;
      }
    }
  }
}
.bkdx__head {
  margin-left: 0px;
  width: 15rem;
}
.bkdx__reset {
  position: absolute;
  right: 2rem;
  margin-left: 10px;
}
.sort-button {
  border-radius: 2px;
  border: var(--border);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: var(--color-text-primary);
  display: flex;
  outline: 0;
  align-items: center;
  margin: 0 0 0 10px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  .text {
    font-size: 14px;
    color: var(--color-text-primary);
    line-height: 2rem;
    padding: 0px 0.5rem;
    height: 2rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    border-color: var(--color-text-placeholder);
  }
  &:active,
  &:focus {
    border-color: var(--color-primary);
  }
}
/deep/.iccc-card-item_img {
  border-right: 1px solid var(--border-color-extra-heavy) !important;
}
</style>
