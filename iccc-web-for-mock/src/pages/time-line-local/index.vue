<!--
 * @Author: Liugh
 * @Date: 2021-01-02 11:00:07
 * @LastEditTime: 2021-02-19 16:13:29
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <div class="bkrz-list">
    <div class="bkrz-list__tool">
      <div class="bksp_czlx">操作类型：</div>
      <dg-select
        v-model="manType"
        class="bkrz-list__select prefix__select"
        @change="search()"
        clearable
        placeholder="请选择"
        code="BM_BKSQ_LZLX"
      >
      </dg-select>
      <!-- <dg-button type="primary" @click="exportBkdx()">导出</dg-button> -->
      <div class="bkdx__head">
        <el-input
          v-model="keyword"
          v-trim
          placeholder="请输入申请人姓名、单位、事由查询"
          suffix-icon="el-icon-search"
          @blur="search()"
          @keyup.native="search()"
        ></el-input>
      </div>
    </div>
    <timeLine ref="page" :leftListConfig="leftListConfig">
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
                v-code="{ code: 'VW_BM_DEPT', value: item.data.czdwdm }"
              ></span>
              <span style="margin-left: 0.5rem;">{{ item.data.czrxm | filterText }}</span>
            </div>
            <div class="time-line-ul__li__content__text">
              <span v-if="item.data.lzlx === 'SP' || item.data.lzlx === 'TH' || item.data.lzlx === 'AP'"
                >审批意见：{{ item.data.spyj | filterText }}<br
              /></span>
              <span
                >申请原因：<span
                  v-if="getBklx(item.data.sqxx) == '31'"
                  v-code="{ code: 'BM_BKSQ_TKYY', value: getBkyy(item.data.sqxx) }"
                ></span
                ><span v-else>{{ getBkyy(item.data.sqxx) | filterText }}</span></span
              >
              <!--              {{-->
              <!--                item.data.lzlx === 'SP' || item.data.lzlx === 'TH' || item.data.lzlx === 'AP'-->
              <!--                  ? '审批意见：' + item.data.spyj -->
              <!--                  : -->
              <!--              }}-->
            </div>
          </div>
        </li>
      </template>
    </timeLine>
  </div>
</template>
<script>
import TimeLine from '@icccPath/components/time-line';
export default {
  name: 'time-line-local',
  // 接收父页面传过来的属性
  props: {
    id: String
  },
  components: { TimeLine },
  // 页面数据绑定
  data() {
    return {
      keyword: '',
      manType: '',
      leftListConfig: {
        sort: { CZSJ: 'DESC' },
        searchCondition: [
          { name: 'YWZJ', op: '=', value: this.id },
          { name: 'LZLX', op: '=', value: '' }
        ],
        url: '/v1/lzxx/search'
      },
      timeLineData: [],
      // 排序中间值
      sortDataDefault: 1,
      // 排序默认
      sortValue: '1'
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    id(val) {
      this.search();
    }
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    /**
     *字符串转json
     *
     */
    stringToJson(data) {
      return JSON.parse(data);
    },
    getBklx(data) {
      let sqxx = this.stringToJson(data);
      return sqxx.bklx;
    },
    getBkyy(data) {
      let sqxx = this.stringToJson(data);
      // 撤销停控类型
      if (sqxx.bklx == '32') {
        return sqxx.sqms;
      }
      return sqxx.bkyy;
    },
    getSqztTag(sqzt) {
      // let sqzt = this.getSqzt(data);
      return sqzt == 'TH' ? 'warning' : sqzt == 'CH' || sqzt == 'AP' || sqzt == 'SP' ? '' : 'danger';
    },
    init() {},
    // 导出布控对象
    exportBkdx() {
      this.$refs.page.exportData();
    },
    handleDropdown(command, selectData) {
      this[command + 'Command'](selectData);
    },
    spCommand(selectData) {},
    search() {
      this.condition = [
        { name: 'YWZJ', op: '=', value: this.id },
        { name: 'LZLX', op: '=', value: this.manType },
        { name: 'GJZ', value: this.keyword, op: 'like', mergerName: 'SPYJ,CZRXM,CZDWMC,SQXX' }
      ];
      this.leftListConfig.searchCondition = this.condition;

      // this.$nextTick(() => {
      //   this.$refs.page.search(this.condition);
      // });
    }
  },
  updated() {},
  // 组件创建时调用
  created() {}
};
</script>
<style lang="scss" scoped>
/deep/ .no-record__wrap.infinite-list__empty {
  height: 100%;
}
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

.bksp_czlx {
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}
</style>
