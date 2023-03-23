<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="yjgj-expand">
    <div class="yjgj-expand_title">
      <div class="flex-1">
        <span class="title-text">停控申请单</span>
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
      :condition="condition"
      :sort-props="leftListConfig.sortProps"
      :tool-config="toolConfig"
      :grid-config="gridConfig"
      @loaded="handleLoaded"
    >
      <template v-slot:tool="{ selectedData }">
        <dg-button
          v-if="leftListConfig.showExport"
          type="primary"
          @click="exportBkdx(selectedData)"
          :disabled="total > 0 ? false : true"
          >导出</dg-button
        >

        <dg-select
          class="monitor-list__select prefix__select"
          v-model="condition[1].value"
          code="BM_BKSQ_BKLX_ZDR"
          placeholder="请选择"
          clearable
          filterable
          @change="search"
          :custom-data="[{ value: '', label: '全部' }]"
        >
          <template slot="prefix">
            申请类型:
          </template>
        </dg-select>

        <dg-select
          class="monitor-list__select prefix__select"
          v-model="condition[0].value"
          code="BM_BKSQ_SQDZT_NEW"
          placeholder="请选择"
          clearable
          filterable
          @change="search"
          :custom-data="[{ value: '', label: '全部' }]"
        >
          <template slot="prefix">
            申请状态:
          </template>
        </dg-select>

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="condition[2].value"
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
            v-model="condition[3].value"
            v-trim
            placeholder="请输入申请人姓名查询"
            suffix-icon="el-icon-search"
            clearable
            @blur="search()"
            @keyup.enter.native="search()"
          ></el-input>
        </div>
        <!--        <dg-button class="yjgj-expand__btn" type="primary" @click="search()">查询</dg-button>-->
        <dg-button type="primary" @click="resetForm" plain style="margin: 0 0 0 0.6rem;">重置</dg-button>
      </template>
      <template v-slot="{ node, data }">
        <iccc-card-item
          slot="reference"
          is-detail
          cardType="tksqd"
          :key="data.ID"
          :data="data"
          @click.native="$emit('changeCard', data)"
        ></iccc-card-item>
      </template>
    </search-page-grid>
  </div>
</template>
<script>
import IcccCardItem from '@icccPath/components/iccc-card-item';
// import SortButton from '../../../components/base/sort-button/index';

export default {
  name: 'zdry-list',
  props: {
    leftListConfig: Object
  },
  // 页面数据绑定
  data() {
    return {
      keyword: '',
      time: '',
      manType: '',
      lyType: '',
      total: 0,
      url: '/table-page/monitor',
      condition: [
        { name: 'SQDZT', op: '=', value: '', type: '', format: '' },
        { name: 'BKLX', op: '=', value: '', type: '', format: '' },
        { name: 'SQSJ', op: 'rangeDate', value: '', type: '', format: '' },
        { name: 'GJZ', op: 'like', value: '', type: '', format: '', mergerName: 'SQRXM' },
        // 获取停控数据
        { name: 'BKLX', value: '31,32', op: 'in' },
        // 过滤临时状态
        { name: 'TJZT', value: '00', op: '!=', type: '', format: '' }
      ],
      sort: {},
      sortConfig: '',
      toolConfig: { class: 'monitor-list__tool', checkbox: true },
      gridConfig: {
        // 格子宽
        itemWidth: '315px',
        itemHeight: '76px',
        // 间距
        gap: '1rem'
      },
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
  components: {
    IcccCardItem
    // , SortButton
  },
  // 方法
  methods: {
    handleLoaded(res) {
      this.total = res.totalElements;
    },
    exportBkdx(selectData) {},
    /**
     * 查询
     */
    search() {
      this.$refs.page && this.$refs.page.search();
    },
    /**
     * 重置
     */
    resetForm() {
      this.condition.map(item => {
        if (item.name != 'BKLX' && item.name != 'TJZT') {
          item.value = '';
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.yjgj-expand {
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
  &__btn {
    margin-left: 0.8rem;
  }
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
<style lang="scss">
.warning-trajectory-tooltip {
  width: 50%;
}
</style>
