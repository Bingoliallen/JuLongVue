<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="bkrz-list">
    <div class="bkrz-list__tool">
      操作类型：
      <dg-select
        v-model="manType"
        class="bkrz-list__select prefix__select"
        clearable
        @change="search()"
        placeholder="请选择"
        code="BM_BKSQ_SQZT"
      >
        <!--        <template slot="prefix"> </template>-->
        <!--        <el-option v-for="item in optData" :key="item.value" :label="item.label" :value="item.value"> </el-option>-->
      </dg-select>
      <!--      <dg-button type="primary" @click="exportBkdx()">导出</dg-button>-->
      <div class="bkdx__head">
        <el-input
          v-model="keyword"
          v-trim
          clearable
          placeholder="请输入关键字筛选结果"
          suffix-icon="el-icon-search"
          @blur="search()"
          @keyup.native="search()"
        ></el-input>
      </div>
    </div>
    <timeLine ref="page" @updateCondition="leftListConfig.searchCondition = $event" :leftListConfig="leftListConfig">
      <template v-slot:list="{ list }">
        <li class="time-line-ul__li" v-for="(item, index) in list" :key="index">
          <div class="time-line-ul__li__part">
            <time class="time-line-ul__li__time">{{
              item.data.sqsj ? $dayjs(item.data.sqsj).format('YYYY-MM-DD HH:mm:ss') : item.data.sqsj | filterText
            }}</time>
            <div class="time-line-ul__li__cut">
              <div :class="['time-line-ul__li__cut__dot', getSqztTag(item.data.sqzt)]"></div>
              <div class="time-line-ul__li__cut__tail" v-if="index != list.length - 1"></div>
            </div>
          </div>
          <div class="time-line-ul__li__content">
            <div class="time-line-ul__li__content__title">
              <span
                :class="['time-line-ul__li__content__tag', getSqztTag(item.data.sqzt)]"
                :data-type="item.data.sqzt"
                v-code="{ code: 'BM_BKSQ_SQZT', value: item.data.sqzt }"
              ></span>
              <span
                class="time-line-ul__li__content__name"
                :data-type="item.data.sqdwdm"
                v-code="{ code: 'VW_BZ_XZQH', value: item.data.sqdwdm }"
              ></span>
              <span style="margin-left: 0.5rem;">{{ item.data.sqrxm | filterText }}</span>
            </div>
            <div class="time-line-ul__li__content__text">
              {{ item.data.bkyy | filterText }}
            </div>
          </div>
        </li>
      </template>
    </timeLine>
  </div>
</template>
<script>
import timeLine from '@icccPath/components/time-line';
import rwdSqxxApi from '@icccPath/api/rwd-sqxx';
export default {
  name: 'ControlLog',
  // 接收父页面传过来的属性
  props: {
    id: String
  },
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
      leftListConfig: {
        searchCondition: [{ name: 'BKDXBHS', op: 'in', value: this.id }],
        url: '/v1/bkdx-blrz/search'
      },
      timeLineData: [],
      // 排序中间值
      sortDataDefault: 1,
      // 排序默认
      sortValue: '1'
    };
  },
  watch: {
    id() {
      this.search();
    }
  },
  // 计算属性
  computed: {},
  components: { timeLine },
  // 方法
  methods: {
    init() {},
    getSqztTag(sqzt) {
      return sqzt == '2' ? 'warning' : sqzt == '1' || sqzt == '3' ? '' : 'danger';
    },
    // 导出布控对象
    exportBkdx() {
      this.$refs.page.exportData();
    },
    handleDropdown(command, selectData) {
      this[command + 'Command'](selectData);
    },
    spCommand(selectData) {},
    sqCommand(selectData) {},
    search() {
      let condition = [
        { name: 'LZLX', op: '=', value: this.manType },
        { name: 'GJZ', op: 'like', value: this.keyword, mergerName: 'SQMC,SQRXM,SQDWMC,BKYY' },
        { name: 'BKDXBHS', op: 'in', value: this.id }
      ];
      this.$nextTick(() => {
        this.$refs.page.search(condition);
      });
    }
  },
  // 组件创建时调用
  created() {
    this.init();
  }
};
</script>

