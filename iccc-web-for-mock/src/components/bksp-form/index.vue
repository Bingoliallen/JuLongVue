<!--
 审批操作-弹窗
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div>
    <el-form label-width="100px" ref="bkspForm" :model="bksData">
      <el-form-item label="审批结果：" prop="spjg">
        <span :class="typeNum == 0 ? 'disagree-status' : ''">{{ bksData.spjg }}</span>
      </el-form-item>
      <el-form-item label="审批意见：" prop="spyj">
        <el-input
          placeholder="请输入审批意见"
          v-model="bksData.spyj"
          type="textarea"
          :rows="6"
          maxlength="200"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    
    <dg-button v-footer type="primary" @click="handleSaveClick">确定</dg-button>
    <dg-button v-footer @click="handleCancel">取消</dg-button>
   
  </div>
</template>
<script>
import { spxxApprove } from '@icccPath/api/bksp';
export default {
  name: 'bksp-from',
  //接收父页面传过来的属性
  props: {
    typeNum: {
      type: Number,
      default: 1
    },
    id: ''
  },
  //页面数据绑定
  data() {
    return {
      bksData: {
        spyj: '',
        spjg: '审批通过'
      }
    };
  },
  //计算属性
  computed: {},
  //方法
  methods: {
    //提交
    async handleSaveClick() {
      const result = await spxxApprove(
        // { sqIdList: this.id, spxx: { spjl: this.bksData.spjg, spyj: this.bksData.spyj } },
        { ids: this.id, spjl: this.typeNum, spyj: this.bksData.spyj },
        'QZ_BKSQ'
      );
      this.$emit('success', result);
      this.$emit('close', true);
    },
    handleCancel() {
      this.$emit('close', true);
    },
    handleCloseClick() {
      this.$emit('close', true);
    }
  },
  //组件创建时调用
  created() {
    if (this.typeNum == 0) {
      this.bksData.spjg = '退回';
    }
  }
};
</script>
<style lang="scss" scoped>
.disagree-status {
  color: #f5222d;
}
</style>
