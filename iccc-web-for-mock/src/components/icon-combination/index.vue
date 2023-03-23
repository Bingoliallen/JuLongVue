<!-- Created by hcg on 2020/11/18. -->
<template>
  <span class="icon-combination">
    <i class="iconfont" v-for="(icon, i) in icons" :key="i" v-bind="icon"></i>
  </span>
</template>

<script>
export default {
  name: 'icon-combination',
  props: {
    icons: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-combination {
  position: relative;
  line-height: 1;
  display: inline-flex;
  i {
    font-size: inherit;
    position: absolute;
    &:first-child {
      position: relative;
    }
  }
}
</style>
