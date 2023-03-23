<template>
  <div class="iccc-tab-wrap">
    <div class="iccc-tab-container">
      <div
        :class="['iccc-tab-container__item', value === item.value ? 'is-active' : '']"
        v-for="item in tabItems"
        :key="item.id"
        @click="onChange(item)"
      >
        <span class="iccc-tab-container__item--name">{{ item.label }}</span>
        <span class="iccc-tab-container__item--count" v-if="isShowCount">({{ item.count | tabCount(maxCount) }})</span>
        <span class="iccc-tab-container__item--littlered" v-if="item.littlered"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab-list',
  props: {
    // 选中的值
    value: {
      type: [Number, String]
    },
    tabItems: {
      type: Array,
      default: () => {
        return [];
      },
      required: true
    },
    // 是否展示数字
    isShowCount: {
      type: Boolean,
      default: false
    },
    // 展示数字的最大值
    maxCount: {
      type: Number,
      default: 999
    }
  },
  watch: {
    tabItems: {
      handler(newVal) {
        if ((this.value === undefined || this.value === null) && newVal) {
          // 默认为第一个页签
          this.$emit('input', newVal[0].value);
        }
      },
      immediate: true
    }
  },
  filters: {
    tabCount(val, maxCount) {
      if (val > maxCount) return `${maxCount}+`;
      return val;
    }
  },
  methods: {
    onChange(item) {
      this.$emit('input', item.value);
      this.$emit('change', item);
    }
  }
};
</script>

<style lang="scss" scoped>
$--border-color-base: var(--border-color-extra-heavy);
$--color-text-secondary: var(--color-text-secondary);
$--button-color-primary: var(--color-primary);
.iccc-tab-wrap {
  .iccc-tab-container {
    display: flex;
    position: relative;
    left: 0;
    border-bottom: 1px solid $--border-color-base;
    // padding-left: 0;
    z-index: 1;
    padding: 0 2rem;
    &__item {
      position: relative;
      line-height: 3.5rem;
      margin-right: 40px;
      font-size: 18px;
      text-align: center;
      cursor: pointer;
      vertical-align: bottom;
      border-radius: 2px 0 0 0;
      color: $--color-text-secondary;
      border-bottom: 2px solid transparent;
      transition: all 0.5s;
      &:hover {
        color: $--button-color-primary;
      }
      &.is-active {
        color: $--button-color-primary;
        border-bottom: 2px solid $--button-color-primary;
        z-index: 2;
      }
      &--littlered {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        top: 1.25rem;
        right: -0.6rem;
        background: var(--color-danger);
      }
    }
  }
}
</style>
