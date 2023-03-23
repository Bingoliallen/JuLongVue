<!--
 * @Author: Liugh
 * @Date: 2020-10-23 11:04:24
 * @LastEditTime: 2021-02-05 10:45:45
 * @LastEditors: Please set LastEditors
 * @Description: 申请信息
-->
<template>
  <div class="apply-info-wrapper">
    <div class="cv-detail-page__box">
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="5rem">
        <!-- {{ trackInfo }} -->
        <el-form-item style="width:100%" v-for="(item, index) in infos" :key="index" :label="item.title + '：'">
          <!-- <span>{{ trackInfo[item.key] }}</span> -->
          <show-label :item="item" :value="trackInfo[item.key]"></show-label>
        </el-form-item>
        <!-- 照片 -->
        <template>
          <el-form-item v-if="isPhoto" style="width:100%" label="相似度：">
            <span class="similarity">{{ trackInfo.zpxsd | filterPercent }}</span>
          </el-form-item>
          <el-form-item
            v-if="(isPhoto || isCar) && (trackInfo.gjfl == 'RXGJ' || trackInfo.gjfl == 'CLGJ')"
            label="抓拍照片："
          >
            <!-- <head-list :info="photo"></head-list> -->
            <carousel-zp :data="trackInfo" :type="trackInfo.dxlx"></carousel-zp>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
import ShowLabel from '../components/info/showLabel';
import CarouselZp from '@icccPath/components/carousel/zpbd';

export default {
  name: 'control-informaction', // 组件名称
  components: { ShowLabel, CarouselZp },
  props: {
    trackInfo: Object
    // 接收父组件的数据
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      infos: [
        { key: 'dtxxlx', title: '轨迹类型', value: '', type: 'code', code: 'VW_BM_YWXXLX' },
        { key: 'hdfssj', title: '发生时间', value: '', type: 'date' },
        { key: 'xxbdsj', title: '比中时间', value: '', type: 'date' },
        { key: 'fsdqh', title: '发生地区', value: '', type: 'code', code: 'VW_BZ_XZQH' },
        { key: 'fsdxz', title: '发生地点', value: '' },
        { key: 'hdxgxx', title: '轨迹描述', value: '' }
      ],
      imgStyleSuspend: {
        width: '62rem',
        height: '24rem',
        background: '#fff',
        boxShadow: '0 0.125rem 0.5rem 0 var(--warning-trajectory_imgStyleSuspend_box-shadow)'
      },
      zpbdData: {}
    };
  },
  computed: {
    type() {
      return this.trackInfo.bzhm ? this.trackInfo.bzhm.split('@')[0] : '';
    },
    isPhoto() {
      return this.type === 'RLZP';
    },
    isCar() {
      return ['CPH', 'CJH', 'FDJH'].includes(this.type);
    }
  }
};
</script>

<style lang="scss" scoped>
.cv-detail-page__form--photo .photo {
  display: inline-block;
  /* float: left; */
}
.apply-info-wrapper {
  margin: 1.5rem 0rem;
}
/deep/ {
  .carousel {
    margin: 0;
    justify-content: flex-start;
    .el-carousel {
      margin: 0;
    }
  }
}
.cv-detail-page {
  &__box {
    margin-bottom: 0px;

    &-tittle {
      margin-bottom: 0px;
    }

    &-row {
      padding: 0px 0 0px 10px;
      border-bottom: solid 1px var(--control-informaction_cv-detail-page__box-row_border);

      .text-title {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    p {
      line-height: 16px;
    }

    .el-col {
      padding: 5px 0;
    }

    &-no {
      color: var(--color-danger);
    }
  }

  &__table {
    .el-form--inline .el-form-item {
      display: block;
      margin-bottom: 0;
    }

    .el-table__body td {
      background: transparent;
    }
  }
  &__form {
    .el-form-item {
      width: 50%;
      margin: 0px;
      padding: 0.17rem 0px;
      color: var(--color-text-secondary);
      /deep/ .el-form-item__label {
        padding: 0px;
      }
      /deep/ .el-form-item__content {
        color: var(--color-text-primary);
        width: 60%;
      }
    }
    // &--photo {
    //   width: 100% !important;
    //   display: flex;
    //   /deep/ .el-form-item__label {
    //     flex: 0 0 5rem;
    //   }
    //   /deep/ .el-form-item__content {
    //     width: 100% !important;
    //   }
    // }
  }
}
.form-item-zp {
  position: relative;
  width: 60px;
  height: 76px;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--button-primary-hover-background-color);
    box-shadow: 0 0.1875rem 0.625rem 0 var(--carousel_hover_box-shadow);
  }
  img {
    width: 100%;
    height: 100%;
  }
  .xsd {
    background: var(--carousel_tip_background);
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 0.75rem;
    height: 1.5rem;
    line-height: 1.5rem;
    color: var(--color-pink);
    text-align: center;
  }
  .zpbd {
    width: 62rem;
    height: 24rem;
    background: rgb(255, 255, 255);
    box-shadow: 0 0.125rem 0.5rem 0 var(--warning-trajectory_imgStyleSuspend_box-shadow);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
    border: 1px solid var(--border-color-extra-light);
    position: fixed;
    transition: all 0.3s;
  }
}
</style>
