<!--
    Exception 首页
    @Author: zouwf
    @Date: 2019-12-12
-->

<template>
  <el-row style="margin: 8px 8px;">
    <!--头部卡牌-->

    <el-row class="l-row-normal">
      <el-col :span="24" class="demo">
        hello UI4.0
      </el-col>
    </el-row>
    <!--表格-->
  </el-row>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {};
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.demo {
  width: 100%;
  height: calc(100vh - 230px);
  text-align: center;
  background-color: white;
  font-size: 40px;
  line-height: calc(100vh - 230px);
}
</style>
