<!--
 * @Author: Liugh
 * @Date: 2020-10-23 11:04:24
 * @LastEditTime: 2021-02-02 16:33:44
 * @LastEditors: Please set LastEditors
 * @Description: 申请信息
-->
<template>
  <div class="apply-info-wrapper">
    <div class="cv-detail-page__box">
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="5rem">
        <el-form-item v-for="(item, index) in infos" :key="index" :label="item.title + '：'">
          <span>{{ item.value }}</span>
        </el-form-item>
        <el-form-item label="执法依据：">
          <!-- <head-list :info="photo"></head-list> -->
          <el-upload
            action=""
            list-type="button"
            class="dg-upload-filed-hide-delicon"
            :on-preview="loadDownFiled"
            :file-list="showFileList"
          >
            <div v-if="info.zfyjxx && info.zfyjxx.length > 0" class="el-upload__tip">
              备注-点击以下附件名称可下载
            </div>

            <template slot="fileList" slot-scope="{ id, name }">
              <i class="el-icon-paperclip"></i>
              {{ `${name} ` }}
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import HeadList from '@icccPath/components/head-list/index';
export default {
  name: 'control-informaction', // 组件名称
  props: {
    // 接收父组件的数据
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      infos: [
        { title: '布控事由', value: '就是要布控' },
        { title: '布控级别', value: '三级（掌握轨迹）' },
        { title: '布控范围', value: '全国' },
        { title: '布控类别', value: '两会期间重点涉稳人员批量布控' },
        { title: '布控单位', value: '福建省公安厅' },
        { title: '布控周期', value: '2020-06-11  至2020-06-18' },
        { title: '申请人 ', value: '李警官' },
        { title: '处置要求', value: '就是要布控，就是要布控' }
      ],
      photo: {
        title: '执法依据：',
        urls: [{ cardid: '220124196110274016' }]
      }
    };
  },
  components: {
    HeadList
  },
  computed: {
    showFileList(){
      return JSON.parse(this.info.zfyjxx?this.info.zfyjxx:"[]")
    }
  },
  methods: {
    /*
     下载文件
      */
    loadDownFiled(file) {
      window.location.href = file.url;
    }
  },
};
</script>
<style lang="scss" scoped>
.apply-info-wrapper {
  margin: 1.5rem 0rem;
}
.cv-detail-page {
  &__box {
    margin-bottom: 0px;

    &-tittle {
      margin-bottom: 0px;
    }

    &-row {
      padding: 0px 0 0px 10px;
      border-bottom: solid 1px var(--control-informaction_cv-detail-page__box-row_border);

      .text-title {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    p {
      line-height: 16px;
    }

    .el-col {
      padding: 5px 0;
    }

    &-no {
      color: var(--color-danger);
    }
  }

  &__table {
    .el-form--inline .el-form-item {
      display: block;
      margin-bottom: 0;
    }

    .el-table__body td {
      background: transparent;
    }
  }
  &__form {
    .el-form-item {
      width: 50%;
      margin: 0px;
      padding: 0.17rem 0px;
      color: var(--color-text-secondary);
      /deep/ .el-form-item__label {
        padding: 0px;
      }
      /deep/ .el-form-item__content {
        color: var(--color-text-primary);
        width: 60%;
      }
    }
    &--photo {
      width: 100% !important;
      display: flex;
      /deep/ .el-form-item__label {
        flex: 0 0 5rem;
      }
      /deep/ .el-form-item__content {
        width: 100% !important;
      }
    }
  }
}
</style>
