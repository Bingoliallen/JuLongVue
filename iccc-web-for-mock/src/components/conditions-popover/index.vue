<template>
  <el-popover
    class="conditions-popover"
    placement="right-start"
    popper-class="popper-form"
    width="925"
    :visible-arrow="false"
    trigger="click"
    v-model="popoverVisible"
  >
    <slot name="popover" :search="search" :resetForm="resetForm" :popoverVisible="popoverVisible">
      <el-form :model="formModel" ref="form" class="qwbk-layout__form" label-suffix="：" label-width="7em">
        <el-form-item v-for="item in popItems" :key="item.name" :label="item.label">
          <component ref="com" v-bind="item.bind" :is="item.bind.is" v-model="item.value"></component>
        </el-form-item>
        <div class="qwbk-layout__form-btn">
          <dg-button type="primary" @click="search()">查询</dg-button>
          <dg-button @click="resetForm">清空</dg-button>
          <dg-button @click="popoverVisible = false">关闭</dg-button>
        </div>
      </el-form>
    </slot>
    <dg-badge slot="reference" :class="{ active: popoverVisible }" :is-dot="isDot">
      <i class="iconfont iconl-filter" title="筛选"></i>
    </dg-badge>
  </el-popover>
</template>

<script>
import * as constant from '@icccPath/common/constant';
import { deepClone } from '@icccPath/utils/tool';

export default {
  name: 'conditions-popover',
  props: {
    popoverKey: String,
    popoverItems: Array,
    popoverIgnoreKey: {
      type: Set,
      default() {
        return new Set(['GJZ']);
      }
    }
  },
  data() {
    return {
      popItems: [],
      formModel: {},
      // 条件已选
      isDot: false,
      // 条件是否显示
      popoverVisible: false
    };
  },
  watch: {
    popoverKey: {
      handler(val) {
        this.getPopItems(val);
      },
      immediate: true
    },
    popoverItems: {
      handler(val) {
        val && this.getPopItems(this.popoverKey, val);
      },
      immediate: true
    }
  },
  methods: {
    async getPopItems(key, items) {
      if (key) {
        items = constant[key];
      }
      if (items) {
        this.popItems = deepClone(items);
        this.$nextTick(() => {
          const getDefaultValue = (resolve, ref) => {
            // 日期时间组件的默认值
            if (ref.checkValue && !ref.value) {
              setTimeout(() => {
                getDefaultValue(resolve, ref);
              }, 10);
              return;
            }
            resolve();
          };
          const refs = this.$refs.com;
          Promise.all(
            refs.map(ref => {
              return new Promise(resolve => {
                getDefaultValue(resolve, ref);
              });
            })
          ).then(this.search);
        });
        return;
      }
      throw new Error(`找不到条件配置项，'popoverKey' 和 'popoverItems' 必须配置其一！`);
    },
    search() {
      const searchCondition = [];
      let isNotDot = true;
      this.popItems.forEach(item => {
        if (item.value) {
          // 添加有值的条件
          searchCondition.push({ ...item });
          // 判断条件是否已选（跳过被忽略的key）
          if (isNotDot && !this.popoverIgnoreKey.has(item.name)) {
            isNotDot = false;
          }
        }
      });
      this.isDot = !isNotDot;
      this.$emit('search', searchCondition);
      this.popoverVisible = false;
    },
    resetForm() {
      this.popItems.forEach(item => {
        this.$set(item, 'value', '');
      });
    }
  }
};
</script>

<style lang="scss">
.popper-form {
  z-index: 10 !important;
  .dg-date-picker__short-btn {
    .el-date-editor--datetimerange,
    .el-date-editor--daterange {
      width: 0;
      flex: 1;
    }
  }
  .dg-tree-select {
    width: 100% !important;
  }
}
</style>
