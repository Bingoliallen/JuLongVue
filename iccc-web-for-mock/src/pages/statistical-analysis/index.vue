<template>
  <div
    class="statistical-analysis"
    v-infinite-scroll="scrollLoad"
    infinite-scroll-disabled="disabled"
    infinite-scroll-immediate="true"
    infinite-scroll-distance="100"
  >
    <div class="top_analysis">
      <div class="left">
        <div class="left_first">
          <div class="left_first_summary">
            <div class="sm-title">
              布控情况概要
            </div>
            <statistical-summary></statistical-summary>
          </div>
          <div class="left_first_my">
            <div class="sm-title">
              <span>我的</span>
              <mine-tab></mine-tab>
            </div>
            <my></my>
          </div>
        </div>
        <div class="left_analysis">
          <div class="sm-title">
            <span>预警趋势分析</span>
            <tab-list :tabItems="tabItems" @change="changeItem">更多</tab-list>
          </div>
          <warning-trend-analysis></warning-trend-analysis>
        </div>
      </div>
      <div class="right">
        <div class="right_newest">
          <div class="sm-title">
            <span>最新预警</span>
            <span @click="changeToYp">更多</span>
          </div>
          <newest-warning url="/v1/concern-gjxx/search" :isTop="false"></newest-warning>

            <!-- <active-object url="/v1/concern-gjxx/search" :isTop="false"></active-object> -->
        </div>
        <div class="right_active">
          <div class="sm-title">
            <span>活跃对象Top10</span>
            <span>近一月</span>
            <!-- <dg-select style="width:100px;" v-model="valueActive" :data="dataActive" @change="handleChange">
            </dg-select> -->
          </div>
          <active-object url="/v1/gjxx/search" :isTop="true"></active-object>
        </div>
      </div>
    </div>
    <!-- <div class="center_analysis" v-if="showCenter">
      <div class="center_analysis_childDiv">
        <div class="sm-title">
          布控对象类别统计
        </div>
      </div>
      <div class="center_analysis_childDiv">
        <div class="sm-title">
          布控要素统计
        </div>
      </div>
      <div class="center_analysis_childDiv_none">
        <div class="sm-title">
          比中轨迹分类统计
        </div>
      </div>
    </div> -->
    <!-- <div class="bottom" v-if="bottomCenter">
      <div class="sm-title">
        各单位布控情况统计
      </div>
      <div class="bottom_analysis">
        <div class="bottom_analysis_childDiv">
          布控对象
        </div>
        <div class="bottom_analysis_childDiv">
          比中轨迹
        </div>
        <div class="bottom_analysis_childDiv">
          预警指令
        </div>
        <div class="bottom_analysis_childDiv_none">
          预警指令
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import StatisticalSummary from './modules/statistical-summary';
import NewestWarning from './modules/newest-warning';
import ActiveObject from './modules/active-object';

import My from './modules/my';
import WarningTrendAnalysis from './modules/warning-trend-analysis';
import TabList from './modules/tab-list';
import MineTab from './modules/mine-tab.vue';

export default {
  // 统计分析
  name: 'statistical-analysis',
  data() {
    return {
      curTab: 'ZJ',
      tabItems: [
        {
          label: '近十五天',
          value: 'ZJ'
        },
        {
          label: '本月',
          value: 'BY'
        },
        {
          label: '全年',
          value: 'QN'
        }
      ],

      valueActive: 'ZJ',
      dataActive: [
        {
          value: 'ZJ',
          label: '近一个月'
        },
        {
          value: 'JSGY',
          label: '近三个月'
        },
        {
          value: 'JBN',
          label: '近半年'
        },
        {
          value: 'JYN',
          label: '近一年'
        }
      ],
      showCenter: false,
      bottomCenter: false,
      loading: false
    };
  },
  components: {
    StatisticalSummary,
    My,
    NewestWarning,
    ActiveObject,
    WarningTrendAnalysis,
    TabList,
    MineTab
  },
  computed: {
    disabled() {
      return this.loading;
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.loading = false;
        this.showCenter = false;
        this.bottomCenter = false;
      });
    },
    changeItem(item) {
      if (item) {
        this.curTab = item.value;
        // this.queryData();
      }
    },
    handleChange() {},
    changeToYp() {
      
    },
    scrollLoad() {
      this.loading = true;
      this.$nextTick(() => {
        if (!this.showCenter) {
          this.showCenter = true;
          this.loading = false;
          return;
        }
        if (this.showCenter && !this.bottomCenter) {
          this.bottomCenter = true;
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.statistical-analysis {
  flex-direction: column;
  min-height: 100%;
  width: calc(100% + 0.625rem);
  overflow: hidden;
  .sm-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.5rem;
    font-weight: bold;
    font-size: 1.125rem;
    color: var(--color-text-primary);
    line-height: 1.125rem;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border-color-extra-light);
    span:last-child {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: var(--button-color-primary);
      line-height: 14px;
      cursor: pointer;
    }
    /deep/ .el-input__inner {
      color: var(--color-primary);
      border: 0px solid var(--color-primary);
    }
    /deep/ .el-icon-arrow-up {
    }
  }
  .top_analysis {
    width: 100%;
    height: 73.4375rem;
    display: flex;
    .left {
      flex: 1;
      margin: 0 1rem 0 0;
      width: calc(100% - 28.625rem);
      .left_first {
        width: 100%;
        display: flex;
        height: 26.5rem;
        &_summary {
          // max-width: 41.25rem;
          width: 47.5%;
          height: 100%;
          background-color: var(--color-white);
        }
        &_my {
          margin-left: 1rem;
          flex: 1;
          width: 100%;
          height: 100%;
          background-color: var(--color-white);
        }
      }
      .left_analysis {
        margin-top: 1.1875rem;
        width: 100%;
        height: 45.6875rem;
        background-color: var(--color-white);
      }
    }

    .right {
      width: 28.625rem;
      height: 100%;
      &_newest {
        width: 100%;
        height: 36.25rem;
        background-color: var(--color-white);
      }
      &_active {
        margin-top: 0.9375rem;
        width: 100%;
        height: 36.25rem;
        background-color: var(--color-white);
      }
    }
  }
  .center_analysis {
    margin-top: 1.1875rem;
    height: 25rem;
    width: 100%;
    display: flex;
    &_childDiv {
      flex: 1;
      background-color: var(--color-white);
      margin-right: 1rem;
    }
    &_childDiv_none {
      flex: 1;
      background-color: var(--color-white);
    }
  }
  .bottom {
    height: 51.8125rem;
    width: 100%;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    .bottom_analysis {
      margin: 2rem;
      display: flex;
      flex: 1;
      &_childDiv {
        flex: 1;
        background-color: #f4f7ff;
        border-radius: 0.5rem;
        margin-right: 1.5rem;
      }
      &_childDiv_none {
        flex: 1;
        background-color: #f4f7ff;
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
