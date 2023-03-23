<!-- Created by hcg on 2020/11/18. -->
<template>
  <div class="fkq-layer move-fast">
    <div class="fkq-layer_title">
      <span class="title-1">{{ title }}</span>
      <i class="right-btn" @click="$emit('close', layerId)">&lt;收起</i>
    </div>
    <div class="fkq-layer_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fkq-layer',
  props: {
    'layer-id': String,
    title: String
  }
};
</script>

<style lang="scss" scoped>
$layerWidth: 28rem;
.fkq-layer {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: var(--background-color);
  width: $layerWidth;
  margin-left: 4px;
  &_title {
    display: flex;
    align-items: center;
    height: 3.5rem;
    padding: 0 2rem;
    border-bottom: var(--border-light);
    .title-1 {
      flex: 1;
      padding: 0;
    }
    .right-btn {
      cursor: pointer;
      font-style: initial;
      color: var(--color-text-secondary);
      &:hover {
        /*color: var(--color-primary);*/
        text-decoration: underline;
      }
    }
  }
  &_content {
    overflow: auto;
    max-height: 50vh;
    padding: 1.5rem 2rem;
  }
}
</style>
