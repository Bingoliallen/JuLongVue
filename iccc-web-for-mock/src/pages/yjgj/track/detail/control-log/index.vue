<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="bkrz-list">
    <div class="bkrz-list__tool">
      操作类型：
      <el-select v-model="manType" class="bkrz-list__select prefix__select" clearable placeholder="请选择">
        <el-option v-for="item in optData" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <!-- <dg-button type="primary" @click="exportBkdx()">导出</dg-button> -->
      <div class="bkdx__head">
        <el-input
          v-model="keyword"
          v-trim
          placeholder="请输入关键字筛选结果"
          suffix-icon="el-icon-search"
          @blur="search()"
          @keyup.native="search()"
        ></el-input>
      </div>
    </div>
    <timeLine :timeLineData="timeLineData"></timeLine>
  </div>
</template>
<script>
import timeLine from '@icccPath/components/time-line';
export default {
  name: 'ControlLog',
  // 接收父页面传过来的属性
  props: {},
  // 页面数据绑定
  data() {
    return {
      keyword: '',
      optData: [
        {
          label: '不限',
          value: ''
        },
        {
          label: '审批',
          value: 'sp'
        },
        {
          label: '申请',
          value: 'sq'
        }
      ],
      manType: '',
      timeLineData: [
        {
          label: '福建省公安厅  张警官',
          value: '2010-02–02 12:32:93',
          center:
            '这是备注备是备注备是备注备是备备是备注备，是备注备是备是备注备是备注备是备是备注备是备注备是注备是备注备注，这个布控很备注备是备注备是备是，备注备是备注备是注备是备注备注，这个布控很好注备是注备是…',
          tag: '审批中',
          type: 'warning'
        },
        {
          label: '福建省公安厅  张警官',
          value: '2010-02–02 12:42:93',
          center:
            '这是备注备是备注备是备注备是备备是备注备，是备注备是备是备注备是备注备是备是备注备是备注备是注备是备注备注，这个布控很备注备是备注备是备是，备注备是备注备是注备是备注备注，这个布控很好注备是注备是…',
          tag: '审批通过',
          type: ''
        },

        {
          label: '福建省公安厅  张警官',
          value: '2010-02–02 12:52:93',
          center:
            '这是备注备是备注备是备注备是备备是备注备，是备注备是备是备注备是备注备是备是备注备是备注备是注备是备注备注，这个布控很备注备是备注备是备是，备注备是备注备是注备是备注备注，这个布控很好注备是注备是…',
          tag: '审批不通过',
          type: 'danger'
        }
      ],
      // 排序中间值
      sortDataDefault: 1,
      // 排序默认
      sortValue: '1'
    };
  },
  // 计算属性
  computed: {},
  components: { timeLine },
  // 方法
  methods: {
    init() {},
    reload() {},
    // 导出布控对象
    exportBkdx() {
      this.$refs.page.exportData();
    },
    handleDropdown(command, selectData) {
      this[command + 'Command'](selectData);
    },
    spCommand(selectData) {},
    sqCommand(selectData) {},
    search() {}
  },
  // 组件创建时调用
  created() {
    this.init();
    this.reload();
  }
};
</script>
