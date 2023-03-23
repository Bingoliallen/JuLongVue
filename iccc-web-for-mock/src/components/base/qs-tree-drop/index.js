/**
 * Created by hecg on 2020/10/28.
 */
import DataOp from '@srcPath/utils/zt-data';
import TreeDrop from '@srcPath/components/jz-base/tree-drop';
import _ from 'lodash';
export default {
  name: 'qs-tree-drop',
  mixins: [TreeDrop],
  computed: {
    /**
     * TODO：替换风谷框架
     * 合并树节点的属性参数值
     */
    treeBind() {
      return {
        load: this.loadNode,
        ...this.treeProps,
        data: this.dataSource,
        props: this.alias,
        'node-key': this.alias.value,
        'check-leaf': this.checkLeaf,
        'show-checkbox': this.radioType === '' && this.multiple,
        'radio-type': this.radioType,
        'filter-node-method': _.isFunction(this.filterNodeMethod) ? this.filterNodeMethod : this.filterNode,
        'check-strictly': this.checkStrictly,
        'highlight-current': true,
        'render-after-expand': false,
        'render-content': this.renderContent
      };
    }
  },
  methods: {
    loadNode(node, resolve) {
      debugger;
      DataOp.reqData(node, resolve);
    }
  }
};
