<template>
  <div class="no-record__wrap" :style="{ height: height }" :class="{ 'is-border': hasBorder }">
    <div class="no-record">
      <div class="no-record__img"><img src="../../../assets/images/common/no-result.png" alt="" /></div>
      <span class="no-record__text">{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'no-record',
  props: {
    hasBorder: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '250px'
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  }
};
</script>

<style lang="scss" scoped>
.no-record__wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  .no-record__img {
    display: inline-block;
  }
  .no-record__text {
    display: inline-block;
    text-align: center;
    margin-left: 1rem;
    color: var(--color-text-regular);
  }
}
</style>
