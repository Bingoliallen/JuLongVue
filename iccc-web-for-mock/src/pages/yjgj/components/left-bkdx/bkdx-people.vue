<template>
  <div class="bkdx-people bkdx-item">
    <div class="bkdx-item_img">
      <dg-badge :value="92" :max="99">
        <img src="static/iccc/img/1.png" />
      </dg-badge>
    </div>
    <div class="bkdx-item_content">
      <div class="bkdx-item_row">
        <span>350987198802231080</span>
        <i class="iconfont iconf-focus"></i>
      </div>
      <div class="bkdx-item_row">
        <span>2020-02-12 18:34</span>
        <span class="bkzt" :class="data.bkzt">布控中</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bkdx-people',
  props: {
    data: Object
  },
  data() {
    return {};
  },
  methods: {
    init() {}
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
</style>
