<template>
  <div class="qyfk">
    <dg-button type="primary" @click="choseFkq">选择防控圈</dg-button>
    <qs-table :data="fkqData" :pagination="false" :columns="columns" :sortProps="sortProps" no-data-height="240px">
      <template v-slot:fkq="{ row }">
        <fkq-graph-list type="line" :values="row.fkq"></fkq-graph-list>
      </template>
      <template v-slot:fx="{ row }">
        <dg-switch v-model="row.fx" active-value="IN" inactive-value="OUT"></dg-switch>
        &nbsp;&nbsp;{{ row.fx === 'IN' ? '进' : '出' }}
      </template>
    </qs-table>
  </div>
</template>

<script>
import QsTable from './../../base/qs-table';
import FkqGraphList from './../../control-circle/fkq-graph-list';

export default {
  name: 'qyfk',
  components: { QsTable, FkqGraphList },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    module: String
  },
  data() {
    return {
      columns: [
        { type: 'index', label: '序号', width: '80' },
        { label: '防控圈名称', prop: 'mc', minWidth: '7em' },
        { type: 'slot', label: '防控圈', prop: 'fkq', width: '20rem' },
        { type: 'slot', label: '进出方向', prop: 'fx', width: '8em' },
        { label: '使用范围', prop: 'syfw', code: 'BM_QZFKQ_SYFW', width: '6em' },
        {
          type: 'operation-tpl',
          label: '操作',
          prop: 'operate',
          'cmp-props-buttons': [
            {
              删除: ({ $index }) => {
                this.delRow($index);
              }
            }
          ],
          width: '4em'
        }
      ],
      fkqData: [],
      sortProps: {},
      testRadio: ''
    };
  },
  methods: {
    init() {
      this.fkqData = this.$tool.deepClone(this.value.qyfk || []);
    },
    choseFkq() {
      const layer = this.$dgLayer({
        title: '选择防控圈',
        // 组件内容
        component: require('./../../control-circle'),
        maxmin: false,
        resize: false,
        props: { module: this.module, value: this.$tool.deepClone(this.fkqData) },
        area: ['100vw', '100vh'],
        skin: 'layer-transparent layer-flex',
        btn: false,
        on: {
          submit: list => {
            this.fkqData = this.$tool.deepClone(list);
            layer.close(layer.dialogIndex);
          }
        },
        close() {
          layer.close(layer.dialogIndex);
        }
      });
    },
    addRow(list) {
      this.fkqData.unshift(...this.$tool.deepClone(list));
    },
    delRow(index) {
      this.fkqData.splice(index, 1);
    },
    getData() {
      return [{ key: 'qyfk', value: this.fkqData }];
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.qs-table {
  margin-top: 1rem;
  /deep/ .el-table .cell {
    padding: 0 1em;
  }
}
</style>
