<!-- Created by hcg on 2021/3/3. -->
<template>
  <el-form
    class="object-category-edit"
    ref="form"
    :model="model"
    label-width="9em"
    label-suffix="："
    :disabled="model.sjly === 1"
  >
    <dg-form-item prop="sfqy" label="是否启用">
      <el-radio v-model="model.sfqy" label="1">启用</el-radio>
      <el-radio v-model="model.sfqy" label="0">禁用</el-radio>
    </dg-form-item>
    <dg-form-item prop="ph" v-if="!rylbRootBh || model.ph !== rylbRootBh" label="上级类别">
      <span v-code="{ code: 'BM_BKSQ_RYLB_ALL', value: model.ph }"></span>
    </dg-form-item>
    <dg-form-item prop="suffixValue" v-if="model.ph" label="人员类别编号" rules="required">
      <dg-input
        class="rylbbh"
        v-model="model.suffixValue"
        :disabled="data.id !== 'id-new'"
        placeholder="请输入人员类别编号"
        maxlength="3"
        @blur="suffixValueBlur"
      >
        <template slot="prepend">{{ model.ph }}</template>
      </dg-input>
    </dg-form-item>
    <dg-form-item prop="suffixValue" v-else label="人员类别编号" rules="required">
      <dg-input
        class="rylbbh"
        v-model="model.suffixValue"
        :disabled="data.id !== 'id-new'"
        placeholder="请输入人员类别编号"
      ></dg-input>
    </dg-form-item>
    <dg-form-item prop="mc" label="人员类别名称" rules="required">
      <dg-input v-model="model.mc" placeholder="请输入人员类别名称"></dg-input>
    </dg-form-item>
    <dg-form-item prop="sjly" label="规范类别">
      <el-radio-group v-model="model.sjly">
        <el-radio :label="1">部规范</el-radio>
        <el-radio :label="2">本地规范</el-radio>
      </el-radio-group>
    </dg-form-item>
    <dg-form-item prop="cjrxm" label="采集人">
      <dg-input v-model="model.cjrxm" placeholder="请输入采集人姓名"></dg-input>
    </dg-form-item>
    <dg-form-item prop="cjrlxfs" label="采集人联系方式">
      <dg-input v-model="model.cjrlxfs" placeholder="请输入采集人联系方式"></dg-input>
    </dg-form-item>
    <dg-form-item prop="cjdwdm" label="采集单位">
      <span v-code="{ code: 'VW_BM_DEPT', value: model.cjdwdm }"></span>
    </dg-form-item>
    <dg-form-item prop="cjsj" label="采集时间">
      <template>{{ model.cjsj | filterDate }}</template>
    </dg-form-item>
    <div class="form-btns">
      <dg-button type="primary" @click="save">保存</dg-button>
      <dg-button type="primary" plain @click="reset">重置</dg-button>
    </div>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex';
import { longTime2Str } from '@icccPath/filters';
import { updateDetail, addCategory } from './../request';

const { getSetting } = window.systemParamsUtils;

export default {
  // 新增/编辑
  name: 'object-category-edit',
  props: {
    data: {
      type: Object,
      required: true
    },
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rylbRootBh: getSetting('RYLB_ROOT_BH') || '',
      model: {}
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    data: {
      handler(data) {
        let model = {
          // 采集单位代码
          cjdwdm: this.user.securityOrg,
          // 采集人id
          cjrid: this.user.id,
          // 采集人姓名
          cjrxm: this.user.name,
          // 采集人联系方式
          cjrlxfs: this.user.mobile,
          // 采集时间
          cjsj: longTime2Str(new Date(), 'yyyyMMddHHmmss')
        };
        // value 是编码，不允许改变
        if (data.id === 'id-new') {
          // 新增
          model.mc = '';
        }
        // 截取后面3位回显到输入框
        model.suffixValue = data.ph ? data.bh.substr(data.bh.length - 3) : data.bh;
        model.sjly = data.sjly === '01' ? 1 : 2;
        model = { ...data, ...model };
        delete model.children;
        delete model.editing;
        delete model.id;
        this.model = model;
      },
      immediate: true
    }
  },
  methods: {
    suffixValueBlur() {
      let suffixValue = this.model.suffixValue;
      if (!suffixValue) {
        return;
      }
      // 前面补0
      suffixValue = '00' + suffixValue;
      this.model.suffixValue = suffixValue.substr(suffixValue.length - 3, 3);
    },
    async save() {
      await this.$refs.form.validate();
      const data = this.model;
      data.bh = (data.ph || '') + data.suffixValue;
      data.sjly = this.model.sjly === 1 ? '01' : '02';
      delete data.suffixValue;
      delete data.value;
      let newData;
      if (data.id === 'id-new') {
        const res = await addCategory(data);
        newData = res.data || data;
      } else {
        const res = await updateDetail(data.bh, data);
        newData = res.data || data;
      }
      newData.id = 'id-' + newData.bh;
      // 保存成功后通知外面的树更新数据
      this.$emit('edit-success', { data: newData, node: this.node });
    },
    reset() {
      this.$refs.form.resetFields();
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
