<!--
 预警轨迹表--卡片
 @Author: lbb 公用的预警列表
 @Date: 2020-11-24
-->
<template>
  <search-page-grid
    ref="page"
    class="monitor-list warning-trajectory"
    :module="module"
    :url="url"
    :lazyLoad="true"
    :condition="condition"
    :toolConfig="toolConfig"
    :scroll="false"
    :gridConfig="gridConfig"
    :sortProps="sortProps"
  >
    <template v-slot:tool="{ selectedData }">
      <!--      <dg-button type="primary" @click="exportBkdx(selectedData)">导出</dg-button>-->
      <div class="bkdx__head">
        <conditions-popover-with-input
          class="qwbk-layout__left-tool"
          :popover-key="popoverKey"
          :placeholder="placeholder"
          @search="search"
        >
        </conditions-popover-with-input>
      </div>
    </template>
    <template v-slot="{ data, nodeIndex }">
      <!---卡片列表--->
      <div class="monitor-list-item">
        <div class="monitor-list-item__title">
          <i class="icon left" :class="iconType(data.dxlx)"></i>
          <carousel
            class="monitor-list-item__img"
            :isChange="false"
            :isSuspend="false"
            isEnlarge="none"
            :isImgId="true"
            :idCard="data.dxhm"
            :isChangeNum="false"
            imgKey="url"
            v-if="data.dxlx == 'ZP' || data.dxlx == 'RLZP'"
            :imgStyleObject="imgStyleObject"
          >
          </carousel>
          <span class="margin-right" v-else>{{ data.dxhm | filterText }}</span>
          <span class="tag" :class="{ tag_read: false }" v-code="{ code: 'VW_BM_YWXXLX', value: data.dtxxlx }"></span>
          <time>{{ data.hdfssj ? $dayjs(data.hdfssj).format('YYYY-MM-DD HH:mm:ss') : '-' }}</time>
        </div>
        <div class="monitor-list-item__content">
          <carousel-zp class="left" :data="data" :type="data.dxlx"></carousel-zp>
          <div class="right">
            <span class="tra_tip">轨迹描述</span>
            <div class="activity_info">
              <span :title="data.hdxgxx">{{ data.hdxgxx | filterText }}</span>
            </div>
          </div>
        </div>
        <div class="monitor-list-item__footer">
          <div class="monitor-list-item__footer-title">
            <i class="left icon iconl-ptrack"></i>
            <span>{{ data.fsdxz | filterText }}</span>
          </div>
          <div class="tra_tip tip_focus" @click="focusTrack(data)">
            <i class="icon" :class="data.sfsc | classFilter"></i>
            <span>收藏</span>
          </div>
        </div>
      </div>
    </template>
  </search-page-grid>
</template>
<script>
import ConditionsPopoverWithInput from '@icccPath/components/conditions-popover/with-input';
import { dateUtils } from '@icccPath/utils';
import carousel from '@icccPath/components/carousel';
import suspendImg from '@icccPath/components/suspend-img';
import { getSetting } from '@icccPath/utils/request';
import nzdrApi from '@icccPath/api/nzdr/index';
import CarouselZp from '@icccPath/components/carousel/zpbd';

export default {
  name: 'WarningTrajectory',
  components: {
    carousel,
    suspendImg,
    ConditionsPopoverWithInput,
    CarouselZp
  },
  // 接收父页面传过来的属性
  props: {
    url: {
      type: String,
      default: ''
    },
    module: {
      type: String,
      default: 'BASE_API'
    },
    concernId: {
      type: String,
      default: 'id'
    },
    concernType: {
      type: String,
      default: 'GJ' // ZDR重点人、GJ轨迹、BKDX布控对象、BKQZ布控群组
    },
    bzhm: {
      type: String,
      default: '' // 比中号码
    },
    bzhmKey: {
      type: String,
      default: 'BZHM'
    },
    sortProps: {
      type: [Array, Object],
      default: () => []
    },
    popoverKey: {
      type: String,
      default: 'CONDITIONS_YJGJ'
    },
    placeholder: {
      type: String,
      default: '请输入姓名、发生地查询'
    }
  },
  // 页面数据绑定
  data() {
    return {
      condition: [],
      toolConfig: {
        class: 'monitor-list__tool',
        checkbox: true
      },
      gridConfig: {
        // 格子宽
        itemWidth: '100%',
        // 间距
        gap: '0.75rem'
      },
      imgStyleSuspend: {
        width: '62rem',
        height: '24rem',
        background: '#fff',
        // padding: '.5rem 1rem',
        boxShadow: '0 0.125rem 0.5rem 0 var(--warning-trajectory_imgStyleSuspend_box-shadow)'
      },
      imgStyleObject: {
        width: '1rem',
        height: '1rem',
        fontSize: '0.5rem'
      },
      initFlag: false, // 条件还未初始化完成
      iconMap: {
        '111': 'iconl-personnel',
        CPH: 'iconl-car',
        QQ: 'iconl-QQ',
        SJ: 'iconl-mobile',
        WX: 'iconl-WeChat',
        ZP: 'iconl-photo',
        RLZP: 'iconl-photo'
      }
    };
  },
  watch: {
    bzhm() {
      if (this.initFlag) {
        const data = JSON.parse(JSON.stringify(this.condition));
        this.search(data);
      }
    }
  },
  filters: {
    classFilter(val) {
      if (val) {
        return 'iconf-focus';
      } else {
        return 'iconl-focus';
      }
    }
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    getBkzp(id) {
      return `${getSetting('QZ_BKSQ')}/api/file/view/${id}`;
    },
    iconType(data) {
      return this.iconMap[data] ? this.iconMap[data] : 'iconl-personnel';
    },
    exportBkdx() {
      this.$refs.page.exportData();
    },
    markAsRead(selectData) {
      console.log(selectData);
    },
    dateChange(value) {
      const fmt = 'yyyy-MM-dd  HH:mm:ss';
      return dateUtils.strToDate(value, false, fmt);
    },
    search(data) {
      this.initFlag = true;

      if (this.bzhm && data) {
        let searchCondition = data.filter(item => item.name != this.bzhmKey);
        this.condition = searchCondition;
        // 默认查询条件
        this.condition.push({ name: this.bzhmKey, value: this.bzhm, op: '=', type: '', format: '' });
        this.$refs.page && this.$refs.page.search();
      }
    },
    /**
     * 轨迹收藏
     */
    focusTrack(item) {
      const param = {
        sfgz: !item.sfsc,
        concernType: this.concernType,
        concernId: item[this.concernId]
      };
      nzdrApi.concern(param).then(() => {
        this.$forceUpdate();
        const data = JSON.parse(JSON.stringify(this.condition));
        this.search(data);
      });
    }
  },
  // 组件创建时调用
  created() {}
};
</script>
<style lang="scss" scoped>
.monitor-list {
  box-sizing: border-box;
  padding: 1.5rem 0px;

  /deep/ .monitor-list__tool {
    position: relative;
    margin-bottom: 0rem;
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

  /deep/.search-page-grid__content /deep/.grid {
    margin: 1rem 0 1rem;
    display: grid;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-left: 0;
  }

  &.warning-trajectory /deep/ {
    .search-page-grid__item {
      .el-checkbox {
        /*width: 1.5rem;*/
        left: 24px;
        top: 18px !important;
      }
    }

    .monitor-list-item {
      background: var(--color-white);
      border: 1px solid var(--disabled-border-base);
      border-radius: 2px;
      &__img {
        display: inline-block;
        margin: 0px;
      }
      &__title {
        padding: 13px 22px 13px 50px;
        width: 100%;
        background: var(--warning-trajectory_monitor-list-item__title_background);
        font-size: 14px;
        color: var(--color-primary);

        > .tag {
          background: var(--disabled-fill-base);
          border: 1px solid var(--disabled-border-base);
          border-radius: 2px;
          padding: 1px 5px;
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: var(--color-text-primary);
          line-height: 12px;
          position: relative;
        }
        > .tag_read {
          &::after {
            position: absolute;
            display: inline-block;
            top: 4px;
            right: -15px;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--color-danger);
          }
        }

        time {
          font-family: MicrosoftYaHei;
          font-size: 0.875em;
          color: var(--color-text-secondary);
          text-align: right;
          float: right;
        }

        &::after {
          content: '';
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
      }

      &__content {
        padding: 1.375rem 0 0.625rem 0;
        margin: 0 1.375rem 0 1.5rem;
        border-bottom: 1px dashed var(--border-color-extra-light);
        display: flex;

        .tra_tip {
          font-family: MicrosoftYaHei;
          font-size: 0.875em;
          color: var(--color-text-secondary);
          text-align: right;
          line-height: 0.875em;
        }
        .activity_info {
          font-family: MicrosoftYaHei;
          font-size: 0.875em;
          color: var(--color-text-primary);
          line-height: 1.3125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .right {
          flex: 1;
        }
      }

      &__carousel {
        font-size: 0;
        display: flex;
        justify-content: space-between;
        text-align: center;

        img {
          padding: 0.3125rem;
          border: 1px solid var(--border-color-extra-light);
        }

        p {
          margin-top: 1rem;
        }
      }

      &__footer {
        padding: 0.5rem 1.375rem 0.5rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
          color: var(--color-text-regular);
        }

        .address {
          > span {
            padding-left: 0.5rem;
            font-family: MicrosoftYaHei;
            font-size: 0.875em;
            color: var(--color-text-primary);
          }
        }

        .tra_tip {
          > span {
            font-family: MicrosoftYaHei;
            font-size: 0.875em;
            color: var(--color-text-secondary);
          }
        }
        .tip_focus {
          cursor: pointer;
          .iconf-focus {
            color: var(--color-warning);
          }
        }
        &-title {
          span {
            margin-left: 0.5rem;
          }
        }
      }
      .margin-right {
        margin-right: 0.5rem;
      }
    }
  }
}

.bkdx__head {
  position: absolute;
  right: 0px;
  margin-left: 10px;
  width: 27.5rem;
}
.left {
  float: left;
}
.carousel-zp {
  margin-right: 1em;
}
</style>
<style lang="scss">
.warning-trajectory-tooltip {
  width: 50%;
}
</style>
