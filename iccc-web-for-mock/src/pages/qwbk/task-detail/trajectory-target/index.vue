<!--
 布控任务单-轨迹对象
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <search-page-grid
    ref="page"
    class="member-info warning-trajectory"
    :paginationProps="paginationProps"
    :url="url"
    :condition="condition"
    :scroll="false"
    :gridConfig="gridConfig"
    :toolConfig="toolConfig"
    :sortProps="sortProps"
  >
    <template v-slot:tool="{ selectedData }">
      <!-- <dg-button v-if="!toolConfig.checkbox" type="primary" @click="changeToExport(true)">导出选择</dg-button> -->
      <!-- <dg-button type="primary" @click="exportMemberList(selectedData)">导出</dg-button> -->
      <!-- <dg-button v-if="toolConfig.checkbox" @click="changeToExport(false)">退出选择</dg-button> -->

      <div class="member-info__keyword">
        <!--        <el-input-->
        <!--          v-model="keyword"-->
        <!--          v-trim-->
        <!--          placeholder="请输入关键字筛选结果"-->
        <!--          suffix-icon="el-icon-search"-->
        <!--          @blur="search()"-->
        <!--          @keyup.native="search()"-->
        <!--        ></el-input>-->
        <conditions-popover-with-input
          class="qwbk-layout__left-tool"
          style="padding: 0rem 1rem 0rem 1.5rem"
          popover-key="CONDITIONS_GJDX"
          @search="search"
        ></conditions-popover-with-input>
      </div>
    </template>
    <template v-slot="{ data, node }">
      <member class="member-info__item" :info="data" :key="data.id"></member>
    </template>
  </search-page-grid>
</template>

<script>
import { dateUtils } from '@icccPath/utils';
import ConditionsPopoverWithInput from '@icccPath/components/conditions-popover/with-input';
import Member from './member';
export default {
  name: 'trajectory-target',
  components: { Member, ConditionsPopoverWithInput },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      paginationProps: {
        pageSize: 40,
        pageSizes: [20, 40, 100, 200]
      },
      keyword: '',
      bklb: '',
      bkzt: '',
      hmlx: '',
      time: '',
      url: '/v1/bksq-gjdx/search',
      condition: [
        { name: 'SQID', op: '=', value: this.id }
        // { name: 'BKLB', op: '=', value: this.bklb },
        // { name: 'BKZT', op: '=', value: this.bkzt },
        // { name: 'HMLX', op: '=', value: this.hmlx },
        // { name: 'BKKSRQ', value: this.time, op: '>=' },
        // { name: 'BKJSRQ', value: this.time, op: '<=' },
        // { name: 'GJZ', value: this.keyword, op: 'like' }
      ],
      sortProps: [{ CJSJ: 'asc' }],
      gridConfig: {
        // 格子宽
        itemWidth: '5.625rem',
        itemHeight: '8.375rem',
        // 间距
        gap: '0.5rem'
      },
      toolConfig: { class: 'member-info__tool', checkbox: false }
    };
  },
  watch: {
    id(val) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.search();
    },
    changeToExport(flag) {
      this.toolConfig.checkbox = flag;
    },
    exportMemberList() {
      this.$refs.page.exportData();
    },
    nodeClick(node) {
      // 启用多选
      node.checked = !node.checked;
      node.active = !node.active;
      this.$refs.page.handleCheckAllChange('one', node);
    },
    search(searchCondition) {
      let conditions = [{ name: 'SQID', op: '=', value: this.id }];
      searchCondition &&
        searchCondition.forEach(item => {
          if (item.name == 'BKRQ') {
            let date = Array.isArray(item.value) ? item.value : item.value && item.value.split(',');
            if (date) {
              conditions.push({
                name: 'BKKSRQ',
                value: date[0],
                op: '>='
              });
              conditions.push({
                name: 'BKJSRQ',
                value: date[1],
                op: '<='
              });
            }
          } else {
            conditions.push(item);
          }
        });
      this.condition = conditions;

      this.$nextTick(() => {
        this.$refs.page.search();
      });
    }
  },
  updated() {
    // this.loadData();
  }
};
</script>

<style lang="scss" scoped>
.member-info {
  padding: 1.5rem 0;
  /deep/ .member-info__tool {
    position: relative;
    margin-bottom: 0rem !important;
  }
  &__keyword {
    margin-left: auto;
    width: 27.5rem;
  }
  &__item {
    cursor: pointer;
  }
  &.warning-trajectory /deep/ {
    .search-page-grid__item {
      .el-checkbox {
        z-index: 20;
        top: 0.45rem !important;
        left: 1.2rem !important;
      }
    }
  }
  /deep/.search-page-grid__content /deep/.grid {
    margin: 1rem 0 1rem;
    display: grid;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-left: 0;
  }

  /*/deep/ .search-page-grid__line {*/
  /*  margin: 10px 0 1rem 0;*/
  /*  display: grid;*/
  /*  justify-content: space-between;*/
  /*  grid-template-columns: repeat(auto-fill, 112px);*/
  /*  grid-gap: 45px 30px;*/
  /*  gap: 45px 30px;*/
  /*  padding-left: 0;*/
  /*  user-select: none;*/
  /*  .search-page-grid__item {*/
  /*    position: relative;*/
  /*    &:hover {*/
  /*      .avatar {*/
  /*        border-color: #1890ff;*/
  /*        box-shadow: 0 3px 10px 0 rgba(24, 144, 255, 0.3);*/
  /*      }*/
  /*    }*/

  /*    .el-checkbox {*/
  /*      top: 1.5rem;*/
  /*      left: 1.5rem;*/
  /*      line-height: 1;*/
  /*      margin-left: 0;*/
  /*      &:not(.is-checked) .el-checkbox__inner {*/
  /*        background: #fff;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*}*/
}
</style>
