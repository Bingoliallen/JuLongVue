<template>
  <span class="sort-button" @click="changeSort()">
    <slot></slot>
    <span class="caret-wrapper">
      <i class="sort-caret asc" :class="{ active: value === 'ASC' }"></i>
      <i class="sort-caret desc" :class="{ active: value === 'DESC' }"></i>
    </span>
  </span>
</template>

<script>
const list = ['DESC', 'ASC', 'null'];
export default {
  name: 'sort-button',
  props: {
    value: String
  },
  methods: {
    changeSort(val) {
      if (!val) {
        let i = list.indexOf(this.value);
        i = (i + 1) % list.length;
        val = list[i];
      }
      this.$emit('input', val);
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.sort-button {
  cursor: pointer;
}
.caret-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 26px;
  height: 14px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  .sort-caret {
    width: 0;
    height: 0;
    border: solid 5px transparent;
    position: absolute;
    left: 8px;
    @mixin active($p) {
      &.active {
        border-#{$p}-color: var(--color-primary);
      }
    }
    &.asc {
      border-bottom-color: var(--color-text-regular);
      border-top: 0;
      top: 1px;
      @include active('bottom');
    }
    &.desc {
      border-top-color: var(--color-text-regular);
      border-bottom: 0;
      bottom: 1px;
      @include active('top');
    }
  }
}
</style>
