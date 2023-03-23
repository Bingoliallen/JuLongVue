<!--
 * @Author: Liugh
 * @Date: 2020-10-13 16:19:20
 * @LastEditTime: 2021-01-27 16:42:42
 * @LastEditors: Do not edit
 * @Description: 批量导入对象
-->
<template>
  <div class="bulkImport">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="是否自动获取关联属性并布控：" label-width="220px" prop="radio">
        <dg-radio-group v-model="form.radio" :data="radioList" size="small" call-off></dg-radio-group>
      </el-form-item>
      <el-form-item label="上传附件：" prop="fileList">
        <dg-upload
          ref="upload"
          list-type="button"
          module="QZ_BKSQ"
          multiple
          :show-file-list="true"
          :on-success="handleGetSuccess"
          v-model="fileList"
          :class="{ borderHide: fileList.length }"
        >
        </dg-upload>
        <!-- <ul class="bulkImport-upload__ul">
            <li v-for="(item, index) in fileList" :key="index">
              <i :class="`dg-icon-${item.type}`"></i>
              {{ `${item.name} (${item.size / 1024})KB` }}
            </li>
          </ul> -->
        <div class="bulkImport-upload" v-if="fileList.length">
          <div class="bulkImport-upload__tip">
            <!-- <span
              >共导入对象<span class="object">123</span>个，其中成功<span class="success">123</span>个，失败<span
                class="error"
                >123</span
              >个</span
            >
            <span><a href="#">下载导入失败的对象</a></span> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="">
        <div class="button">
          <el-button type="text" @click="handleDownloadTemplate">下载导入模版</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sqdxApi from '@icccPath/api/sqdx/index.js';
import { mapGetters } from 'vuex';
export default {
  name: 'bulkImport', // 组件名称
  props: {
    // 接收父组件的数据
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      rules: {},
      form: { radio: 1 },
      fileList: [],
      radioList: [
        { label: '关联', value: 1 },
        { label: '不关联', value: 0 }
      ]
    };
  },
  computed: { ...mapGetters(['provisionalId']) },
  methods: {
    /**
     * 下载导入模板
     */
    handleDownloadTemplate() {
      sqdxApi.downloadTemp().then(res => {
        // var blob = new Blob([res.data], { type: res.headers['content-type'] });
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(res); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '对象批量导入模版.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    /**
     * @description:附件上传成功事件
     */
    handleGetSuccess(res, file, fileList) {
      console.log(this.fileList);
      // this.importSave();
    },
    importSave(callback) {
      // let loading = this.$loading({ text: '拼命导入中……' });
      let filelist = this.fileList.map(item => {
        return item.response.id;
      });
      if (filelist.length === 0) {
        this.$message.error('请上传附件！');
        return;
      }
      sqdxApi
        .importSqdx({
          sqid: this.provisionalId,
          fileId: Array.isArray(filelist) ? filelist.join(',') : filelist,
          sfgl: this.form.radio
        })
        .then(res => {
          callback();
        });
    }
  } // 内部方法
};
</script>
<style lang="scss" scoped>
.bulkImport {
  /deep/ .el-upload {
    .el-button {
      background: var(--background-color-primary);
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      border-radius: 2px;
    }
  }
  .borderHide {
    /deep/ .el-upload-list {
      padding: 0 25px;
      margin-top: 15px;
      border: 1px solid var(--border-color-base);
      border-bottom: none;
    }
  }
  .bulkImport-upload {
    &__ul {
      list-style: none;
      li {
        list-style: none;
        margin-bottom: 10px;
      }
    }
    &__tip {
      padding: 10px 25px 5px 25px;
      background: var(--table-header-background-color);
      border: 1px solid var(--border-color-base);
      border-top: none;
      .object {
        color: var(--color-primary);
      }
      .success {
        color: var(--color-success);
      }
      .error {
        color: var(--color-danger);
      }
    }
  }
}
</style>
