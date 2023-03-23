<template>
  <dg-scrollbar class="monitor-plcz">
    <div class="title-1">撤控申请</div>
    <div class="monitor-plcz_content">
      <el-form ref="form" :model="{ ckyy }" label-width="7em">
        <dg-form-item label="撤控原因：" prop="ckyy" :rules="[{ required: true, message: '撤控原因不能为空！' }]">
          <el-input type="textarea" v-model="ckyy" :row="3" placeholder="请输入撤控原因"></el-input>
        </dg-form-item>
      </el-form>
      <div class="title-2">对象列表</div>
      <p class="overview">
        撤控对象共<em class="bkdx">{{ changeNum(value) }}</em
        >个
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
        <el-button type="primary" @click="submit">提交撤控</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import MonitorObjCard from './monitor-obj-card';
import { longTime2Str } from '@icccPath/filters';
import { confirm } from '@icccPath/utils/tool';
import { addXkOrCk } from './../request';

export default {
  name: 'monitor-ck',
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
      ckyy: ''
    };
  },
  methods: {
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
      if (this.value.length <= 0) {
        this.$message.error('请选择要撤控的对象！');
        return;
      }
      await addXkOrCk({
        // 申请原因
        sqyy: this.ckyy,
        // 布控类型-BM_BKSQ_BKLX(11:布控,12:撤控,13:续控)
        sqlx: '12',
        // 续控开始日期(yyyyMMdd)
        xkksrq: '',
        // 续控结束日期(yyyyMMdd)
        xkjsrq: '',
        // 布控对象编号(多个用逗号隔开)
        bkdxbhs: this.value.map(e => e.data.bkdxbh).join(','),
        sqmc: '任务单名称' + longTime2Str(new Date(), 'yyyyMMddHHmmss')
      });
      this.$message.success('撤控申请提交成功！');
      this.back(true);
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
    changeNum(value){
      this.$emit('changeNum',value.length);
      return value.length;
    }
  }
};
</script>

<style lang="scss">
@import './monitor-plcz';
</style>
