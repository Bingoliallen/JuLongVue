<!--
 布控-list
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="expand-bkdx">
    <div class="expand-bkdx_title">
      <div class="flex-1">
        <span class="title-text">布控对象</span>
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
        <!--        <dg-button type="primary">新增布控</dg-button>-->
        <dg-button type="primary" @click="exportBkdx(selectedData)" :disabled="total > 0 ? false : true"
          >导出</dg-button
        >
        <sort-button type="primary" v-model="sortProps.SQSJ" @change="loadData()">
          <span class="text">布控时间排序</span>
        </sort-button>
        <!--        <sort-button type="primary" v-model="sortProps.SQSJ" @change="loadData()">-->
        <!--          <span class="text">轨迹预警时间</span>-->
        <!--        </sort-button>-->
        <dg-tree-drop
          v-model="searchCondition[0].value"
          class="monitor-list__select prefix__select"
          placeholder="请选择"
          :filterable="true"
          :clearable="true"
          :check-leaf="true"
          :check-strictly="true"
          :lazy-load="false"
          @change="loadData"
          :props="{
            value: 'value'
          }"
          code="BM_BKDX_HMLX"
        >
          <template slot="prefix">
            布控对象:
          </template>
        </dg-tree-drop>

        <dg-select
          v-model="searchCondition[1].value"
          class="monitor-list__select prefix__select"
          clearable
          @change="loadData"
          code="BM_BKDX_BKZT"
        >
          <template slot="prefix">
            布控状态:
          </template>
        </dg-select>

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="time"
          type="daterange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="申请开始时间"
          end-placeholder="申请截止时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          ref="picker"
          @change="loadData"
        >
        </dg-date-picker>

        <div class="bkdx__head">
          <el-input
            v-model="searchCondition[2].value"
            v-trim
            placeholder="请输入布控号码查询"
            suffix-icon="el-icon-search"
            clearable
            @change="loadData()"
            @input="loadData()"
            @keyup.enter.native="loadData()"
          ></el-input>
        </div>
        <!--        <dg-button type="primary" @click="search()" style="margin: 0 0 0 0.6rem;">查询</dg-button>-->
        <dg-button type="primary" @click="reset" plain style="margin: 0 0 0 0.6rem;">重置</dg-button>
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
          card-type="bkdxlist"
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
import nzdrApi from '@icccPath/api/nzdr/index.js';

export default {
  name: 'expand-bkdx',
  // 接收父页面传过来的属性
  props: {
    leftListConfig: Object
  },
  components: { SortButton, IcccCardItem, ControlObjectPopoverContent }, // 注册局部组件
  // 页面数据绑定
  data() {
    return {
      url: '/v1/bkdx/search',
      popoverWidth: 1280,
      manType: '',
      ztType: '',
      time: '',
      total: 0,
      keyword: '',
      searchCondition: [
        { name: 'HMLXZH', op: '=', value: '', type: '', format: '' },
        { name: 'BKZT', op: 'in', value: '', type: '', format: '' },
        { name: 'GJZ', op: 'like', value: '', type: '', format: '', mergerName: 'HMNR' },
        { name: 'SQSJ', value: '', op: '>=', type: '', format: '' },
        { name: 'SQSJ', value: '', op: '<=', type: '', format: '' }
      ],
      sortProps: { SQSJ: 'DESC' },
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
      form: {}, // 获取关联弹窗Form
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
  // 计算属性
  computed: {},
  // 方法
  methods: {
    init() {
      this.popoverWidth = this.$refs.page.$el.clientWidth;
    },
    exportBkdx(selectData) {
      let that = this;
      let list = [
        { name: '布控对象列表导出.xls', type: 'FILE_NAME', format: '', split: '', display: '' },
        { name: 'hmlxzh', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '对象类型' },
        { name: 'hmnr', type: 'CHAR', format: '', split: '', display: '对象信息' },
        { name: 'rylb', type: 'CHAR', format: '', split: '', display: '人员类别' },
        { name: 'ryjb', type: 'CHAR', format: '', split: '', display: '人员等级' },
        { name: 'szqt', type: 'CHAR', format: '', split: '', display: '所在群体' },
        { name: 'xm', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'xb', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'nl', type: 'CHAR', format: '', split: '', display: '年龄' },
        { name: 'mz', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'hjdbh', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '户籍地' },
        { name: 'jg', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '籍贯' },
        { name: 'sqsj', type: 'DATE', format: 'yyyy-MM-dd HH:mm:ss', split: '', display: '申请时间' },
        { name: 'bkzq', type: 'CHAR', format: '', split: '', display: '布控周期' }
      ];
      if (selectData.length) {
        let listId = [];
        selectData.forEach(item => {
          listId.push(item.bkdxbh);
        });
        if (listId.length) {
          let ids = listId.join(',');
          let msearchCondition = [...this.searchCondition];
          msearchCondition.push({ name: 'BKDXBH', op: 'in', value: ids, type: '', format: '' });
          nzdrApi
            .toResultExport('/v1/bkdx/search-export', this.sortProps, list, msearchCondition, selectData.length, {
              fileName: '布控对象列表导出.xls'
            })
            .then(res => {
              console.log(res);
              that.$refs.page.clearSelection(); // 清空用户选择
            });
        } else {
          this.$message({ type: 'error', message: '请勾选' + that.titleData.label });
        }
      } else {
        nzdrApi
          .toResultExport('/v1/bkdx/search-export', this.sortProps, list, this.searchCondition, this.total, {
            fileName: '布控对象列表导出.xls'
          })
          .then(res => {
            console.log(res);
          });
      }
    },
    dateChange(value) {
      const fmt = 'yyyy-MM-dd  HH:mm:ss';
      return dateUtils.strToDate(value, false, fmt);
    },
    reset() {
      this.time = '';
      this.searchCondition[0].value = '';
      this.searchCondition[1].value = '';
      this.searchCondition[2].value = '';
      this.loadData();
    },
    loadData() {
      if (this.time) {
        this.searchCondition[3].value = dateUtils.strToDate(this.time[0], 'yyyy-MM-dd HH:mm:ss', 'yyyyMMddHHmmss');
        this.searchCondition[4].value = dateUtils.strToDate(this.time[1], 'yyyy-MM-dd HH:mm:ss', 'yyyyMMddHHmmss');
      } else {
        this.searchCondition[3].value = '';
        this.searchCondition[4].value = '';
      }
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
.expand-bkdx {
  height: 100%;
  background-color: var(--background-color);
  &_title {
    display: flex;
    align-items: center;
    border-bottom: var(--border-light);
    padding: 0 2rem;
    height: 3.5rem;
    margin-bottom: 0;
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
  background: var(--background-color);
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
    .dg-tree-select {
      width: 150px !important;
      margin-left: 10px;
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
    &:hover {
      color: var(--color-primary);
    }
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
