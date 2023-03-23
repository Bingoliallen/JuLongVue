<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="yjgj-expand">
    <div class="yjgj-expand_title">
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
      :defaultSort="leftListConfig.sort"
      :toolConfig="toolConfig"
      :gridConfig="gridConfig"
      @loaded="handleLoaded"
    >
      <template v-slot:tool="{ selectedData }">
        <dg-button type="primary" @click="exportBkdx(selectedData)" :disabled="total > 0 ? false : true"
          >导出</dg-button
        >
        <!--        <dg-button type="primary">轨迹合并</dg-button>-->
        <!--        <dg-button type="primary">轨迹重现</dg-button>-->
        <!--        <dg-button type="primary">魔盒精选</dg-button>-->
        <sort-button type="primary" v-model="sortProps.HDFSSJ" @change="search()">
          <span class="text"> 活动时间排序 </span></sort-button
        >
        <dg-select code="BM_GJLY_DWJB" v-model="condition[0].value" class="monitor-list__select prefix__select">
          <template slot="prefix">
            轨迹来源:
          </template>
        </dg-select>

        <dg-tree-drop
          multiple
          lazy-load
          filterable
          check-strictly
          collapse-tags
          clearable
          placeholder="请选择"
          value-name="value"
          label-name="label"
          :tree-props="{ isHighLight: true, nodeKey: 'value', showCheckbox: true }"
          code="VW_BM_YWXXLX"
          v-model="condition[1].value"
          class="monitor-list__tree-drop"
          @change="search"
          @input="treeSearch"
        >
          <template slot="prefix">
            轨迹类型:
          </template>
        </dg-tree-drop>
        <!-- <dg-select code="VW_BM_YWXXLX" v-model="condition[1].value" class="monitor-list__select prefix__select">
          <template slot="prefix">
            轨迹类型:
          </template>
        </dg-select> -->

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="condition[2].value"
          type="daterange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="活动开始时间"
          end-placeholder="活动截止时间"
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
            placeholder="请输入姓名、发生地点查询"
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
          card-type="track"
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
import carousel from '@icccPath/components/carousel';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import ControlObjectPopoverContent from '@icccPath/components/scenes-bkdx/modules/control-object-popover-content';
import SortButton from '../../../components/base/sort-button/index';
import nzdrApi from '@icccPath/api/nzdr';

export default {
  name: 'WarningTrajectory',
  props: {
    leftTitle: String,
    leftListConfig: Object
  },
  // 页面数据绑定
  data() {
    return {
      popoverWidth: 1280,
      keyword: '',
      time: '',
      manType: '',
      lyType: '',
      total: 123,
      url: '/gjxxService/v1/gjxx',
      condition: [
        { name: 'GJLY_DWJB', op: 'in', value: '', type: '', format: '' },
        { name: 'DTXXLX', op: 'in', value: '', type: '', format: '' },
        { name: 'HDFSSJ', value: '', op: 'rangeDate' },
        { name: 'GJZ', op: 'like', value: '', mergerName: 'XM,FSDXZ' }
      ],
      sortProps: { HDFSSJ: 'DESC' },
      toolConfig: { class: 'monitor-list__tool', checkbox: true },
      gridConfig: {
        // 格子宽
        itemWidth: '315px',
        itemHeight: '76px',
        // 间距
        gap: '1rem'
      },
      imgStyleSuspend: {
        width: '388px',
        height: '228px',
        background: '#fff',
        padding: '24px 32px',
        boxShadow: '0 2px 8px 0 var(--warning-trajectory_imgStyleSuspend_box-shadow)'
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
  components: { IcccCardItem, ControlObjectPopoverContent, SortButton },
  // 计算属性
  computed: {
    finalSearchCondition() {
      this.$nextTick(() => {
        this.search();
      });

      if (!this.$lodash.isEmpty(this.gjfl)) {
        return [...this.condition, this.gjfl];
      }

      return this.condition;
    },
    gjfl() {
      const gjfl = this.leftListConfig.searchCondition.filter(item => item.name == 'GJFL');
      let result = {};
      if (gjfl.length > 0) {
        result = gjfl[0];
      }
      return result;
    }
  },
  // 方法
  methods: {
    handleLoaded(res) {
      this.total = res.totalElements;
    },
    init() {
      this.popoverWidth = this.$refs.page.$el.clientWidth;
    },
    exportBkdx(selectData) {
      let that = this;

      let list = [
        {
          name: this.leftListConfig.titleExport + '列表导出.xls',
          type: 'FILE_NAME',
          format: '',
          split: '',
          display: ''
        },
        { name: 'HDFSSJ', type: 'DATE', format: 'yyyy-MM-dd HH:mm:ss', split: '', display: '发生时间' },
        { name: 'FSDXZ', type: 'CHAR', format: '', split: '', display: '活动地点' },
        { name: 'RYLB', type: 'CODE', format: 'BM_RY_RYXL', split: '', display: '人员类别' },
        { name: 'DXLX', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '对象类型' },
        { name: 'CLLX', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '车辆类型' },
        { name: 'DXHM', type: 'CHAR', format: '', split: '', display: '对象信息' },
        { name: 'XM', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'XB', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'CSRQ', type: 'AGE', format: '', split: '', display: '年龄' },
        { name: 'MZ', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'HJDQH', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '户籍地' },
        { name: 'DTXXLX', type: 'CODE', format: 'VW_BM_YWXXLX', split: '', display: '轨迹类型' },
        // { name: 'GJLY', type: 'CODE', format: 'BM_GJLY_DWJB', split: '', display: '轨迹来源' },
        { name: 'HDXGXX', type: 'CHAR', format: '', split: '', display: '轨迹描述' },
        { name: 'FSDXZ', type: 'CHAR', format: '', split: '', display: '活动地区' },
        { name: 'FSDSHCSMC', type: 'CHAR', format: '', split: '', display: '活动场所' },
        { name: 'FSDGAJGDM', type: 'CODE', format: 'BM_DEPT', split: '', display: '活动地单位' },
        { name: 'ZPXSD', type: 'CHAR', format: '', split: '', display: '相似度' }
        // ,
        // { name: 'BZXZPURL', type: 'CHAR', format: '', split: '', display: '抓拍照片' }
      ];
      if (selectData.length) {
        let listId = [];
        selectData.forEach(item => {
          listId.push(this.leftTitle === '我的关注' ? item.concernId : item.id);
        });
        if (listId.length) {
          let ids = listId.join(',');
          let msearchCondition = [...this.finalSearchCondition];
          msearchCondition.push({
            name: this.leftTitle === '我的关注' ? 'CONCERN_ID' : 'ID',
            op: 'in',
            value: ids,
            type: '',
            format: ''
          });
          nzdrApi
            .toResultExport(
              this.leftListConfig.showExportUrl,
              this.sortProps,
              list,
              msearchCondition,
              selectData.length,
              {
                fileName: this.leftListConfig.titleExport + '列表导出.xls'
              }
            )
            .then(res => {
              console.log(res);
              that.$refs.page.clearSelection(); // 清空用户选择
            });
        } else {
          this.$message({ type: 'error', message: '请勾选' + that.titleData.label });
        }
      } else {
        let msearchCondition = [...this.finalSearchCondition];
        nzdrApi
          .toResultExport(this.leftListConfig.showExportUrl, this.sortProps, list, msearchCondition, this.total, {
            fileName: this.leftListConfig.titleExport + '列表导出.xls'
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
      this.condition[0].value = '';
      this.condition[1].value = '';
      this.condition[2].value = '';
      this.condition[3].value = '';
      this.search();
    },
    treeSearch(vaule) {
      if (vaule) {
        this.search();
      }
    },
    search() {
      this.$refs.page.search();
    },
    change() {}
  },
  mounted() {
    this.init();
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
}

.monitor-list {
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  /deep/ .monitor-list__tool {
    position: relative;
  }
  &__tree-drop {
    width: 18.75rem !important;
    margin-left: 10px;
    /deep/ .el-input__prefix {
      padding: 0px 2px;
      color: var(--color-text-primary);
    }
    /deep/.el-input__inner {
      padding-left: 74px;
    }
    /deep/.el-select__tags {
      padding-left: 74px;
    }
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
