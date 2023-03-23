<!-- Created by hcg on 2021/3/30. -->
<template>
  <div class="carousel-zp" @click.stop="showZpBd">
    <span class="xsd" v-if="config.zpxsd">{{ config.zpxsd }}</span>
    <img alt="" :src="config.imgSrc || ''" :class="['iconfont', 'avatar-error__' + $tool.bkdxHmlxToIcon(type)]" />

    <div class="zpbd" v-if="config.imgSrc && show">
      <suspend-img
        :imgControl="config.imgControl"
        :imgSnapshot="config.imgSnapshot"
        boxHeight="23.125rem"
        :percent="config.zpxsd"
      >
      </suspend-img>
    </div>
  </div>
</template>

<script>
import SuspendImg from '@icccPath/components/suspend-img';
import { getSetting } from '@icccPath/utils/request';
import { filterPercent } from '@icccPath/filters';

export default {
  name: 'carousel-zp',
  components: { SuspendImg },
  props: {
    data: Object,
    type: String
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    config() {
      const { bzxzpUrl, bzdzpUrl, gjfl, dxhm, zpxsd } = this.data;
      if (!gjfl) {
        return {};
      }
      const flag = gjfl === 'RXGJ';
      let imgControlSrc = bzxzpUrl;
      if (flag) {
        // 人像显示布控照片，用照片ID获取
        const baseURL = getSetting('QZ_BKSQ');
        imgControlSrc = `${baseURL}/api/file/view/${dxhm}`;
      }
      return {
        zpxsd: flag ? filterPercent(zpxsd) : '',
        imgSrc: bzxzpUrl,
        imgControl: { src: imgControlSrc, title: flag ? '布控照片' : '车牌照片', boxWidth: '18.75rem' },
        imgSnapshot: { src: bzdzpUrl, title: flag ? '抓拍照片' : '车辆照片', boxWidth: '41.5625rem' }
      };
    }
  },
  methods: {
    showZpBd() {
      this.show = true;
    },
    hideZpBd(e) {
      if (!this.show) {
        return;
      }
      const el = this.$el.querySelector('.zpbd');
      const target = e.target;
      if (el && !(el === target || el.contains(target))) {
        this.show = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.hideZpBd);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideZpBd);
  }
};
</script>

<style lang="scss" scoped>
.carousel-zp {
  position: relative;
  width: 60px;
  height: 76px;
  cursor: pointer;
  border: 1px solid var(--border-color-base);
  &:hover {
    border-color: var(--button-primary-hover-background-color);
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
