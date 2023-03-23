<template>
  <span :class="['qs-tooltip flex-ellipsis', center ? 'center' : '']">
    <el-tooltip
      class="flex-text"
      ref="tooltip"
      placement="top"
      v-bind="$props"
      v-on="$listeners"
      :disabled="disabledTooltip"
    >
      <template v-for="name in slots" v-slot:[name]>
        <slot :name="name"></slot>
      </template>
    </el-tooltip>
    <slot name="append"></slot>
  </span>
</template>

<script>
import { Tooltip } from 'element-ui';
export default {
  name: 'qs-tooltip',
  mixins: [{ props: Tooltip.props }],
  props: {
    // 自动禁用tooltip，设置为true则只有文本超出时可显示tooltip，文本不超出不显示
    // 启用自动禁用，会计算文本是否超出，并且disabled配置无效
    autoDisabled: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabledTooltip: this.disabled
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$slots);
    }
  },
  watch: {
    content: {
      handler(newVal) {
        this.setTooltipDisabled(newVal);
      },
      immediate: true
    }
  },
  methods: {
    setTooltipDisabled(content) {
      if (!content) {
        this.disabledTooltip = true;
        return;
      }
      if (this.autoDisabled) {
        // 启用自动禁用，计算文本是否超出
        this.$nextTick(() => {
          this.disabledTooltip = !this.getIsOverflowOut();
        });
      } else {
        this.disabledTooltip = this.disabled;
      }
    },
    // 判断是否超出
    getIsOverflowOut() {
      const tooltip = this.$refs.tooltip.$el;
      // tooltip 宽度
      let maxWidth = tooltip.getBoundingClientRect().width;
      let maxHeight = tooltip.getBoundingClientRect().height;
      [...tooltip.children].forEach(ele => {
        maxWidth -= ele.getBoundingClientRect().width;
        maxHeight -= ele.getBoundingClientRect().height;
      });
      return maxWidth < 0 || maxHeight < 0;
    }
  }
};
</script>

<style lang="scss" scoped>
// 超出隐藏，但是最后面显示图标
.flex-ellipsis {
  display: flex;
  align-items: center;
  .flex-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      position: relative;
    }
  }
  .flex-nowrap {
    white-space: nowrap;
  }
  .flex-icon {
    margin-left: 0.5em;
    color: var(--color-primary);
    cursor: pointer;
  }
}
.flex-ellipsis.center {
  justify-content: center;
}
</style>
