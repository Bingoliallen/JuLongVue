<!-- Created by hcg on 2021/3/3. -->
<template>
  <div class="object-category-config">
    <div class="occ-left">
      <div class="title-1">人员类别</div>
      <tree class="occ-tree" ref="tree" @showDetail="showDetail" @showEdit="showEdit"></tree>
    </div>
    <div class="occ-right">
      <div class="title-1">{{ componentTitle }}</div>
      <dg-scrollbar>
        <edit
          v-if="component === 'edit'"
          class="occ-content"
          v-bind="componentBind"
          :key="componentBind.data.id"
          @edit-success="editSuccess"
        ></edit>
        <detail
          v-else-if="component === 'detail'"
          class="occ-content"
          v-bind="componentBind"
          :key="componentBind.data.id"
        ></detail>
        <div class="occ-content" v-else></div>
      </dg-scrollbar>
    </div>
  </div>
</template>

<script>
import Detail from './modules/detail';
import Edit from './modules/edit';
import Tree from './modules/tree';

export default {
  // 人员类别配置
  name: 'object-category-config',
  components: { Detail, Edit, Tree },
  data() {
    return {
      component: '',
      componentTitle: '',
      componentBind: {
        data: {},
        node: {}
      }
    };
  },
  methods: {
    showDetail({ data }) {
      this.component = 'detail';
      this.componentTitle = '人员类别详情';
      this.componentBind = { data };
    },
    showEdit({ data, node }) {
      this.component = 'edit';
      this.componentTitle = '人员类别管理';
      this.componentBind = { data, node };
    },
    editSuccess(arg) {
      this.$refs.tree.updateNode(arg);
      this.showDetail(arg);
    }
  }
};
</script>

<style lang="scss" scoped>
.object-category-config {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  background: var(--background-color);
  .title-1 {
    border-bottom: var(--border-light);
  }
  .occ-left {
    width: 24.5rem;
    border-right: var(--border);
    .occ-tree {
      height: calc(100% - 3.5rem);
    }
  }
  .occ-right {
    flex: 1;
    .el-scrollbar /deep/ {
      height: calc(100% - 3.5rem);
      .el-scrollbar__wrap {
        overflow-x: hidden;
        height: 100%;
        margin-bottom: 0;
      }
      .el-scrollbar__view {
        width: 50%;
        min-height: 100%;
        display: flex;
        align-items: center;
        //justify-content: center;
        margin: 0 auto;
      }
      .occ-content {
        margin: 1.5rem 2rem;
        width: 100%;
      }
    }
  }
}
</style>
