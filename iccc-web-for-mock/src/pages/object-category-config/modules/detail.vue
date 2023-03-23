<!-- Created by hcg on 2021/3/3. -->
<template>
  <el-form class="object-category-edit" ref="form" :model="data" label-width="9em" label-suffix="：">
    <dg-form-item prop="pid" v-if="data.ph" label="上级类别">
      <span v-code="{ code: 'BM_BKSQ_BKLB', value: data.ph }"></span>
    </dg-form-item>
    <dg-form-item prop="bh" label="人员类别编号">
      <span>{{ data.bh | filterText }}</span>
    </dg-form-item>
    <dg-form-item prop="mc" label="人员类别名称">
      <span>{{ data.mc | filterText }}</span>
    </dg-form-item>
    <dg-form-item prop="sjly" label="规范类别">
      <!-- <el-radio-group v-model="data.sjly">
        <el-radio :label="1">部规范</el-radio>
        <el-radio :label="2">本地规范</el-radio>
      </el-radio-group> -->
      <el-radio v-model="data.sjly" label="01">部规范</el-radio>
      <el-radio v-model="data.sjly" label="02">本地规范</el-radio>
    </dg-form-item>
    <dg-form-item prop="cjrxm" label="采集人">
      <span>{{ data.cjrxm | filterText }}</span>
    </dg-form-item>
    <dg-form-item prop="cjrlxfs" label="采集人联系方式">
      <span>{{ data.cjrlxfs | filterText }}</span>
    </dg-form-item>
    <dg-form-item prop="cjdwdm" label="采集单位">
      <span v-code="{ code: 'VW_BM_DEPT', value: data.cjdwdm }"></span>
    </dg-form-item>
    <dg-form-item prop="cjsj" label="采集时间">
      <template>{{ data.cjsj | filterDate }}</template>
    </dg-form-item>
  </el-form>
</template>

<script>
export default {
  // 详情
  name: 'object-category-detail',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.object-category-edit {
  .rylbbh /deep/ {
    .el-input-group__prepend {
      width: 50%;
      text-align: right;
      padding-right: 1em;
    }
  }
  .form-btns {
    text-align: center;
  }
}
</style>
