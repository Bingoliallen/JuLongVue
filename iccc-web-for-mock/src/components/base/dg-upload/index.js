/**
 * 文件上传，替换 JZ 组件
 * Creat by hcg on 2021-01-25
 */
import { Upload } from 'ui-component-v4';
const { getSetting } = window.systemParamsUtils;
import { fileDownLoad } from '@icccPath/api/common';

delete Upload.props.action;

export default {
  name: Upload.name,
  mixins: [Upload],
  props: {
    module: {
      type: String
    },
    // 上传的地址
    actionUrl: {
      type: String,
      default() {
        return `/api/file/upload`;
      }
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    headers: {
      type: Object,
      default() {
        let tokenObj = {};
        if (this.$store.getters.token) {
          tokenObj = { access_token: this.$store.getters.token };
        }
        return tokenObj;
      }
    },
    onSuccess: {
      type: Function,
      default: function(file, res) {
        res.id = file.id;
        res.url = file.url;
      },
      required: false
    },
    onExceed: {
      type: Function,
      default: function(files, fileList) {
        this.$message.warning(
          `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
            fileList.length} 个文件`
        );
      },
      required: false
    },
    resFunction: {
      type: Function,
      default: function(fileList) {
        return fileList; // .map(item => item.response);
      },
      required: false
    },
    'on-preview': {
      type: Function,
      default(file) {
        if (this.listType === 'viewer') {
          return;
        }
        const { name, url } = file;

        fileDownLoad({
          url: this.moduleUrl + url,
          fileName: name
        });
      }
    }
  },
  data() {
    return {
      moduleUrl: '',
      action: ''
    };
  },
  watch: {
    fileList(val) {
      return val;
    }
  },
  methods: {
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);

      if (file) {
        file.status = 'success';
        file.response = res;

        this.onSuccess(res, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      }
    }
  },
  created() {
    const moduleUrl = getSetting(this.module || 'BASE_API');
    this.moduleUrl = moduleUrl;
    this.action = moduleUrl + this.actionUrl;
  }
};
