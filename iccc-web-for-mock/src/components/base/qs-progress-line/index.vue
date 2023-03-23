<template>
  <el-timeline class="qs-progress-line">
    <el-timeline-item
      v-for="(item, index) in list"
      :key="index"
      placement="top"
      :class="{ active: item.active }"
      @click.native="lineItemClick(item)"
    >
      <template v-slot:dot>
        <span class="qs-progress-line__dot">{{ index + 1 }}</span>
      </template>
      <div class="qs-progress-line__top">
        <slot name="top" :data="item" :index="index">
          <span>{{ item.label }}</span>
        </slot>
        <i
          class="el-icon-arrow-down"
          v-if="showExpend"
          :class="{ shrink: item.shrink }"
          @click.stop="expendChange(index, item)"
        ></i>
      </div>
      <el-collapse-transition>
        <div class="qs-progress-line__content" v-show="!item.shrink">
          <slot :data="item" :index="index"></slot>
        </div>
      </el-collapse-transition>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
export default {
  name: 'qs-progress-line',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    // 被选中项索引值
    value: {
      type: Number,
      default: 0
    },
    // 显示展开按钮
    showExpend: Boolean,
    // 默认展开
    defaultExpend: {
      type: Boolean,
      default: true
    },
    // 数据过滤
    filterItem: Function
  },
  watch: {
    data: {
      handler(val) {
        if (val && val.length) {
          if (!this.defaultExpend) {
            val.forEach(item => {
              this.$set(item, 'shrink', true);
            });
          }
        }
      },
      immediate: true
    },
    value: {
      handler(val) {
        if (val !== undefined && this.data.length > 0) {
          this.activeChange(val);
        }
      },
      immediate: true
    }
  },
  computed: {
    list() {
      return this.filterItem ? this.filterItem(this.data) : this.data;
    }
  },
  methods: {
    lineItemClick(data) {
      const index = this.data.indexOf(data);
      this.$emit('change', index, data);
      this.$emit('input', index);
    },
    activeChange(index) {
      const item = this.data[index];
      this.$set(item, 'shrink', false);
      if (item.active) {
        return;
      }
      this.data.forEach(e => {
        this.$set(e, 'active', false);
      });
      this.$set(item, 'active', true);
    },
    expendChange(index, item) {
      if (!item) {
        item = this.data[index];
      }
      const shrink = !item.shrink;
      this.$set(item, 'shrink', shrink);
    }
  }
};
</script>

<style lang="scss">
$colorActive: var(--color-primary);
.qs-progress-line {
  &__dot {
    border-radius: 50%;
    border: 2px solid #d9d9d9;
    background: #fff;
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 16px;
    font-size: 10px;
    color: var(--color-text-regular);
  }
  &__top {
    position: relative;
    margin-bottom: 8px;
    padding-top: 4px;
    color: var(--color-text-regular);
    font-size: inherit;
    line-height: 1.5;
    .el-icon-arrow-down {
      position: absolute;
      right: 0;
      top: 8px;
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  &__content {
    padding: 8px 0 8px 8px;
    margin: -8px 0 -8px -14px;
  }
  .el-timeline-item {
    cursor: pointer;
    &__tail {
      left: 9px;
      border-left-width: 1px;
    }
    &__timestamp {
      display: none;
    }
    &.active {
      .el-timeline-item__tail {
        border-left-color: $colorActive;
      }
      .qs-progress-line__dot {
        color: $colorActive;
        border-color: $colorActive;
      }
      .qs-progress-line__top {
        color: $colorActive;
      }
      .qs-progress-line__content {
        background: var(--background-color-base);
      }
    }
  }
}
</style>
