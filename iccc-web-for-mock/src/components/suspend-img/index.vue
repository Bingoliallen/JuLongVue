<template>
  <div class="suspend-img">
    <div class="suspend-img_control">
      <scale-img :imgSrc="imgControl.src" :boxWidth="imgControlWidth" :boxHeight="boxHeight"> </scale-img>
      <div class="suspend-img_title">{{ imgControl.title }}</div>
      <div class="suspend-img_percent" v-if="percent">{{ percent }}</div>
    </div>

    <div class="suspend-img_snapshot">
      <scale-img :imgSrc="imgSnapshot.src" :boxWidth="imgSnapshotWidth" :boxHeight="boxHeight"> </scale-img>
      <div class="suspend-img_title">{{ imgSnapshot.title }}</div>
    </div>
    <div style="clear:both"></div>
  </div>
</template>
<script>
import scaleImg from '@icccPath/components/suspend-img/scale-img.vue';
export default {
  name: 'suspend-img',
  components: {
    scaleImg
  },
  props: {
    imgControl: {
      type: Object,
      default() {
        return {
          src: '',
          title: '布控照片',
          boxWidth: '12rem'
        };
      }
    },
    imgSnapshot: {
      type: Object,
      default() {
        return {
          src: '',
          title: '抓拍照片',
          boxWidth: '25.25rem'
        };
      }
    },
    boxHeight: {
      type: String,
      default: '14.6rem'
    },
    percent: {
      type: String,
      default: ''
    }
  },
  computed: {
    imgControlWidth() {
      return this.imgControl.boxWidth || '12rem';
    },
    imgSnapshotWidth() {
      return this.imgSnapshot.boxWidth || '25.25rem';
    }
  }
};
</script>
<style lang="scss" scoped>
.suspend-img {
  white-space: nowrap;
  border: 1px solid var(--border-color-extra-light);
  background-color: #fff;

  &_control {
    position: relative;
    padding: 0.3125rem;
    border-right: 1px solid var(--border-color-extra-light);
    float: left;
  }

  &_snapshot {
    position: relative;
    padding: 0.3125rem;
    float: left;
  }

  &_title {
    position: absolute;
    left: 0.3125rem;
    bottom: 0.3125rem;
    width: calc(100% - 0.625rem);
    height: 2.5rem;
    background-color: var(--suspend-img_suspend-img_title_background-color);
    opacity: 0.6;
    color: var(--suspend-img_suspend-img_title_color);
    font-size: 0.875rem;
    line-height: 2.5rem;
    text-align: center;
    z-index: 999;
  }

  &_percent {
    width: 3.6rem;
    height: 1.9rem;
    position: absolute;
    right: -1.6875rem;
    top: calc(50% - 0.9375rem);
    background: url('/static/iccc/img/suspend-percent.png') no-repeat;
    background-size: 100% 100%;
    font-size: 0.75rem;
    color: var(--suspend-img_suspend-img_percent_color);
    text-align: center;
    line-height: 1.875rem;
    z-index: 999;
  }
}
</style>
