<template>
  <el-form class="gjgl" label-width="7em" label-suffix="：">
    <el-form-item label="轨迹类型" prop="gjlx">
      <dg-tree-drop
        style="width: 100%;"
        v-model="model.gjlx"
        :module="module"
        code="VW_BM_YWXXLX"
        collapse-tags
        placeholder="请选择轨迹类型"
        :lazy-load="true"
        :tree-props="{
          isHighLight: true,
          nodeKey: 'value',
          showCheckbox: true
        }"
        :translate-data="translateData.gjlx"
        :props="props"
        multiple
        clearable
        filterable
      ></dg-tree-drop>
    </el-form-item>
    <el-form-item label="目的地" prop="mdd">
      <dg-tree-drop
        style="width: 100%;"
        v-model="model.mdd"
        :module="module"
        code="BM_BZ_XZQH"
        :lazy-load="true"
        collapse-tags
        :tree-props="treeOptions"
        placeholder="请选择目的地"
        :translate-data="translateData.mdd"
        :props="props"
        clearable
        filterable
        multiple
      ></dg-tree-drop>
    </el-form-item>
    <el-form-item label="活动地" prop="hdd">
      <dg-tree-drop
        style="width: 100%;"
        v-model="model.hdd"
        :module="module"
        :lazy-load="true"
        code="BM_BZ_XZQH"
        :tree-props="treeOptions"
        :translate-data="translateData.hdd"
        placeholder="请选择活动地"
        :props="props"
        collapse-tags
        clearable
        filterable
        multiple
      ></dg-tree-drop>
    </el-form-item>
  </el-form>
</template>

<script>
import { codeTranslate } from '@icccPath/api/common';
export default {
  name: 'gjgl',
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
      model: {},
      treeOptions: {
        // 展开联动、收缩不联动
        isToggleContact: false,
        // 高亮检索
        isHighLight: true,
        nodeKey: 'value',
        // lazy: true,
        showCheckbox: true
      },
      translateData: {
        hdd: [],
        mdd: [],
        gjlx: []
      },
      props: {
        value: 'value'
      }
    };
  },
  watch: {
    value: {
      handler: function() {
        this.init();
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    async init() {
      const value = this.value;
      const hdd = await codeTranslate('BM_BZ_XZQH', value.fsdqh);
      const mdd = await codeTranslate('BM_BZ_XZQH', value.mddqh);
      const gjlx = await codeTranslate('VW_BM_YWXXLX', value.dtxxlx);
      this.translateData = { hdd: hdd.data, mdd: mdd.data, gjlx: gjlx.data };
      this.model = {
        gjlx: ((value && value.gjlx) || []).join(','),
        mdd: ((value && value.mdd) || []).join(','),
        hdd: ((value && value.hdd) || []).join(',')
      };
    },
    getData() {
      return ['gjlx', 'mdd', 'hdd'].map(key => {
        const value = this.model[key];
        return { key, value: value ? value.split(',') : [] };
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
