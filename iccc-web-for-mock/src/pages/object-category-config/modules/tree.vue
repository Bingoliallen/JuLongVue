<!-- Created by hcg on 2021/3/3. -->
<template>
  <div class="object-category-tree">
    <div class="oct-input">
      <el-autocomplete
        placeholder="请输入关键词搜索"
        suffix-icon="el-icon-search"
        v-model="searchGjz"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
      </el-autocomplete>
      <i class="btn-icon el-icon-plus" @click="addNode()"></i>
    </div>
    <dg-scrollbar class="oct-tree">
      <el-tree
        ref="tree"
        :props="props"
        :data="treeData"
        node-key="id"
        :expand-on-click-node="false"
        lazy
        :load="loadNode"
        @node-click="nodeClick"
      >
        <template v-slot="{ data, node }">
          <div class="custom-tree-node" :class="{ editing: data.editing }" :data-id="data.id">
            <span class="node-text">
              <i :class="data.isLeaf ? 'el-icon-document' : 'el-icon-folder-opened'"></i>{{ data.mc }}
            </span>
            <span class="node-btns">
              <i class="btn-icon icon iconl-add" title="添加子节点" @click.stop="plus({ data, node })"></i>
              <i class="btn-icon icon iconl-bianji" title="编辑" @click.stop="edit({ data, node })"></i>
              <i
                v-if="+data.sfqy"
                class="btn-icon icon iconl-jinyong"
                title="禁用"
                @click.stop="switchButton({ data, node })"
              ></i>
              <i v-else class="btn-icon icon iconl-kaishi" title="启用" @click.stop="switchButton({ data, node })"></i>
            </span>
          </div>
        </template>
      </el-tree>
    </dg-scrollbar>
  </div>
</template>

<script>
import { getTreeData, getAllParent, modifyEnabled, getNewNodeNumber, queryKeywordCategory } from './../request';
import _ from 'lodash';

const { getSetting } = window.systemParamsUtils;

export default {
  // 人员类别树
  name: 'object-category-tree',
  data() {
    const querySearch = _.debounce(async (queryString, cb) => {
      const res = await queryKeywordCategory(queryString);
      cb(res.data.map(e => ({ value: e.mc, data: e })));
    }, 1000);
    return {
      rylbRootBh: getSetting('RYLB_ROOT_BH') || '',
      searchGjz: '',
      querySearch,
      props: {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      treeData: [],
      activeData: {}
    };
  },
  methods: {
    async handleSelect(item) {
      const data = item.data;
      let allParent = (await getAllParent(data.bh)).data;

      const expand = (tree, id, parent, callback) => {
        if (parent.id === id) {
          // 表示已锁定到当前节点
          callback(id);
        } else {
          const node = tree.getNode({ id: 'id-' + parent.id });
          node.expand(async () => {
            await this.$nextTick();
            expand(tree, id, parent.children, callback);
          });
        }
      };

      const tree = this.$refs.tree;
      if (!allParent.id || allParent.id === this.rylbRootBh) {
        allParent = allParent.children;
      }
      expand(tree, data.bh, allParent, async id => {
        await this.$nextTick();
        const el = document.querySelector(`[data-id="id-${id}"]`);
        el && el.click();
        el && el.scrollIntoView();
      });
    },
    async addNode(data) {
      const id = 'id-new';
      const newChild = { id, ph: data ? data.bh : this.rylbRootBh, mc: '新增人员类别', isLeaf: true, sfqy: '1' };
      newChild.bh = (await getNewNodeNumber(newChild.ph)).data;

      if (!data) {
        // 没有传数据就添加到最顶级
        this.treeData.push(newChild);
      } else {
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      }
      await this.changeCurrentNode(newChild);
      this.edit({ data: newChild, node: this.$refs.tree.getNode(id) });
      await this.$nextTick();
      const el = document.querySelector(`[data-id="${newChild.id}"]`);
      el && el.scrollIntoView();
    },
    async loadNode(node, resolve) {
      const { level, data } = node;
      //  加载第一级
      if (level === 0) {
        const list = await getTreeData(this.rylbRootBh);
        this.treeData.push(...list);
        // 默认选中第一项
        if (list.length > 0) {
          await this.$nextTick();
          const data = list[0];
          this.$refs.tree.setCurrentNode({ id: data.id });
          this.nodeClick(data);
        }
      } else {
        //  加载下一级
        const list = await getTreeData(data.bh);
        if (list.length === 0) {
          // 没有子节点，更新图标
          this.$set(data, 'isLeaf', true);
        } else {
          if (!data.children) {
            this.$set(data, 'children', []);
          }
          data.children.push(...list);
        }
      }
      // 不使用 resolve 返回值，统一放在 this.treeData 处理
      resolve([]);
    },
    updateNode({ node, data }) {
      Object.assign(node.data, data, { editing: false });
    },
    nodeClick(data) {
      if (!data.bh || this.activeData.bh === data.bh) {
        // 跳过 正在添加的或者已经选中的
        return;
      }
      this.changeActiveData(data);
      this.$emit('showDetail', { data });
    },
    // 切换为选中当前项
    async changeCurrentNode(data) {
      await this.$nextTick();
      const tree = this.$refs.tree;
      tree.setCurrentNode(data);
      this.changeActiveData(data);
    },
    changeActiveData(data) {
      const old = this.activeData;
      if (old === data) {
        return;
      }

      // 选中项切换，去除临时添加的节点
      if (old && old.editing) {
        if (old.id === 'id-new') {
          // 表示上次选中是新增，把该节点删除
          const tree = this.$refs.tree;
          const node = tree.getNode(old);
          const parentData = node.parent.data;
          parentData.isLeaf = !(parentData.children && parentData.children.length > 1);
          tree.remove(old);
        } else {
          this.$delete(old, 'editing');
        }
      }

      this.activeData = data;
    },
    // 添加子节点
    plus({ data, node }) {
      if (data.isLeaf) {
        // 添加之后本节点就不是叶子节点
        this.$set(data, 'isLeaf', false);
        node.loaded = true;
      }
      node.expand(() => {
        this.addNode(data, node);
      });
    },
    // 编辑
    edit({ data, node }) {
      this.changeActiveData(data);
      this.$set(data, 'editing', true);
      this.$emit('showEdit', { data, node });
    },
    // 禁用
    async switchButton({ data, node }) {
      const qyzt = data.sfqy === '1' ? '0' : '1';
      await modifyEnabled(data.bh, qyzt);
      this.$message.success(`${qyzt === '1' ? '启用' : '禁用'}成功！`);
      data.sfqy = qyzt;
      this.updateNode({ data, node });
    }
  }
};
</script>

<style lang="scss" scoped>
.object-category-tree {
  display: flex;
  flex-direction: column;
  .oct-input {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    .el-autocomplete {
      flex: 1;
    }
  }
  .oct-tree {
    flex: 1;
    .el-tree /deep/ {
      padding: 0 2rem 1rem;
      .el-tree-node {
        &.is-current {
          > .el-tree-node__content {
            background-color: var(--background-color-base);
            .custom-tree-node .node-btns {
              /*display: unset;*/
            }
          }
        }
      }
    }
    .custom-tree-node {
      &:hover {
        .node-btns {
          display: unset;
        }
      }
      &.editing {
        color: var(--color-text-regular);
        .node-btns {
          display: none;
        }
      }
      .node-text i {
        color: var(--color-warning);
        margin-right: 0.5em;
      }
      .node-btns {
        margin-left: 0.5em;
        display: none;
      }
    }
  }
  .btn-icon {
    font-size: inherit;
    margin-left: 3px;
    color: var(--color-text-regular);
    cursor: pointer;
    &:hover,
    &.active {
      color: var(--color-primary);
    }
  }
}
</style>
