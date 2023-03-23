<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="bkrz-list">
    <div class="bkrz-list__tool">
      <!-- <template slot="prefix"></template> -->
      <label class="prefix__select__label">操作类型：</label>
      <dg-select
        v-model="manType"
        class="bkrz-list__select"
        code="BM_BKSQ_LZLX"
        clearable
        placeholder="请选择"
        @change="search()"
      >
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
              item.data.czsj ? $dayjs(item.data.czsj).format('YYYY-MM-DD HH:mm:ss') : item.data.czsj | filterText
            }}</time>
            <div class="time-line-ul__li__cut">
              <div :class="['time-line-ul__li__cut__dot', getSqztTag(item.data.lzlx)]"></div>
              <div class="time-line-ul__li__cut__tail" v-if="index != list.length - 1"></div>
            </div>
          </div>
          <div class="time-line-ul__li__content">
            <div class="time-line-ul__li__content__title">
              <span
                :class="['time-line-ul__li__content__tag', getSqztTag(item.data.lzlx)]"
                :data-type="item.data.lzlx"
                v-code="{ code: 'BM_BKSQ_LZLX', value: item.data.lzlx }"
              ></span>
              <span
                class="time-line-ul__li__content__name"
                :data-type="item.data.czdwdm"
                v-code="{ code: 'BM_DEPT', value: item.data.czdwdm }"
              >
              </span>
              <span style="margin-left: 0.5rem;">{{ item.data.czrxm | filterText }}</span>
            </div>
            <div class="time-line-ul__li__content__text">
              <span v-if="item.data.lzlx === 'SP' || item.data.lzlx === 'TH' || item.data.lzlx === 'AP'"
                >审批意见：{{ item.data.spyj | filterText }}<br
              /></span>
              <span>申请原因：{{ getBkyy(item.data.sqxx) | filterText }}</span>
            </div>
          </div>
        </li>
      </template>
    </timeLine>
  </div>
</template>
<script>
import timeLine from '@icccPath/components/time-line';
import bkxxApi from '@icccPath/api/qwbk';
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
      manType: '',
      timeLineData: [],
      // 排序中间值
      sortDataDefault: 1,
      // 排序默认
      sortValue: '1',
      leftListConfig: {
        sort: { CZSJ: 'DESC' },
        searchCondition: [
          {
            name: 'BKDXBH',
            op: '=',
            value: this.id
          }
        ],
        url: '/v1/bkdx-blrz/search'
      }
    };
  },
  // 计算属性
  computed: {},
  components: {
    timeLine
  },
  watch: {
    id() {
      this.search();
    }
  },
  // 方法
  methods: {
    init() {},
    /**
     *字符串转json
     *
     */
    stringToJson(data) {
      return JSON.parse(data);
    },
    getBkyy(data) {
      return this.stringToJson(data).bkyy;
    },
    getSqztTag(sqzt) {
      return sqzt == 'TH' ? 'warning' : sqzt == 'CH' || sqzt == 'AP' || sqzt == 'SP' ? '' : 'danger';
    },
    search() {
      let condition = [
        { name: 'LZLX', op: '=', value: this.manType },
        { name: 'GJZ', op: 'like', value: this.keyword, mergerName: 'CZRXM,CZDWMC,SPYJ,SQXX' },
        { name: 'BKDXBH', op: '=', value: this.id }
      ];
      this.leftListConfig.searchCondition = condition;

      // this.$nextTick(() => {
      //   this.$refs.page.search(condition);
      // });
    },
    // 导出布控对象
    exportBkdx() {
      this.$refs.page.exportData();
    },
    handleDropdown(command, selectData) {
      this[command + 'Command'](selectData);
    },
    spCommand(selectData) {},
    sqCommand(selectData) {}
  },
  // 组件创建时调用
  created() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.bkrz-list {
  &__select {
    width: 150px;
    margin-right: 10px;
  }

  &__tool {
    position: relative;
    margin: 1rem 0;
    display: flex;
    align-items: center;

    > .el-checkbox {
      margin-right: 1rem;
    }
  }
}
.bkdx__head {
  position: absolute;
  right: 0px;
  margin-left: 10px;
  width: 23rem;
}
</style>
