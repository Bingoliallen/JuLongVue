<template>
  <div class="expand-container">
    <div class="expand-container_title">
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
      :url="url"
      :condition="searchCondition"
      :sortProps="sortProps"
      :toolConfig="toolConfig"
      :gridConfig="gridConfig"
      @loaded="infiniteLoad"
    >
      <template v-slot:tool="{ selectedData }">
        <!-- <dg-select
          v-model="manType"
          class="monitor-list__select prefix__select"
          clearable
          @change="loadData"
          placeholder="请选择对象类型"
          code="BM_BKDX_HMLX"
        >
        </dg-select>

        <dg-select
          v-model="ztType"
          class="monitor-list__select prefix__select"
          clearable
          @change="loadData"
          placeholder="请选择布控状态"
          code="BM_BKDX_BKZT"
        >
        </dg-select>-->

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="time"
          type="daterange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="创建开始时间"
          end-placeholder="创建截止时间"
          format="yyyy-MM-dd"
          value-format="yyyyMMddHHmmss"
          :default-time="['00:00:00', '23:59:59']"
          ref="picker"
          @change="loadData"
        >
        </dg-date-picker>

        <div class="bkdx__head">
          <el-input
            v-model="keyword"
            v-trim
            :placeholder="placeholder"
            suffix-icon="el-icon-search"
            clearable
            @input="loadData()"
            @change="loadData()"
            @keyup.enter.native="loadData()"
          ></el-input>
        </div>
        <dg-button type="primary" plain style="margin: 0 0 0 0.6rem;" @click="reset">重置</dg-button>
      </template>
      <template v-slot="{ node, data }">
        <!--        <el-popover :key="data.ID" placement="bottom-start" trigger="click" :width="popoverWidth" popper-class="dark">-->
        <!--          <control-object-popover-content :item="data"></control-object-popover-content>-->
        <!--          -->
        <!--        </el-popover>-->
        <iccc-card-item
          slot="reference"
          is-detail
          :key="data.id"
          :data="data"
          card-type="fz"
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
// import SortButton from '../../../components/base/sort-button/index';
export default {
  name: 'expand-container',
  // 接收父页面传过来的属性
  props: {
    leftTitle: String,
    leftListConfig: Object,
    placeholder: String
  },
  components: { IcccCardItem, ControlObjectPopoverContent }, // 注册局部组件
  // 页面数据绑定
  data() {
    return {
      url: '',
      popoverWidth: 1280,
      manType: '',
      ztType: '',
      time: '',
      total: 0,
      keyword: '',
      searchCondition: [],
      sortProps: {},
      toolConfig: {
        class: 'monitor-list__tool',
        checkbox: true
      },
      gridConfig: {
        // 格子宽
        itemWidth: '315px',
        itemHeight: '76px',
        // 间距
        gap: '1rem'
      },
      // 参数名称及默认值
      relevanceShow: false, // 获取关联弹窗是否显示
      relevanceDis: false, // 获取关联按钮是否禁用
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
  // 方法
  methods: {
    init() {
      this.popoverWidth = this.$refs.page.$el.clientWidth;
      Object.assign(this.$data, this.leftListConfig);
    },
    reset() {
      this.time = '';
      this.keyword = '';
      this.loadData();
    },
    loadData() {
      let conditions = [
        // { name: 'HMLX', op: '=', value: this.manType, type: '', format: '' },
        // { name: 'BKZT', op: '=', value: this.ztType, type: '', format: '' },
        { name: 'GJZ', value: this.keyword, op: 'like', type: '', format: '', mergerName: 'QZMC' }
      ];
      if (this.time) {
        conditions.push({
          name: 'CJSJ',
          value: this.time,
          op: 'rangeDate'
        });
      }
      this.searchCondition = conditions;
      this.$nextTick(() => {
        this.$refs.page.search();
      });
    },
    infiniteLoad(result) {
      this.total = result.totalElements || 0;
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
@import './expand.scss';
</style>
