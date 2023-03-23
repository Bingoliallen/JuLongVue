<template>
  <dg-scrollbar class="monitor-plcz" v-loading.lock="isLoading">
    <div class="title-1">{{ controlText }}停控申请</div>
    <div class="monitor-plcz_content">
      <el-form ref="form" :model="form" :label-width="labelWidth">
        <dg-form-item
          v-if="controlType === 'xztksq'"
          label="停控原因："
          prop="bkyy"
          :rules="[{ required: true, message: '停控原因不能为空！' }]"
        >
          <dg-select
            v-model="form.bkyy"
            :code="BM_BKSQ_TKYY"
            @change="(...defaultArgs) => onSelectChange(...defaultArgs)"
            clearable
            placeholder="请选择停控原因"
          ></dg-select>
        </dg-form-item>
        <dg-form-item
          :label="sqmsLabel + '：'"
          prop="sqms"
          :rules="[{ required: true, message: `${sqmsLabel}不能为空！` }]"
        >
          <el-input
            type="textarea"
            v-model="form.sqms"
            :placeholder="'请输入' + sqmsLabel"
            maxlength="500"
            show-word-limit
          ></el-input>
        </dg-form-item>
        <dg-form-item label="申请依据：" prop="zfyjxx">
          <dg-upload
            ref="upload"
            list-type="button"
            module="QZ_BKSQ"
            size="10m"
            tip-msg="上传文件大小限制为10M"
            multiple
            :show-file-list="true"
            :on-success="handleGetSuccess"
            v-model="fileList"
            :class="{ borderHide: fileList.length }"
          >
          </dg-upload>
        </dg-form-item>
      </el-form>
      <div class="title-2">对象列表</div>
      <p class="overview">
        {{ controlText }}停控对象共 <em class="bkdx">{{ changeNum(value) }}</em
        >个
      </p>
      <div class="monitor-plcz_list">
        <monitor-obj-card
          v-for="(node, index) in value"
          :key="node.key + '-' + index"
          class="monitor-plcz_item"
          :node="node"
          :is-del="true"
          :class="{ active: activeCard === index }"
          :use-popper="false"
          @click.native="onCardClick(index)"
          @showPopperChange="showPopperChange"
          @del="delNode(node)"
        ></monitor-obj-card>
      </div>
      <div class="monitor-plcz_btn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import MonitorObjCard from '@icccPath/pages/qwbk/components/monitor-obj-card';
import QsCyclePick from '@icccPath/components/qs-cycle-pick';
import { longTime2Str } from '@icccPath/filters';
import { confirm } from '@icccPath/utils/tool';
import bksqApi from '@icccPath/api/qwbk';
import { BM_BKSQ_TKYY } from '@icccPath/common/constant';

export default {
  name: 'stop-control',
  components: { MonitorObjCard, QsCyclePick },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 停控or撤销停控
    controlType: {
      type: String,
      default: 'xztksq'
    }
  },
  data() {
    return {
      BM_BKSQ_TKYY,
      activeCard: '',
      isLoading: false,
      labelWidth: '7em',
      controlText: '新增',
      sqmsLabel: '原因描述',
      fileList: [],
      form: {
        bkyy: '',
        sqms: ''
      }
    };
  },
  computed: {},
  methods: {
    init() {
      // 撤销停控，修改名称
      if (this.controlType === 'cxtksq') {
        this.labelWidth = '9em';
        this.controlText = '撤销';
        this.sqmsLabel = '撤销停控原因';
      }
    },
    /**
     * @description:附件上传成功事件
     */
    handleGetSuccess(res, file, fileList) {},
    showPopperChange(node) {
      const item = this.value.find(e => e.showPopper && e !== node);
      item && this.$set(item, 'showPopper', false);
    },
    delNode(node) {
      this.$set(node, 'hide', false);
      this.$set(node, 'showPopper', false);
      const list = this.value;
      list.splice(list.indexOf(node), 1);
      this.$emit('input', list);
      this.$emit('del', node);
    },
    async onSubmit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }

      if (this.value.length <= 0) {
        this.$message.error(`请选择要${this.controlText}停控的对象！`);
        return;
      }

      const files = JSON.stringify(
        this.fileList.map(file => {
          return file.response;
        })
      );
      const params = {
        bkyy: this.form.bkyy,
        sqms: this.form.sqms,
        zfyjxx: files,
        bksxList: this.value.map(e => {
          const obj = {
            bkdxhm: e.data.sfzh
          };
          return obj;
        })
      };
      // 申请成后的回调
      const onApplyCallback = () => {
        this.$message.success(`${this.controlText}停控申请提交成功！`);
        this.isLoading = false;
        this.back(true);
      };

      this.isLoading = true;
      // 申请停控
      if (this.controlType === 'xztksq') {
        bksqApi
          .addStopControl(params)
          .then(() => {
            onApplyCallback();
          })
          .catch(() => {
            this.isLoading = false;
          });
      } else {
        // 撤销停控
        bksqApi
          .cancelStopControl(params)
          .then(() => {
            onApplyCallback();
          })
          .catch(() => {
            this.isLoading = false;
          });
      }
    },
    cancel() {
      confirm('是否返回？').then(this.back);
    },
    back(flag) {
      this.$emit('cancel', flag);
      this.value.forEach(node => {
        this.$set(node, 'hide', false);
        this.$set(node, 'showPopper', false);
      });
      this.$emit('input', []);
    },
    // 点击人员卡片
    onCardClick(index) {
      this.activeCard = index;
    },
    onSelectChange(val, obj) {
      this.form.sqms = obj.label;
    },
    changeNum(value) {
      this.$emit('changeNum', value.length);
      return value.length;
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss">
@import '../../qwbk/components/monitor-plcz';
.borderHide {
  /deep/ .el-upload-list {
    padding: 5px 25px 15px;
    margin-top: 15px;
    border: 1px solid var(--border-color-base);
  }
}
</style>
