<template>
  <dg-scrollbar class="monitor-plcz monitor-yddfz">
    <div class="title-1">新建分组</div>
    <div class="monitor-plcz_content">
      <el-form ref="form" :model="{ fzmc }" label-width="7em">
        <dg-form-item label="分组名称：" prop="fzmc" :rules="[{ required: true, validator: verify }]">
          <el-input
            v-trim
            class="monitor-yddfz_input"
            ref="add"
            v-model="fzmc"
            @blur="validateField(() => {})"
            placeholder="请输入分组名称，不超过20个字符"
            @input="changeFzmc"
            maxlength="20"
          ></el-input>
        </dg-form-item>
      </el-form>
      <p v-if="!isShowInfo" class="overview">
        移动对象共
        <em class="fznum">{{ changeNum(value) }}</em>
        个
      </p>
      <p v-if="isShowInfo" class="overview">
        至少选择一个对象
      </p>
      <div class="monitor-plcz_list">
        <monitor-obj-card
          v-for="(node, index) in value"
          :key="node.key + '-' + index"
          class="monitor-plcz_item"
          :node="node"
          :is-del="true"
          :class="{ active: node.showPopper }"
          :use-popper="true"
          @showPopperChange="showPopperChange"
          @del="delNode(node)"
        ></monitor-obj-card>
      </div>
      <div class="monitor-plcz_btn">
        <el-button type="primary" class="submitBtn" :disabled="btnDisabled" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import MonitorObjCard from './monitor-obj-card';
import { confirm } from '@icccPath/utils/tool';
import { qzdxUpdate } from './../request';

export default {
  name: 'monitor-xjfz',
  components: { MonitorObjCard },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    value: 'changeValue'
  },
  computed: {},
  data() {
    return {
      isShowInfo: true,
      btnDisabled: true,
      fzmc: '',
      orignalFzmc: ''
    };
  },
  methods: {
    changeValue() {
      if (this.value.length === 0) {
        this.isShowInfo = true;
        this.btnDisabled = true;
      } else {
        this.isShowInfo = false;
        this.changeFzmc();
      }
    },
    changeFzmc() {
      this.btnDisabled = !(this.fzmc !== '' && this.value.length !== 0);
    },
    validateField(cb) {
      return this.$refs.form.validateField(['fzmc'], cb);
    },
    verify(o, value, callback) {
      if (this.fzmc) {
        callback();
        return;
      }
      callback(new Error('请输入分组名称！'));
    },
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
    async submit() {
      const isValid = await this.$refs.form.validate();
      if (!isValid) {
        return;
      }

      await qzdxUpdate({
        // 群组名称
        qzmc: this.fzmc,
        // 新增的成员的bkdxh
        addbkdxbhs: this.value.map(e => e.data.bkdxbh).join(',')
      });
      setTimeout(() => {
        // 应后端要求，延迟1秒再返回
        this.$message.success('保存成功！');
        this.back(true);
      }, 1000);
    },
    cancel() {
      confirm('是否返回？').then(this.back);
    },
    back(flag) {
      this.$emit('cancel', flag, 'is-edit');
      this.value.forEach(node => {
        this.$set(node, 'hide', false);
        this.$set(node, 'showPopper', false);
      });
      this.$emit('input', []);
    },
    changeNum(value) {
      this.$emit('changeNum', value.length);
      return value.length;
    }
  },

  created() {
    this.changeValue();
  }
};
</script>

<style lang="scss">
@import './monitor-plcz';
.monitor-yddfz {
  &_input,
  .dg-select {
    width: 320px;
    & + .dg-button {
      margin-left: 8px;
    }
  }
}
.fznum {
  color: var(--color-warning);
}
.submitBtn:disabled {
  background-color: rgb(214, 211, 211);
  color: #ffffff;
  border: none;
}
.submitBtn:disabled:hover {
  background-color: rgb(214, 211, 211);
  color: #ffffff;
  border: none;
}
</style>
