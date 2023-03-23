<!--
 * @Author: Liugh
 * @Date: 2020-10-13 10:26:51
 * @LastEditTime: 2021-03-03 15:46:03
 * @LastEditors: Do not edit
 * @Description: 新增布控对象组件
-->
<template>
  <div class="addControlObject">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <div class="form-item_inline">
        <el-form-item label="布控对象：" prop="bkdxlx">
          <dg-tree-drop
            v-bind="$attrs.selectBind"
            v-model="form.bkdxlx"
            clearable
            collapse-tags
            :placeholder="$attrs.selectPlaceholder"
            :data="$attrs.selectData"
            @change="controlObjChange"
          ></dg-tree-drop>
        </el-form-item>
        <el-form-item label="" label-width="0" prop="bkdxhm" class="revise_el-form-item__error input">
          <el-input
            v-model="form.bkdxhm"
            :placeholder="$attrs.inputPlaceholder"
            clearable
            :disabled="form.bkdxlx == 'RLZP'"
          ></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <div class="inline-button_group">
            <dg-button type="primary" :disabled="getsAssociation" @click="addObj">添加</dg-button>
            <dg-upload
              accept=".png,.jpg,.bmp"
              :before-upload="file => $tool.beforeAvatarUpload(file, 'image', 2)"
              :on-success="handSuccess"
              class="upload__img"
              v-model="form.fileList"
              multiple
              module="QZ_BKSQ"
              label-name="label"
              value-name="value"
              :show-file-list="false"
            >
              <el-button type="primary" style="text-align: none">点击上传</el-button>
            </dg-upload>
            <dg-button type="primary" plain @click="bulkImport">批量导入</dg-button>
          </div>
        </el-form-item>
      </div>
      <div class="form-item_inline" v-if="false && form.bkdxlx == '111'">
        <!-- <el-form-item label="人员姓名：" class="revise_el-form-item__error">
          <el-input v-model="form.kzzd.ryxm" placeholder="请输入布控对象人员姓名" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="人员类别：" class="revise_el-form-item__error">
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
        <el-form-item label="人员编号：" class="revise_el-form-item__error">
          <el-input v-model="form.kzzd.rybh" placeholder="请输入布控对象人员编号" clearable></el-input>
        </el-form-item>
      </div>
      <div class="form-item_inline" v-if="false && form.bkdxlx == 'CPH'">
        <el-form-item label="号牌颜色：" class="revise_el-form-item__error">
          <dg-select v-model="form.kzzd.hpys" code="BM_HPYS" placeholder="请选择号牌颜色" clearable> </dg-select>
        </el-form-item>
        <el-form-item label="车辆颜色：" class="revise_el-form-item__error">
          <dg-select v-model="form.kzzd.clys" code="BM_CL_CSYS" placeholder="请输入车辆颜色" clearable> </dg-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import validator from './validator';
import sqdxApi from '@icccPath/api/sqdx/index.js';
import { mapGetters } from 'vuex';
export default {
  name: 'addControlObject', // 组件名称
  props: {
    // 接收父组件的数据
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      form: {
        fileList: [],
        bkdxlx: this.$attrs.value,
        bkdxhm: '',
        hmlxzh: '',
        rylbs: '',
        kzzd: {}
      },
      isAddIng: false,
      rules: {
        bkdxlx: { required: true, message: '请选择布控类型', trigger: 'change' },
        bkdxhm: { required: true, validator: validator.isIdCard, trigger: 'blur' }
      }
    };
  },
  computed: {
    ...mapGetters(['provisionalId']),
    getsAssociation() {
      return this.isAddIng || !(this.form.bkdxlx && this.form.bkdxlx !== 'RLZP' && this.form.bkdxhm);
    }
  },
  methods: {
    /**
     * @description:批量导入弹窗
     */
    bulkImport() {
      const layer = this.$dgLayer({
        title: '批量导入',
        component: import('./module/layer'),
        btn: ['确定', '取消'],
        btnAlign: 'c',
        skin: 'layer-no-padding',
        loading: true,
        maxmin: false,
        resize: false,
        area: ['900px', '400px'],
        zIndex: 10,
        props: {},
        yes: index => {
          layer.$children[0].importSave(() => {
            layer.close(index);
            this.$emit('addObj', true);
          });
        }
      });
    },
    /**
     * @description:
     * @param {Array} bearList 后端需要的数组
     * @param {Boolean} flag 是否清空
     * @return {*}
     */
    saveInterface(bearList, flag) {
      sqdxApi
        .addBkdx(bearList)
        .then(res => {
          this.addlock = false;
          this.$message.success('添加成功');
          this.$emit('addObj', this.form);
          this.isAddIng = false;
          if (flag) {
            this.$nextTick(() => {
              this.$refs.ruleForm.resetFields();
              this.form = { ...this.form, fileList: [], bkdxhm: '', rylbs: '', kzzd: {} };
              this.controlObjChange(this.form.bkdxlx);
            });
          }
        })
        .catch(err => {
          this.isAddIng = false;
          let obj = JSON.parse(err.response.data.message);
          this.$message.warning(obj.cwnr + '  ' + obj.cwxx);
        });
    },
    /**
     * @description: 添加对象
     */
    addObj() {
      this.isAddIng = true;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.isAddIng = false;
          return false;
        }
        let bearList = [];
        let list = this.form.bkdxhm && this.form.bkdxhm.replace(/[\uff0c]/g, ',').split(',');
        let flag = this.form.bkdxlx.includes('CPH');
        list.forEach(item => {
          item = item.trim();
          if (item) {
            let obj = {
              sqid: this.provisionalId,
              bkdxhm: '',
              bkdxlx: '',
              hmlxzh: this.form.bkdxlx,
              kzzd: JSON.stringify(this.form.kzzd),
              rylbs: this.form.rylbs
            };
            obj.bkdxhm = flag ? item.toUpperCase() : item;
            bearList.push(obj);
          }
        });
        this.saveInterface(bearList, true);
      });
    },
    /**
     * @description:照片上传成功
     */
    handSuccess(res, file, fileList) {
      if (res.statusCode == '500') {
        this.$message.warning(res.message);
      } else {
        if (
          this.form.fileList.every(item => {
            return item.status == 'success';
          })
        ) {
          let bearList = [];
          fileList.forEach(item => {
            let obj = {
              sqid: this.provisionalId,
              bkdxhm: item.response.id,
              bkdxlx: '',
              hmlxzh: 'RLZP',
              kzzd: JSON.stringify(this.form.kzzd),
              rylbs: this.form.rylbs
            };
            bearList.push(obj);
          });
          this.saveInterface(bearList, false);
          this.form.fileList = [];
        }
      }
    },
    /**
     * @description:布控对象类型的切换事件（用来动态控制后面的表单校验）
     * @param {String} val
     */
    controlObjChange(val) {
      this.$refs.ruleForm.clearValidate('bkdxhm');
      let type;
      if (val.indexOf('_') !== '-1') {
        type = val.split('_')[0];
      } else {
        type = val;
      }
      if (type == 'RLZP') return;
      if (type) {
        let validatorObj = validator.array.find(item => {
          return item.name == type;
        });
        let rule = { required: true, validator: validator[validatorObj.value].bind(this.form), trigger: 'blur' };
        this.$nextTick(() => {
          this.$set(this.rules, 'bkdxhm', rule);
        });
        this.form.bkdxhm = '';
      } else {
        let rule = { required: true, validator: validator.isIdCard, trigger: 'blur' };
        this.$nextTick(() => {
          this.$set(this.rules, 'bkdxhm', rule);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'index.scss';
</style>
