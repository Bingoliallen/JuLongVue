<!-- Created by hcg on 2021/4/12. -->
<template>
  <div class="left-link">
    <div class="qwbk-layout__left-title">
      <div class="flex-1">
        <span class="title-text">联控单位</span>
        <span class="bkdx-num">{{ Number(67).toLocaleString() }}个</span>
      </div>
    </div>
    <div class="qwbk-layout__left-tool">
      <el-input v-model="keyword" placeholder="请输入单位名称查询" clearable @clear="inputSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="inputSearch"></i>
      </el-input>
    </div>
    <div class="qwbk-layout__left-content">单位树</div>
  </div>
</template>

<script>
export default {
  // 联动页面的左侧
  name: 'left-link',
  data() {
    return {
      keyword: ''
    };
  },
  methods: {
    init() {},
    inputSearch() {},
    changeDetail() {
      this.$emit('changeCard', { id: '1' });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped></style>
