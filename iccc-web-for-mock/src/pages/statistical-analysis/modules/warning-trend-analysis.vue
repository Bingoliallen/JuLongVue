<template>
  <div ref="pageWrapper" class="warning-trend-analysis">
     <line-stack></line-stack>
  </div>
</template>

<script>
import LineStack from './line-stack';
export default {
  // 预警趋势分析
  name: 'warning-trend-analysis',
  components: {
    LineStack
  },
  data() {
    return {
      
    };
  },
  methods: {
    getRuleCount() {},
    handleClick(e) {
      this.activeIndex = e.index;
    }
  },
  created() {
    this.getRuleCount();
  }
};
</script>

<style scoped lang="scss">
.warning-trend-analysis {
  height: calc(100% - 4rem);
  width: 100%;
 
}
</style>
