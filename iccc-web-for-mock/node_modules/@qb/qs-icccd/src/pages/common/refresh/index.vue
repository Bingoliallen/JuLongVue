<template>
  <div></div>
</template>

<script>
export default {
  // 名称
  name: 'refresh',
  // 组件内部参数
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace(from.path);
    });
  }
};
</script>

<style lang="scss" scoped></style>
