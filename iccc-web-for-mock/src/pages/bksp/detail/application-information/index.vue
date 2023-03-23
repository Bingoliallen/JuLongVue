<!--
 申请信息
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="apply-info-wrapper">
    <div class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="5rem">
        <el-form-item v-for="(item, index) in controls" :key="index" :label="item.title + '：'">
          <span v-if="item.code" v-code="{ code: item.code, value: info[item.key] }"></span>
          <span v-else>{{ info[item.key] }}</span>
        </el-form-item>
        <el-form-item label="处置要求：">
          <span>{{ info.czcsyq | filterText }}</span>
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
          <!-- <carousel
            class="left"
            :isChange="false"
            :idCard="data.SFZH"
            :isSuspend="true"
            isEnlarge="none"
            :isChangeNum="false"
            :imgStyleSuspend="imgStyleSuspend"
          >
            <template v-slot:suspend="{ imgSrc }">
              <div class="monitor-list-item__carousel">
                <div>
                  <img :src="imgSrc" width="140" height="140" alt="图1" />
                  <p>布控照片</p>
                </div>
                <div>
                  <img :src="imgSrc" width="140" height="140" alt="图2" />
                  <p>抓拍照片</p>
                </div>
              </div>
            </template>
          </carousel> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import HeadList from '@icccPath/components/head-list/index';
export default {
  name: 'application-information',
  // 接收父页面传过来的属性
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    HeadList
  },
  // 页面数据绑定
  data() {
    return {
      fileList: [],
      isEditFeat: false,
      photo: {
        title: '人脸照片：',
        urls: [{ cardid: '359001196910095830' }, { cardid: '220124196110274016' }, { cardid: '622924201008190135' }]
      },
      controls: [
        { key: 'bkyy', title: '布控事由', value: '就是要布控' },
        { key: 'bkdyfw', title: '布控范围', value: '北京、天津、河北、辽宁', code: 'BM_BKSQ_BKFW' },
        { key: 'bkjb', title: '布控级别', value: '三级（掌握轨迹）', code: 'BM_BKSQ_BKJB' },
        { key: 'sqdwmc', title: '布控单位', value: '福建省公安厅' },
        { key: 'bklb', title: '布控类别', value: '涉稳/两会', code: 'BM_BKSQ_BKLB' },
        { key: 'sqrxm', title: '申请人', value: '李警官' },
        { key: 'bkqx', title: '布控周期', value: '2020-06-11  至2020-06-18', code: 'BM_BKSQ_BKQX' }
      ],

      imgStyleSuspend: {
        width: '388px',
        height: '228px',
        background: '#fff',
        padding: '24px 32px',
        boxShadow: '0 2px 8px 0 var(--warning-trajectory_imgStyleSuspend_box-shadow)'
      }
    };
  },
  // 计算属性
  computed: {
    showFileList(){
      return JSON.parse(this.info.zfyjxx?this.info.zfyjxx:"[]")
    }
  },
  // 方法
  methods: {
    /*
     下载文件
      */
    loadDownFiled(file) {
      window.location.href = file.url;
    }
  },
  // 组件创建时调用
  created() {}
};
</script>
<style lang="scss" scoped>
.apply-info-wrapper {
  margin: 1.5rem 0rem;
}
/* 详情页 -- 高级
  -------------------------- */
.cv-detail-page {
  &__box {
    margin-bottom: 0px;
    &-tittle {
      margin-bottom: 0px;
    }

    &-row {
      padding: 0px 0 0px 10px;
      border-bottom: solid 1px var(--color-white);

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
      color: rgba(0, 0, 0, 0.65);
      /deep/ .el-form-item__label {
        padding: 0px;
      }
      /deep/ .el-form-item__content {
        color: rgba(0, 0, 0, 0.85);
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
