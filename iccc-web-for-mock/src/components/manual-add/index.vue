<!--
 * @Author: Liugh
 * @Date: 2020-06-24 14:08:37
 * @LastEditTime: 2021-03-12 09:09:51
 * @LastEditors: Do not edit
 * @Description: 添加对象
-->
<template>
  <div class="manual-add">
    <el-form ref="ruleForm" :rules="rules" :model="form">
      <div class="inlineFlex">
        <el-form-item label="新增属性：" :rules="rules" prop="hmlx" v-if="flag" class="inlineFlex__left">
          <dg-tree-drop
            v-model="form.hmlx"
            code="BM_BKDX_HMLX"
            :module="module"
            placeholder="请选择关联属性"
            clearable
            filterable
            collapse-tags
            :check-leaf="true"
            :check-strictly="true"
            :lazy-load="false"
            :props="{ value: 'value' }"
            @change="relationChange"
          ></dg-tree-drop>
        </el-form-item>
        <el-form-item label="" label-width="0" prop="hmnr" class="inlineFlex__right">
          <el-input
            v-model="form.hmnr"
            placeholder="多个号码请用逗号隔开"
            :disabled="form.hmlx == 'RLZP'"
            clearable
          ></el-input>
          <div class="inline-button_group">
            <el-button type="primary" plain @click="add" :disabled="form.hmlx == 'RLZP'">增加属性</el-button>
            <dg-upload
              multiple
              class="upload__img"
              accept=".png,.jpg,.bmp"
              :before-upload="file => $tool.beforeAvatarUpload(file, 'image', 2)"
              v-model="fileList"
              :on-success="handSuccess"
              module="QZ_BKSQ"
              label-name="label"
              value-name="value"
              :show-file-list="false"
              ><el-button type="primary" style="text-align: none">点击上传</el-button>
            </dg-upload>
          </div>
        </el-form-item>
      </div>
      <!-- TODO 暂时没有用到后续实现 -->
      <!-- <el-form-item label="新增对象：" class="form-item_inline" v-else>
        <div>
          <dg-select
            v-model="form.relation"
            code="BM_QWBK_GXDX"
            :module="module"
            placeholder="请选择关系对象"
            clearable
          ></dg-select>
          <dg-select
            v-model="form.relationAttr"
            code="BM_BKDX_HMLX"
            :module="module"
            placeholder="请选择关联属性"
            clearable
          ></dg-select>
          <el-input v-model="form.name" style="width:230px" placeholder="多个号码请用逗号隔开" clearable></el-input>
          <div class="inline-button_group">
            <dg-button type="primary" plain @click="add">增加对象</dg-button>
          </div>
        </div>
      </el-form-item> -->
      <el-form-item :label="flag ? '选择属性：' : '选择对象：'" class="form-item_inline">
        <div>
          已经选择布控属性{{ relationList.length }}个<el-button type="text" style="margin-left:5px" @click="empty"
            >清空选择</el-button
          >
        </div>
        <div class="tag">
          <!-- <el-checkbox-group v-model="checkList"> -->
          <!-- <el-checkbox :label="tag.hmnr" v-for="(tag, index) in relationList" :key="index"> -->
          <div class="tag_container">
            <dg-tag
              class="tag__item"
              v-for="(tag, index) in relationListText"
              :key="index"
              :class="{ unusual: tag.sfyx == '0' }"
              :closable="tag.edit"
              @close="handleClose(tag)"
            >
              <span v-code="{ code: 'BM_BKDX_HMLX', value: tag.hmlxzh, emptyText: '暂无' }"></span>：
              <span>{{ tag.hmnr }}</span>
            </dg-tag>
          </div>
          <div class="img_container">
            <div v-for="(imgItem, index) in relationListImg" :key="index">
              <i class="el-tag__close el-icon-close" @click="delRelationList(imgItem)"></i>
              <img :src="QZ_SHOWIMG + imgItem.hmnr" alt="" />
            </div>
          </div>
          <!-- </el-checkbox>
          </el-checkbox-group> -->
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import validator from '../scenes-bkdx/modules/add-control-object/validator';
import { mapActions, mapGetters } from 'vuex';
import sqdxApi from '@icccPath/api/sqdx/index.js';
import { getSetting } from '@icccPath/utils/request';
const QZ_BKSQ = getSetting('QZ_BKSQ');
export default {
  name: 'manual-add', // 组件名称
  props: {
    // 接收父组件的数据，
    flag: {
      type: Boolean,
      default: true
    },
    module: {
      type: String,
      default: ''
    }
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      QZ_SHOWIMG: QZ_BKSQ + '/api/file/view/',
      form: {
        hmlx: '111',
        hmnr: ''
      },
      rules: {
        hmlx: { required: true, message: '请选择关联属性类型', trigger: 'change' },
        hmnr: { required: true, validator: validator.isIdCard, trigger: 'blur' }
      },
      relationList: [],
      fileList: []
      // checkList: []
    };
  },
  computed: {
    ...mapGetters(['editObject']),
    relationListText() {
      return this.relationList.filter(item => {
        return (item.hmlx !== '' && item.hmlx !== 'RLZP') || (item.hmlxzh !== '' && item.hmlxzh !== 'RLZP');
      });
    },
    relationListImg() {
      return this.relationList.filter(item => {
        return item.hmlx == 'RLZP' || item.hmlxzh == 'RLZP';
      });
    }
  },
  watch: {}, // 侦听器（扩展的计算属性）
  methods: {
    /**
     * @description:初始化 TODO后续实现关联勾选
     * @param {}
     * @return:
     */
    init() {
      console.log(this.editObject, this.action);
      this.$nextTick(() => {
        // 切断原型链
        this.relationList = this.editObject.bkdxsx ? [...this.editObject.bkdxsx] : [];
        this.relationList.forEach(item => {
          item.edit = true;
        });
      });
    },
    /**
     * @description: 删除标签
     * @param {}
     * @return:
     */
    handleClose(tag) {
      this.relationList.splice(this.relationList.indexOf(tag), 1);
    },
    /**
     * @description:清空勾选
     * @param {}
     * @return:
     */
    empty() {
      // this.checkList = [];
      this.relationList = [];
    },
    /**
     * @description:头像上传成功
     */
    handSuccess(res, file, fileList) {
      if (res.statusCode == '500') {
        this.$message.warning(res.message);
      } else {
        if (
          this.fileList.every(item => {
            return item.status == 'success';
          })
        ) {
          this.fileList.forEach(item => {
            let obj = { hmlx: '', hmlxzh: 'RLZP', hmnr: item.response.id, edit: true, sfyx: '1' };
            this.relationList.unshift(obj);
            this.fileList = [];
            this.$nextTick(() => {
              // this.form.hmlx = '111';
              this.form.hmnr = '';
            });
          });
        }
      }
    },
    /**
     * @description:添加关联属性和对象
     * @param {}
     * @return:
     */
    add() {
      let obj;
      if (this.flag) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            obj = { hmlx: '', hmlxzh: this.form.hmlx, hmnr: this.form.hmnr, edit: true, sfyx: '1' };
            this.relationList.unshift(obj);
            // this.checkList.unshift(obj);
            this.form.hmlx = '111';
            this.form.hmnr = '';
            this.fileList = [];
            this.$refs.ruleForm.resetFields();
            this.relationChange(this.form.hmlx);
          } else {
            return false;
          }
        });
      } else {
        // TODO 暂时没有用到，后续实现
        // if (this.form.relation && this.form.relationAttr && this.form.name) {
        //   this.getBmMc({ codeId: 'BM_QWBK_GXDX', key: this.form.relation, module: 'QZ_BKDX' }).then(res => {
        //     this.getBmMc({ codeId: 'BM_BKDX_HMLX', key: this.form.relationAttr, module: 'QZ_BKDX' }).then(resOne => {
        //       obj = { hmlx: res, hmnr: this.form.hmnr, edit: true };
        //       this.relationList.unshift(obj);
        //       // this.checkList.unshift(obj);
        //       this.form.hmlx = '111';
        //       this.form.hmnr = '';
        //       this.form.relationAttr = '';
        //     });
        //   });
        // }
      }
    },
    /**
     * @description:
     * @param {Object} imgItem 数据项
     */
    delRelationList(imgItem) {
      let imgItemIndex;
      for (let index = 0; index < this.relationList.length; index++) {
        const element = this.relationList[index];
        if (element.hmnr == imgItem.hmnr) {
          imgItemIndex = index;
          break;
        }
      }
      this.relationList.splice(imgItemIndex, 1);
    },
    /**
     * @description: 清空checklist
     * @param {type}
     * @return:
     */
    clearCheckList() {
      // this.checkList = [];
      this.fileList = [];
      this.relationList = [];
    },
    /**
     * @description:关联属性类型的切换事件（用来动态控制后面的表单校验）
     * @param {String} val
     */
    relationChange(val) {
      this.$refs.ruleForm.clearValidate('hmnr');
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
        let rule = { required: true, validator: validator[validatorObj.value], trigger: 'blur' };
        this.$set(this.rules, 'hmnr', rule);
        this.$set(this.form, 'hmnr', '');
      } else {
        let rule = { required: true, validator: validator.isIdCard, trigger: 'blur' };
        this.$set(this.rules, 'hmnr', rule);
      }
    },
    /**
     * @description:点击确定
     */
    save(data) {
      sqdxApi
        .sqdxupdate(this.editObject.id, {
          id: this.editObject.id,
          bkdxsx: JSON.stringify(this.relationList),
          rylbs: data.rylbs || this.editObject.rylbs,
          kzzd: data.kzzd || JSON.stringify(this.editObject.kzzd)
        })
        .then(res => {
          this.SBM_EDIT_SHOW(false);
          this.$message.success('操作成功');
          this.editObject.bkdxsx = this.relationList;
          this.SBM_EDIT_OBJECT(this.editObject);
        });
    },
    ...mapActions(['getBmMc', 'SBM_EDIT_OBJECT', 'SBM_EDIT_SHOW'])
  }, // 内部方法
  created() {
    this.init();
  } // 组件创建完成后
};
</script>
<style lang="scss" scoped>
.manual-add {
  > span {
    cursor: pointer;
    color: var(--color-primary);
    > .switch {
      display: inline-block;
      transition: transform 0.5s;
      font-size: 1em;
    }
    .switchTrue {
      transform: rotate(-90deg);
    }
  }
  .el-form {
    box-sizing: border-box;
    .el-form-item {
      .el-form-item__content {
        display: flex;
      }
    }
    .inlineFlex {
      display: flex;
      .el-form-item /deep/ {
        .el-form-item__content {
          display: flex;
          flex: 1;
        }
      }
      &__left {
        flex: 300px 0 0;
        .dg-tree-select {
          width: 100% !important;
        }
      }
      &__right {
        // display: flex;
        flex: 450px 0 0;
        margin-left: 8px;
      }
    }
    .form-item_inline /deep/ {
      display: flex;
      flex-wrap: wrap;
      .el-form-item__content {
        flex: 1;
        display: inline-block;
        > div {
          // display: flex;
          .el-select {
            width: 160px;
            margin-right: 10px;
          }
          > .el-input {
            width: 400px;
          }
        }
      }
    }
    .form_text {
      cursor: pointer;
      margin-left: 10px;
      color: var(--color-primary);
    }
  }
  .tag {
    .tag_container {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    &__item {
      height: auto;
      line-height: unset;
      display: flex;
      align-items: center;
      margin: 0 8px 8px 0;
      background: var(--table-header-background-color);
      border: 1px solid var(--border-color-base);
      border-radius: 2px;
      color: var(--color-text-primary);
      > img {
        height: 1.5625rem;
        width: 1.5625rem;
      }
      &.unusual {
        border: 1px solid red;
      }
    }
  }
  .img_container {
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-right: 8px;
      margin-bottom: 8px;
      width: 100px;
      height: 100px;
      position: relative;
      &:hover .el-tag__close.el-icon-close {
        display: block;
      }
      .el-tag__close.el-icon-close {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        color: var(--color-text-regular);
        &:hover {
          color: var(--color-text-primary);
        }
      }
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .upload {
    margin-top: 12px;
    &__img {
      //   border: 1px solid red;
      /deep/ .el-upload-list {
        > li {
          padding: 0;
          margin-right: 18px;
          border: none;
          width: 80px;
          height: 80px;
          .el-upload-list__item-status-label {
            display: none;
          }
        }
      }
      /deep/ .el-upload--picture-card {
        border: none;
        width: 80px;
        height: 80px;
        line-height: 80px;
        .el-upload {
          width: inherit;
          height: inherit;
          line-height: inherit;
          border-radius: 2px;
          background: var(--table-header-background-color);
          border: 1px solid var(--border-color-base);
        }
        .el-icon-plus {
          width: inherit;
          height: inherit;
          line-height: inherit;
        }
        .dg-upload--text {
          bottom: 30px;
        }
      }
    }
  }
}
.inline-button_group /deep/ {
  display: flex;
  margin-left: 8px;
  .dg-upload {
    .el-button {
      color: var(--color-primary);
      background: var(--dg-upload_button_background);
      border-color: var(--dg-upload_button_border);
      &:hover {
        background: var(--button-color-primary);
        border-color: var(--button-color-primary);
        color: var(--color-white);
      }
    }
    display: inline-block;
  }
  .el-button {
    margin-left: 8px;
  }
}
</style>
