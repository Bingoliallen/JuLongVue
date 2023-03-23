<template>
  <div class="conditions-popover-with-input">
    <el-input
      :placeholder="placeholder"
      v-model="searchGjz"
      clearable
      @keyup.enter.native="inputSearch(searchGjz)"
      @clear="inputSearch(searchGjz)"
    >
      <i slot="suffix" class="el-input__icon el-icon-search" @click="inputSearch(searchGjz)"></i>
    </el-input>
    <i v-if="showExport" class="iconfont iconl-export" title="导出数据" @click="$emit('export-data')"></i>
    <conditions-popover
      ref="popover"
      v-show="showPopover"
      :popover-key="popoverKey"
      :popover-items="popoverItems"
      :popover-ignore-key="popoverIgnoreKey"
      @search="search"
    ></conditions-popover>
  </div>
</template>

<script>
import ConditionsPopover from '@icccPath/components/conditions-popover';
export default {
  name: 'conditions-popover-with-input',
  components: { ConditionsPopover },
  props: {
    popoverKey: String,
    popoverItems: Array,
    showPopover: {
      type: Boolean,
      default: true
    },
    popoverIgnoreKey: {
      type: Set,
      default() {
        return new Set(['GJZ']);
      }
    },
    inputKey: {
      type: String,
      default: 'GJZ'
    },
    placeholder: {
      type: String,
      default: '请输入搜索条件'
    },
    // 是否显示导出按钮
    showExport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchGjz: ''
    };
  },
  methods: {
    inputSearch(searchGjz) {
      // 把外面输入框的值同步到里面
      const popover = this.$refs.popover;
      const item = popover.popItems.find(e => e.name === this.inputKey);
      this.$set(item, 'value', searchGjz);
      popover.search();
    },
    search(searchCondition) {
      if (searchCondition) {
        // 把里面输入框的值同步到外面
        const popover = this.$refs.popover;
        if (popover) {
          const item = popover.popItems.find(e => e.name === this.inputKey);
          this.searchGjz = (item && item.value) || '';
        }
      }
      this.$emit('search', searchCondition);
    }
  },
  created() {
    if (!this.showPopover) {
      this.$emit('search', []);
    }
  }
};
</script>

<style lang="scss" scoped>
.conditions-popover-with-input {
  display: flex;
  line-height: 1;
  align-items: center;

  .el-input {
    flex: 1;
  }

  /deep/ .iconfont {
    margin-left: 8px;
    color: var(--color-text-regular);
    cursor: pointer;

    &:hover,
    &.active {
      color: var(--color-primary);
    }
  }
}
</style>
