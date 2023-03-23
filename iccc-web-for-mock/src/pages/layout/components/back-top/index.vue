<template>
  <el-backtop class="uo-back-top" target=".l-main-container .el-scrollbar__wrap" :bottom="100" :right="40">
    <i class="icon iconl-topping"></i>
  </el-backtop>
</template>

<script>
export default {
  name: 'BackTopBtb'
};
</script>

<style lang="scss" scoped>
.uo-back-top {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-radius: 24px;
  color: #fff;
  text-align: center;
  background: rgba(0, 0, 0, 0.08);
  transition: all 0.2s linear;
  box-shadow: unset;
  i {
    font-size: 32px;
  }
}
.uo-back-top:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.16);
}
</style>
