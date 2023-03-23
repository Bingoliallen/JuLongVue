<template>
  <dg-scrollbar class="monitor-plcz monitor-yddfz">
    <div class="title-1">移动到分组</div>
    <div class="monitor-plcz_content">
      <el-form ref="form" :model="{ yddfz }" label-width="7em">
        <dg-form-item label="分组名称：" prop="yddfz" :rules="[{ required: true, validator: verify }]">
          <template v-if="addFzVisible">
            <el-input
              v-trim
              class="monitor-yddfz_input"
              ref="add"
              placeholder="请输入分组名称，不超过20个字符"
              clearable
              maxlength="20"
              v-model="fzmc"
              @blur="validateField(() => {})"
            ></el-input>
            <dg-button type="primary" @click="addFz">确定</dg-button>
            <dg-button @click="hideAddFz">取消</dg-button>
          </template>
          <template v-else>
            <dg-select v-model="yddfz" placeholder="请选择要移动的分组" :data="fzList" @change="changeFzMc"></dg-select>
            <dg-button @click="showAddFz" type="text">新建分组</dg-button>
          </template>
        </dg-form-item>
      </el-form>
      <div class="title-2">对象列表</div>
      <p class="overview">
        已选择对象共
        <em class="bkdx">{{ changeNum(value) }}</em>
        个
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
        <el-button type="primary" @click="submit">确定移动</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import MonitorObjCard from './monitor-obj-card';
import { confirm } from '@icccPath/utils/tool';
import { qzxxList, addFz, qzdxUpdate } from './../request';

export default {
  name: 'monitor-yddfz',
  components: { MonitorObjCard },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      yddfz: '',
      fzList: [],
      addFzVisible: false,
      fzmc: ''
    };
  },
  methods: {
    async init() {
      const res = await qzxxList();
      this.fzList = (res.data.content || []).map(({ qzid, qzmc }) => ({ label: qzmc, value: qzid }));
    },
    showAddFz() {
      this.addFzVisible = true;
      this.$nextTick(() => {
        this.$refs.add.focus();
      });
    },
    hideAddFz() {
      this.addFzVisible = false;
      this.$refs.form.clearValidate(['yddfz']);
    },
    addFz() {
      this.validateField(e => {
        if (!e) {
          const data = { id: this.$tool.generateKey(), qzmc: this.fzmc };
          addFz(data).then(res => {
            const id = res.data;
            this.fzList.unshift({ label: data.qzmc, value: id });
            this.yddfz = id;
            this.hideAddFz();
          });
        }
      });
    },
    changeFzMc(val, { label, value }) {
      this.yddfz = value;
      this.fzmc = label;
    },
    validateField(cb) {
      return this.$refs.form.validateField(['yddfz'], cb);
    },
    verify(o, value, callback) {
      const status = this.addFzVisible;
      value = status ? this.fzmc : this.yddfz;
      if (value) {
        callback();
        return;
      }
      callback(new Error(status ? '请输入分组名称！' : '请选择要移动到的分组！'));
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
    submit() {
      this.$refs.form.validate(async () => {
        if (!this.yddfz) {
          this.$message.error('请选择要移动到的分组！');
          return;
        }
        if (this.value.length <= 0) {
          this.$message.error('请选择要移动的对象！');
          return;
        }

        await qzdxUpdate({
          // 群组id(有修改，无新增)
          qzid: this.yddfz || undefined,
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
      });
    },
    cancel() {
      confirm('暂未保存变更，是否进行保存？')
        .then(this.submit)
        .catch(() => {
          this.back(false);
        });
    },
    back(flag) {
      this.value.forEach(node => {
        this.$set(node, 'hide', false);
        this.$set(node, 'showPopper', false);
      });
      this.$emit('cancel', flag, '');
      this.$emit('input', []);
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
</style>
