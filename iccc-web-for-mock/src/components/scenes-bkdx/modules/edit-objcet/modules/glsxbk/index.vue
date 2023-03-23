<template>
  <div class="container">
    <manual-add module="BASE_API" ref="manualAdd"></manual-add>
  </div>
</template>

<script>
import ManualAdd from '@icccPath/components/manual-add/index';
export default {
  name: 'glsxbk',
  data() {
    return {};
  },
  methods: {
    init() {}
  },
  components: { ManualAdd },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 24px 32px 0 32px;
}
</style>
