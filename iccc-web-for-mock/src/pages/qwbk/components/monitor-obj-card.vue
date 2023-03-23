<template>
  <div class="monitor-obj-card" :style="{ 'margin-bottom': node.showPopper ? 'calc(16rem + 12px)' : '0' }">
    <div class="iccc-card-item" @click="cardClick" :class="{ checked: node.checked }">
      <div class="iccc-card-item_img">
        <el-checkbox v-if="!isDel" v-model="node.checked" @click.native.stop></el-checkbox>
        <img src="" alt="" v-avatar="{ type: data.hmlx, id: data.hmnr, module: 'QZ_BKSQ' }" />
      </div>
      <div class="iccc-card-item_content">
        <div class="iccc-card-item_row">
          <template v-if="data.hmlx === 'RLZP'">人像照片</template>
          <span v-else>{{ data.hmnr }}&nbsp;{{ data.xm || '' }}</span>
        </div>
        <div class="iccc-card-item_row">
          <span>{{ data.bksj | filterDate }}</span>
        </div>
      </div>
      <div
        class="iccc-card-item_btn is-plain"
        :class="isDel ? 'el-button--danger' : 'el-button--primary'"
        @click.stop="iconClick"
      >
        <i class="iconfont" :class="isDel ? 'iconl-minus' : 'iconl-plus'"></i>
      </div>
    </div>
    <el-collapse-transition>
      <div class="diy-popover_warp" v-if="node.showPopper" :style="popStyle">
        <control-object-popover-content
          v-loading="popLoading"
          class="diy-popover_content"
          :item="popData"
        ></control-object-popover-content>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import ControlObjectPopoverContent from '@icccPath/components/scenes-bkdx/modules/control-object-popover-content';
import { getBkdxsx } from './../request';
import { addResizeListener, removeResizeListener } from 'ui-component-v4/src/utils/resize-event';

export default {
  name: 'monitor-obj-card',
  components: { ControlObjectPopoverContent, ElCollapseTransition },
  props: {
    node: Object,
    isDel: Boolean,
    usePopper: Boolean
  },
  data() {
    return {
      popData: {},
      popLoading: false,
      popStyle: {}
    };
  },
  computed: {
    data() {
      return this.node.data;
    }
  },
  methods: {
    async showPopover() {
      this.resetPopStyle();
      this.popLoading = true;
      const res = await getBkdxsx(this.data.bkdxbh);
      this.popLoading = false;
      this.popData = {
        bkdxlx: this.data.hmlx,
        bkdxhm: this.data.hmnr,
        bkdxsx: res.data || []
      };
    },
    cardClick() {
      if (this.usePopper) {
        this.$set(this.node, 'showPopper', !this.node.showPopper);
        this.$emit('showPopperChange', this.node);
        if (this.node.showPopper) {
          this.showPopover();
        }
        return;
      }
      if (this.isDel) {
        return;
      }
      this.$set(this.node, 'checked', !this.node.checked);
    },
    iconClick() {
      this.$emit(this.isDel ? 'del' : 'add', this.node);
    },
    resetPopStyle() {
      const el = this.$el;
      const parentNode = el.parentNode;
      if (!parentNode) {
        return;
      }
      const elRect = el.getBoundingClientRect();
      const pRect = parentNode.getBoundingClientRect();
      this.popStyle = {
        left: pRect.left - elRect.left + 'px',
        right: elRect.right - pRect.right + 'px'
      };
    },
    resize() {
      if (this.node.showPopper) {
        // POP显示时重新计算一下样式
        this.$nextTick(this.resetPopStyle);
      }
    }
  },
  mounted() {
    addResizeListener(this.$el, this.resize);
    if (this.node.showPopper) {
      this.showPopover();
    }
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.resize);
  }
};
</script>

<style lang="scss" scoped>
.monitor-obj-card {
  padding: 0.75rem 1.5rem;
  transition: all 0.5s ease;
  position: relative;
  .diy-popover {
    &_warp {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 1;
      margin-top: 12px;
      border: 1px solid var(--border-color-base);
      background: var(--background-color);
    }
    &_content {
      height: 16rem;
      overflow: auto;
      background: var(--control-object-popovere-content_popover_background);
    }
  }
}
.iccc-card-item {
  padding: 0;
  cursor: pointer;
  border: var(--border);
  &:hover {
    background-color: transparent;
    border-color: var(--color-primary);
  }
  &:active {
    background: var(--background-color-weak2);
    border-color: var(--color-primary);
  }
  &.checked {
    border-color: var(--color-primary);
  }
  &_img {
    position: relative;
    border-width: 0;
    border-right-width: 1px;
  }
  &_btn {
    text-align: center;
    width: 3em;
    height: 4.75rem;
    line-height: 4.75rem;
    border-left: var(--border);
    &:not(:hover) {
      background: transparent;
      color: var(--color-text-regular);
    }
  }
  .el-checkbox {
    position: absolute;
    background: var(--background-color);
    line-height: 1;
    top: 0.25rem;
    left: 0.25rem;
    height: 14px;
    width: 14px;
  }
}
</style>
