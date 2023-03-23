<!-- 防控圈卡片 -->
<template>
  <div ref="fkq-card-item" class="fkq-card-item">
    <div class="fkq-card-item_top">
      <el-checkbox v-if="showSelected" v-model="node.checked" @change="checkedChange" @click.native.stop></el-checkbox>
      <p class="fkq-card-item_name">{{ data.mc | filterText }}</p>
      <span class="fkq-card-item_operation">
        <i class="iconfont iconl-edit" @click.stop="$emit('edit', data, node)"></i>
        <i class="iconfont iconl-delete" @click.stop="$emit('delete', data, node)"></i>
      </span>
    </div>
    <div class="fkq-card-item_content">
      <fkq-graph-list :values="data.fkq" type="line" @view-fkq="viewFkqMap"></fkq-graph-list>
    </div>
    <div class="fkq-card-item_bottom">
      <el-tag v-if="data.lx.indexOf('XZQH') !== -1" type="primary" effect="plain">行政区划</el-tag>
      <el-tag v-if="data.lx.indexOf('ZDY') !== -1" type="success" effect="plain">自定义区域</el-tag>
      <span class="fkq-card-item_lock" :class="data.syfw === 'GY' ? 'gy' : 'sy'">
        <i class="iconfont" :class="data.syfw === 'GY' ? 'iconf-unlock' : 'iconf-lock'"></i>
        {{ data.syfw === 'GY' ? '公用' : '私用' }}
      </span>
    </div>
  </div>
</template>

<script>
import FkqGraphList from './fkq-graph-list';
export default {
  name: 'fkq-card-item',
  components: { FkqGraphList },
  props: {
    node: Object,
    showSelected: Boolean
  },
  computed: {
    data() {
      return this.node.data;
    }
  },
  methods: {
    checkedChange() {
      this.$emit('checked-change', this.node);
    },
    viewFkqMap(data, index) {
      this.$emit('view-fkq', data, index, this.node);
    }
  }
};
</script>

<style scoped lang="scss">
@mixin active() {
  border: 1px solid var(--control-circle_fkq-card-item_hover-border-color);
  box-shadow: 0 2px 8px 0 var(--control-circle_fkq-card-item_hover-box-shadow);
}
.fkq-card-item {
  border: 1px solid var(--control-circle_fkq-card-item_border-color);
  border-radius: 2px;
  &.active,
  &:hover {
    @include active;
  }
  &_content {
    margin: 0.75rem 2rem;
  }
  &_name {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &_operation {
    order: 1;
    flex: 0 0 4rem;
    .iconfont {
      cursor: pointer;
      &:hover {
        color: var(--color-primary);
      }
    }
  }
  &_top {
    height: 2.67rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.14rem 0 2rem;
    background-color: var(--control-circle_fkq-card-item_bottom_background);
    .iconfont {
      color: var(--message-close-icon-color);
      &:not(:last-child) {
        margin-right: 0.5rem;
      }
    }
  }
  &_bottom {
    display: flex;
    align-items: center;
    padding: 0 1.14rem 1.25rem 2rem;
    .iconfont {
      font-size: inherit;
    }
    .el-tag + .el-tag {
      margin-left: 8px;
    }
    .fkq-card-item_lock {
      margin-left: auto;
      &.gy {
        color: var(--color-success);
      }
      &.sy {
        color: var(--color-warning);
      }
    }
  }
  /deep/.el-checkbox {
    margin-right: 0.5rem;
  }
}
</style>
