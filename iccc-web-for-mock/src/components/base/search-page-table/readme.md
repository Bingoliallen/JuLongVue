### 表单搜索页组件

页面布局是表单加表格加分页；配置项见下面示例

#### 示例

```vue
<!-- 布控列表 -->
<template>
  <search-page-table class="monitor-list" ref="page" v-bind="config" @loaded="tableLoaded">
    <template v-slot:tool="{ selectData }">
      <dg-button type="primary" @click="addBkdx">新增布控</dg-button>
      <dg-button type="primary" @click="exportBkdx(selectData)">导出</dg-button>
      <el-dropdown @command="handleDropdown($event, selectData)">
        <el-button plain>多选操作 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu class="dropdown-menu-100" slot="dropdown">
          <el-dropdown-item command="bk">布控</el-dropdown-item>
          <el-dropdown-item command="xk">续控</el-dropdown-item>
          <el-dropdown-item command="ck">撤控</el-dropdown-item>
          <el-dropdown-item command="sc">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-slot:BKDX="{ row }">
      <bkdx-people :row="row" @click.native="openBkdxDetail(row)" @dblclick.native="openBkdxDetail(row)"></bkdx-people>
    </template>
    <template v-slot:BKZT="{ row, formatValue }">
      <span v-if="row.BKZT" class="icon-bkzt" :type="row.BKZT"> <i class="iconfont"></i>{{ formatValue }} </span>
      <template v-else>-</template>
    </template>
    <template v-slot:operate="{ row }">
      <template v-if="row.BKZT === '03'">
        <dg-button type="text" @click="bkCommand([row])">布控</dg-button>
        <span class="uo-split-line__btn">|</span>
      </template>
      <template v-if="row.BKZT === '04'">
        <dg-button type="text" @click="xkCommand([row])">续控</dg-button>
        <span class="uo-split-line__btn">|</span>
      </template>
      <template v-if="row.BKZT === '02'">
        <dg-button type="text" @click="ckCommand([row])">撤控</dg-button>
        <span class="uo-split-line__btn">|</span>
      </template>
      <dg-button type="text" @click="scCommand([row])" :disabled="row.BKZT !== '01'">删除</dg-button>
    </template>
  </search-page-table>
</template>

<script>
import { BM_QWBK_BKDX, BM_QWBK_BKZT, BM_QWBK_BKLB, BM_QWBK_BKJB } from '@icccPath/common/constant';
import BkdxPeople from './modules/bkdx-people';
export default {
  name: 'monitor-list',
  components: { BkdxPeople },
  data() {
    return {
      config: {
        // 搜索条件配置
        formConfig: {
          labelWidth: '6em',
          // 搜索条件项
          /**
           * 1、配置项
           * {
           *   label: 字段提示label,
           *   comType: 组件类型，暂时写了日期和单选两个组件,
           *   comName: 组件名称，用于支持动态组件，不要和上面的一起使用,
           *   getLabel: 自定义一个获取label的方法，展示在页面顶部的已选条件区域，配合 comName 使用,
           *   bind: 用来绑定到组件的其他配置项,
           *   // 下面这5个配置会绑定到后端搜索条件
           *   name
           *   value
           *   op: 操作符
           *   type
           *   format
           * }
           * 2、如果组件类型为日期（comType === 'date'）， 有如下配置
           *   bind: { limit: 'today' } 限制时间不能超过今天
           *   bind: { type: 'datetime' } 可选择时分秒
           */
          items: [
            {
              label: '预警时间：',
              comType: 'date',
              name: 'gjyjsj',
              value: '',
              bind: { type: 'datetime', limit: 'today' }
            },
            { label: '布控时间：', comType: 'date', name: 'bksj', value: '' },
            {
              label: '布控级别：',
              comType: 'radio',
              name: 'bkjb',
              value: '',
              bind: { code: BM_QWBK_BKJB, module: 'MOCK_API' }
            },
            {
              label: '布控类别：',
              comType: 'radio',
              name: 'bklb',
              value: '',
              bind: { code: BM_QWBK_BKLB, module: 'MOCK_API' }
            },
            {
              label: '布控对象：',
              comType: 'radio',
              name: 'bkdx',
              value: '',
              bind: { code: BM_QWBK_BKDX, module: 'MOCK_API' }
            }
          ]
        },
        toolConfig: true,
        // 表格配置
        tableConfig: {
          module: 'MOCK_API',
          url: '/table-page/monitor',
          rowKey: '',
          columns: [
            { type: 'selection', width: '55', fixed: 'left' },
            { type: 'index', label: '序号', width: '65', fixed: 'left' },
            {
              type: 'slot',
              label: '布控对象',
              prop: 'BKDX',
              code: BM_QWBK_BKDX,
              module: 'MOCK_API',
              showOverflowTooltip: false,
              width: '20em',
              fixed: 'left'
            },
            {
              type: 'slot',
              label: '布控状态',
              prop: 'BKZT',
              code: BM_QWBK_BKZT,
              module: 'MOCK_API',
              showOverflowTooltip: false,
              width: '7em'
            },
            { label: '布控类别', prop: 'BKLB', code: BM_QWBK_BKLB, module: 'MOCK_API', width: '7em' },
            {
              label: '布控级别',
              prop: 'BKJB',
              sortable: 'custom',
              code: BM_QWBK_BKJB,
              module: 'MOCK_API',
              width: '9em'
            },
            { label: '布控开始时间', prop: 'BKKSSJ', sortable: 'custom', doFilters: 'filterDate', width: '13em' },
            { label: '布控截止时间', prop: 'BKJZSJ', sortable: 'custom', doFilters: 'filterDate', width: '13em' },
            { label: '预警时间', prop: 'YJSJ', sortable: 'custom', doFilters: 'filterTime', width: '13em' },
            { label: '预警信息', prop: 'YJXX', minWidth: '13em' },
            { type: 'slot', label: '操作', prop: 'operate', width: '13em', fixed: 'right' }
          ]
        },
        // 表格搜索条件，会合并上 formConfig.items 传给表格
        condition: [
          { name: 'condition1', value: '', op: '=', type: '', format: '' },
          { name: 'condition2', value: '', op: '=', type: '', format: '' }
        ],
        // 搜索关键词，配置为 false 不会出现输入框
        keyword: { name: 'condition-keyword', value: '', op: '=', type: '', format: '' }
      }
    };
  },
  methods: {
    tableLoaded(result) {
      const { pageNum, condition, content } = result;
      // 没有选择搜索条件 且 第一页 且 无数据 则打开引导页
      if ((!condition || condition.every(e => !e.value)) && pageNum === 1 && (!content || content.length === 0)) {
        this.$router.replace({
          name: 'monitor-list-guide',
          params: { replace: true }
        });
      }
    },
    // 新增布控对象
    addBkdx() {
      this.$router.push({
        name: 'monitor-list-apply'
      });
    },
    openBkdxDetail(row) {
      this.$router.push({
        name: 'monitor-list-detail',
        params: {
          id: row.ID
        }
      });
    },
    // 导出布控对象
    exportBkdx() {
      this.$refs.page.exportData();
    },
    handleDropdown(command, selectData) {
      this[command + 'Command'](selectData);
    },
    bkCommand(selectData) {
      if (selectData.length <= 0) {
        this.$message.warning('请选择可布控的对象！');
        return;
      }
      this.$message.success('布控申请提交成功！');
      this.$refs.page.reload();
    },
    xkCommand(selectData) {
      if (selectData.length <= 0) {
        this.$message.warning('请选择可续控的对象！');
        return;
      }
      this.$message.success('续控申请提交成功！');
      this.$refs.page.reload();
    },
    ckCommand(selectData) {
      if (selectData.length <= 0) {
        this.$message.warning('请选择可撤控的对象！');
        return;
      }
      this.$message.success('撤控申请提交成功！');
      this.$refs.page.reload();
    },
    scCommand(selectData) {
      if (selectData.length <= 0) {
        this.$message.warning('请选择可删除的对象！');
        return;
      }
      this.$tool.confirm('是否删除，删除后无法恢复！').then(() => {
        this.$message.success('删除成功！');
        this.$refs.page.search();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown {
  margin-left: 5px;
}
.bkdx-people {
  cursor: pointer;
}
.dropdown-menu-100 {
  width: 8rem;
}
</style>
```
