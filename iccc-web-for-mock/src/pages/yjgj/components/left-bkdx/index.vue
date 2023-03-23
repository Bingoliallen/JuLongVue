<template>
  <component v-if="componentId" class="left-bkdx" :data="data" :is="componentId"></component>
</template>

<script>
import BkdxAdd from './bkdx-add';
import BkdxPeople from './bkdx-people';
export default {
  name: 'left-bkdx',
  components: { BkdxAdd, BkdxPeople },
  props: {
    data: Object
  },
  computed: {
    componentId() {
      if (!this.data) {
        return 'bkdx-add';
      }
      switch (this.data.type) {
        case 'people':
          return 'bkdx-people';
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
.bkdx-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  &_img {
    width: 4.75rem;
    height: 4.75rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    img {
      width: 100%;
      height: 100%;
    }
  }
  &_content {
    flex: 1;
    margin-left: 1em;
  }
  &_row {
    display: flex;
    justify-content: space-between;
    .iconf-focus {
      color: #faad14;
    }
    .bkzt {
      color: #f5222d;
    }
  }
  &:hover {
    background: rgba(24, 144, 255, 0.08);
  }
  &.active {
    background: rgba(24, 144, 255, 0.08);
    color: #1890ff;
  }
}
</style>
