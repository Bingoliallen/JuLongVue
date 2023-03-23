<template>
  <el-tabs v-model="tabActive" class="warning-rule-layer-content" type="card">
    <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name" :label="item.label" :lazy="true">
      <component :ref="item.name" :is="item.name" :value="value" :module="module"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Gjgl from './gjgl';
import Qyfk from './qyfk';

export default {
  name: 'warning-rule-layer-content',
  components: { Gjgl, Qyfk },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    module: String
  },
  data() {
    return {
      tabActive: 'gjgl',
      tabs: [
        { label: '轨迹过滤', name: 'gjgl' },
        { label: '区域防控', name: 'qyfk' }
      ]
    };
  },
  methods: {
    getData() {
      const obj = { ...this.value };
      const $refs = this.$refs;
      this.tabs.forEach(({ name }) => {
        let com = $refs[name];
        // 已加载的 tab ，更新一下数据
        // 没有加载过的 tab 获取不到数据，保留上一次的
        if (com) {
          com = com.getData ? com : com[0];
          com.getData().forEach(({ key, value }) => {
            obj[key] = value;
          });
        }
      });
      return obj;
    }
  }
};
</script>

<style lang="scss" scoped>
.warning-rule-layer-content {
  padding: 1.5rem 1.5rem 0;
}
</style>
<style lang="scss">
.layer-flex {
  display: flex;
  flex-direction: column;
  .layui-layer-content {
    flex: 1;
    height: 0;
    padding: 0;
  }
  .layui-layer-btn {
    padding: 1rem 0;
  }
}
</style>
