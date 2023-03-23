<!--
 * @Author: Liugh
 * @Date: 2020-10-20 17:02:56
 * @LastEditTime: 2021-02-25 10:42:59
 * @LastEditors: Do not edit
 * @Description:
-->
<template>
  <div class="">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="布控对象：" class="form-item_inline" v-if="form.bkdxlx !== 'RLZP'" prop="bkdxhm">
        <dg-select v-model="form.bkdxlx" clearable code="BM_BKDX_HMLX" :disabled="true"></dg-select>
        <el-input v-model="form.bkdxhm" placeholder="多个号码请用逗号隔开" :disabled="form.sfyx === '1'"></el-input>
      </el-form-item>
      <!-- TODO 暂时使用IMG标签替代后续图片回显组件好了之后替换 -->
      <img :src="QZ_SHOWIMG + form.bkdxhm" alt="" v-else />
      <div class="form-item_inline" v-if="false && form.bkdxlx == '111'">
        <el-form-item label="人员类别：">
          <dg-tree-drop
            code="BM_BKSQ_RYLB"
            :lazy-load="false"
            :check-strictly="true"
            :collapse-tags="true"
            multiple
            :props="{
              value: 'value'
            }"
            v-model="form.rylbs"
            placeholder="请选择人员类别"
            clearable
            filterable
            style="width:100%;"
          ></dg-tree-drop>
        </el-form-item>
        <el-form-item label="人员编号：">
          <el-input v-model="form.kzzd.rybh" placeholder="请输入布控对象人员编号" clearable></el-input>
        </el-form-item>
      </div>
      <div class="form-item_inline" v-else-if="false && form.bkdxlx == 'CPH'">
        <el-form-item label="号牌颜色：">
          <dg-select v-model="form.kzzd.hpys" code="BM_HPYS" placeholder="请选择号牌颜色" clearable> </dg-select>
        </el-form-item>
        <el-form-item label="车辆颜色：">
          <dg-select v-model="form.kzzd.clys" code="BM_CL_CSYS" placeholder="请输入车辆颜色" clearable> </dg-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import validator from '@icccPath/components/scenes-bkdx/modules/add-control-object/validator.js';
import { mapGetters } from 'vuex';
import { getSetting } from '@icccPath/utils/request';
const QZ_BKSQ = getSetting('QZ_BKSQ');

export default {
  name: 'bkdx',
  data() {
    return {
      rules: {
        bkdxhm: { required: true, validator: validator.isIdCard, trigger: 'blur' }
      },
      form: {
        rylbs: ''
        // kzzd: {}
      },
      QZ_SHOWIMG: QZ_BKSQ + '/api/file/view/'
    };
  },
  computed: {
    ...mapGetters(['editObject'])
  },
  methods: {
    init() {
      let kzzd = this.editObject.kzzd;
      if (kzzd) {
        try {
          if (typeof kzzd === 'string') {
            kzzd = JSON.parse(kzzd);
          }
        } catch (e) {
          console.error(e);
        }
      }
      if (!kzzd) {
        kzzd = {};
      }
      this.form = { ...this.editObject, kzzd };
      if (this.form.bkdxlx === 'RLZP') return;
      let validatorObj = validator.array.find(item => {
        return item.name === this.form.bkdxlx;
      });
      let rule = { required: true, validator: validator[validatorObj.value], trigger: 'blur' };
      this.$set(this.rules, 'bkdxhm', rule);
    },
    handSuccess(res, file, fileList) {
      console.log(res, file, fileList);
    },
    getData() {
      const rylbs = this.form.rylbs || [];
      return {
        kzzd: JSON.stringify(this.form.kzzd),
        rylbs: typeof rylbs === 'string' ? rylbs : rylbs.join(',')
      };
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  box-sizing: border-box;
  .form-item_inline /deep/ {
    display: flex;
    padding: 24px 32px 0 32px;
    .el-form-item + .el-form-item {
      margin-left: 8px;
    }
    .el-form-item {
      flex: 1;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      flex: 1;
      display: flex;
      > .el-input {
        margin-left: 8px;
      }
      > .el-select {
        flex: 300px;
      }
    }
    .el-input--suffix {
      margin-left: 0 !important;
    }
  }
  img {
    margin: 10px 32px;
    width: 200px;
    height: 200px;
  }
}
</style>
