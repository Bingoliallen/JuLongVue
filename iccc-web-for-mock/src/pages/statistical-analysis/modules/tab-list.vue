<template>
  <div class="iccc-tab-wrap">
    <div class="iccc-tab-container">
      <div
        :class="['iccc-tab-container__item', value === item.value ? 'is-active' : '']"
        v-for="item in tabItems"
        :key="item.value"
        @click="onChange(item)"
      >
        <span class="iccc-tab-container__item--name">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab-list',
  props: {
    tabItems: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      value: 'ZJ'
    };
  },
  methods: {
    onChange(item) {
      this.value = item.value;
      this.$emit('input', item.value);
      this.$emit('change', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.iccc-tab-wrap {
  display: flex;
  margin-top: 0px;
  .iccc-tab-container {
    /*float: right;*/
    background-color: #ffffff;
    display: flex;
    position: relative;
    left: 0;
    z-index: 9;
    &__item {
      position: relative;
      line-height: 1.125rem;
      font-size: 0.625rem;
      text-align: center;
      cursor: pointer;
      vertical-align: bottom;
      border-radius: 2px 0 0 0;
      font-family: MicrosoftYaHei;
      color: var(--color-text-secondary);
      border-bottom: 2px solid transparent;
      transition: all 0.5s;
      &:hover {
        color: var(--color-primary);
      }
      &.is-active {
        color: var(--color-primary);
      }

      &:nth-child(1) {
        width: 4.375rem;
      }
      &:nth-child(2) {
        width: 2.375rem;
      }
      &:nth-child(3) {
        width: 2.375rem;
      }
    }
  }
}
</style>
