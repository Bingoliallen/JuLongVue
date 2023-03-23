<!--成员信息-->
<template>
  <search-page-grid
    ref="page"
    class="member-info warning-trajectory"
    :paginationProps="paginationProps"
    :url="url"
    :lazyLoad="true"
    placeholder="请输入布控号码、姓名查询"
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
        <!-- <el-input
          v-model="keyword"
          v-trim
          placeholder="请输入关键字筛选结果"
          suffix-icon="el-icon-search"
          @blur="search()"
          @keyup.native="search()"
        ></el-input> -->
        <conditions-popover-with-input
          class="qwbk-layout__left-tool"
          style="padding: 0rem 0.875rem 0rem 1.5rem"
          placeholder="请输入布控号码、姓名查询"
          popover-key="CONDITIONS_MEMBER"
          ref="multipleChoose"
          :showPopover="false"
          @search="search"
        ></conditions-popover-with-input>
      </div>
    </template>
    <template v-slot="{ data, node }">
      <member class="member-info__item" @click.native="nodeClick(node)" :info="data" :key="data.ID"></member>
    </template>
  </search-page-grid>
</template>

<script>
import ConditionsPopoverWithInput from '@icccPath/components/conditions-popover/with-input';
import Member from './member';
export default {
  name: 'member-info',
  components: {
    Member,
    ConditionsPopoverWithInput
  },
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
      url: '/v1/bkdx/search',
      condition: [],
      sortProps: [],
      gridConfig: {
        // 格子宽
        itemWidth: '5.625rem',
        itemHeight: '8.375rem',
        // 间距
        gap: '0.5rem'
      },
      toolConfig: {
        class: 'member-info__tool',
        // 不显示多选，等导出功能做好了再加进去
        checkbox: false
      },
      initFlag: false
    };
  },
  watch: {
    id() {
      if (this.initFlag) {
        const data = JSON.parse(JSON.stringify(this.condition));
        this.init(data);
      }
    }
  },
  methods: {
    init(data) {
      // this.$refs.multipleChoose.searchGjz = '';
      this.search(data);
    },
    changeToExport(flag) {
      this.toolConfig.checkbox = flag;
    },
    exportMemberList() {
      this.$refs.page.exportData();
    },
    nodeClick(node) {
      this.$emit('member-click', node.data);
    },
    search(data) {
      this.initFlag = true;
      this.condition = data;
      if (data) {
        let searchCondition = data.filter(item => item.name != 'QZID');
        this.condition = searchCondition;
        // 默认查询条件
        this.condition.push({ name: 'QZID', value: this.id, op: '=', type: '', format: '' });
        this.$refs.page && this.$refs.page.search();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.member-info {
  padding: 1.5rem 0rem;

  /deep/ .member-info__tool {
    position: relative;
    margin-bottom: 0rem !important;
  }

  &__keyword {
    margin-left: auto;
    width: 25.38rem;
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
