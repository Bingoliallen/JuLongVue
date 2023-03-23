<template>
  <div class="apply-info-wrapper">
    <div class="cv-detail-page__box" v-if="isApply">
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" label-width="10rem">
        <el-row :span="24" v-for="(item, index) in controls" :key="'applyInfo' + index">
          <el-form-item :label="item.title + '：'">
            <span v-if="item.code" v-code="{ code: item.code, value: detail[item.key] }"></span>
            <span v-else-if="item.type === 'date'">{{ detail[item.key] | filterDate }}</span>
            <span v-else>{{ detail[item.key] | filterText }}</span>
          </el-form-item>
        </el-row>
        <el-row :span="24">
          <el-form-item label="申请依据：">
            <dg-upload
              v-if="Array.isArray(showFileList) && showFileList.length"
              ref="upload"
              disabled
              :on-preview="loadDownFiled"
              v-model="showFileList"
            >
              <div class="el-upload__tip">
                点击以下附件名称可下载
              </div>
              <template slot="fileList" slot-scope="{ name, size }">
                <i class="el-icon-paperclip"></i>
                {{ `${name} (${size / 1024})KB` }}
              </template>
            </dg-upload>
            <span v-else>-</span>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <no-record v-else></no-record>
  </div>
</template>

<script>
import NoRecord from '@icccPath/components/base/no-record';
import bksqApi from '@icccPath/api/qwbk';
import { BM_BKSQ_TKYY } from '@icccPath/common/constant';

export default {
  name: 'zdr-apply-info',
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    NoRecord
  },
  // 页面数据绑定
  data() {
    return {
      fileList: [],
      controls: [],
      detail: {
        sqms: '',
        sqsj: '',
        sqrxm: '',
        sqrlxfs: '',
        sqrsfzh: '',
        sqdwdm: '',
        sqdwmc: '',
        zfyjxx: '[]'
      }
    };
  },
  watch: {
    info: {
      handler(newVal) {
        this.init();
      },
      immediate: true
    }
  },
  computed: {
    // 是否提交过停控或撤销停控申请
    isApply() {
      return this.info.sqid + '' === '0' || this.info.sqid ? true : false;
    },
    showFileList() {
      const arr = this.detail.zfyjxx ? JSON.parse(this.detail.zfyjxx) : [];
      return arr;
    }
  },
  methods: {
    /*
     下载文件
      */
    loadDownFiled(file) {
      bksqApi.fileDownLoad({ fileName: file.name }, file.url).then(res => {});
    },
    init() {
      // 重置
      this.controls = [
        { key: 'sqms', title: '原因描述' },
        { key: 'sqsj', title: '申请时间', type: 'date' },
        { key: 'sqrxm', title: '申请人姓名' },
        { key: 'sqrlxfs', title: '申请人联系方式' },
        { key: 'sqrsfzh', title: '申请人身份证号' },
        { key: 'sqdwdm', title: '申请人公安机关代码' },
        { key: 'sqdwmc', title: '申请人公安机关名称', code: 'BM_DEPT' }
      ];
      // 没有提交过申请，不需要请求详情
      if (!this.isApply) return;
      if (this.info.tkzt === '1') {
        // 撤销停控的不需要展示停控原因
        this.controls.unshift({ key: 'bkyy', title: '停控原因', code: BM_BKSQ_TKYY });
      }
      this.getDetail();
    },
    getDetail() {
      this.detail = {
        sqms: '',
        sqsj: '',
        sqrxm: '',
        sqrlxfs: '',
        sqrsfzh: '',
        sqdwdm: '',
        sqdwmc: '',
        zfyjxx: '[]'
      };
      bksqApi.getSqxx(this.info.sqid).then(res => {
        this.detail = res.data;
      });
    }
  }
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
    .el-upload__tip {
      margin-left: 0.8rem;
    }
  }
}
</style>
