<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="yjgj-expand">
    <div class="yjgj-expand_title">
      <div class="flex-1">
        <span class="title-text">重点人员</span>
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
      :sort-props="sort"
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
        <!--        <dg-button type="primary">轨迹合并</dg-button>-->
        <!--        <dg-button type="primary">轨迹重现</dg-button>-->
        <!--        <dg-button type="primary">魔盒精选</dg-button>-->
        <sort-button type="primary" v-model="sort.JLBGSJ" @change="search">
          <span class="text"> 变更时间排序 </span></sort-button
        >

        <dg-select
          class="monitor-list__select prefix__select"
          v-model="condition[1].value"
          code="BM_RY_RYXL"
          placeholder="请选择"
          clearable
          filterable
          @change="search"
          :custom-data="[{ value: '', label: '全部' }]"
        >
          <template slot="prefix">
            人员类型:
          </template>
        </dg-select>

        <dg-select
          class="monitor-list__select prefix__select"
          v-model="condition[0].value"
          code="BM_ZDRYXX"
          placeholder="请选择"
          clearable
          filterable
          @change="search"
          :custom-data="[{ value: '', label: '全部' }]"
        >
          <template slot="prefix">
            状态:
          </template>
        </dg-select>

        <dg-date-picker
          style="margin: 0 10px;width: 27em"
          class="u-lable-btn is-no-border"
          v-model="condition[2].value"
          type="daterange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="变更开始时间"
          end-placeholder="变更截止时间"
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
            placeholder="请输入身份证、姓名、关联属性查询"
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
          card-type="zdry"
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
import SortButton from '../../../components/base/sort-button/index';
import nzdrApi from '@icccPath/api/nzdr';

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
        { name: 'YXX', op: '=', value: '', type: '', format: '' },
        { name: 'ZDRYXL', op: '=', value: '', type: '', format: '' },
        { name: 'JLBGSJ', op: 'rangeDate', value: '', type: '', format: '' },
        { name: 'GJZ', op: 'like', value: '', type: '', format: '', mergerName: 'SFZH,XM,QTZJHM' }
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
  components: { IcccCardItem, SortButton },
  // 方法
  methods: {
    handleLoaded(res) {
      this.total = res.totalElements;
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
        { name: 'XM', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'XB', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'CSRQ', type: 'AGE', format: '', split: '', display: '年龄' },
        { name: 'SFZH', type: 'CHAR', format: '', split: '', display: '身份证号码' },
        { name: 'ZDRYXL', type: 'CODE', format: 'BM_RY_RYXL', split: '', display: '人员类别' },
        // { name: 'RYXL', type: 'CHAR', format: '', split: '', display: '人员细类' },
        { name: 'MZ', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'JG', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '籍贯' },
        { name: 'CSRQ', type: 'DATE', format: '', split: '', display: '出生日期' },
        { name: 'HJDXZ', type: 'CHAR', format: '', split: '', display: '户籍地址' },
        { name: 'HJDPCS', type: 'CHAR', format: '', split: '', display: '户籍地派出所' },
        { name: 'XZDXZ', type: 'CHAR', format: '', split: '', display: '居住地址' },
        { name: 'XZDPCS', type: 'CHAR', format: '', split: '', display: '居住地派出所' }
      ];
      if (selectData.length) {
        let listId = [];
        selectData.forEach(item => {
          listId.push(this.leftListConfig.leftTitle === '重点人员' ? item.bjzdrybh : item.concernId);
        });
        if (listId.length) {
          let ids = listId.join(',');
          let msearchCondition = [...this.condition];
          msearchCondition.push({
            name: this.leftListConfig.leftTitle === '重点人员' ? 'BJZDRYBH' : 'CONCERN_ID',
            op: 'in',
            value: ids,
            type: '',
            format: ''
          });
          nzdrApi
            .toResultExport(this.leftListConfig.showExportUrl, this.sort, list, msearchCondition, selectData.length, {
              fileName: this.leftListConfig.leftTitle + '列表导出.xls'
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
          .toResultExport(this.leftListConfig.showExportUrl, this.sort, list, this.condition, this.total, {
            fileName: this.leftListConfig.leftTitle + '列表导出.xls'
          })
          .then(res => {
            console.log(res);
          });
      }
    },
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
        item.value = '';
      });
    },
    infiniteLoad(result) {
      this.total = result.totalElements || 0;
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
