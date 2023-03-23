<!-- 轨迹预警 -->
<template>
  <qwbk-layout
    class="qwbk-monitor"
    v-model="menuActive"
    :menuItems="menuItems"
    :popover-key="popoverKey"
    placeholder="请输入对象号码、姓名、发生地点"
    :leftTitle="leftListConfig.leftTitle"
    :leftListConfig="leftListConfig"
    @updateCondition="searchCondition = $event"
    @load="infiniteLoad"
    :pageExpand="pageExpand"
    primary-key="id"
    @pageExpand="pageExpand = $event"
    @changeCard="changeCard"
    @change="changeMenu"
    @export-data="exportData"
    :showExport="true"
  >
    <template v-slot:leftTitle>
      <div class="flex-1">
        <span class="title-text">{{ leftListConfig.leftTitle }}</span>
        <span class="yjgj-num">{{ total.toLocaleString() }}个</span>
      </div>
      <!-- <el-button type="primary" plain size="small" @click="exportYjgj">导出</el-button> -->
      <el-button type="text" icon="iconfont iconl-fullscreen" title="展开" @click="pageExpand = true"></el-button>
    </template>
    <template v-if="pageExpand" v-slot:expand>
      <gjyj-list
        :leftListConfig="leftListConfig"
        :leftTitle="leftListConfig.leftTitle"
        @changeCard="changeCard"
        @pageExpand="pageExpand = $event"
      ></gjyj-list>
    </template>
    <template v-else v-slot="{ node, data }">
      <iccc-card-item :key="node.key" :data="data" cardType="track"></iccc-card-item>
    </template>
  </qwbk-layout>
</template>

<script>
import QwbkLayout from '@icccPath/components/qwbk-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import GjyjList from './list';
import nzdrApi from '@icccPath/api/nzdr/index.js';
export default {
  name: 'qwbk-monitor',
  components: { QwbkLayout, IcccCardItem, GjyjList },
  data() {
    return {
      menuItems: [
        // { label: '轨迹预警', value: 'yjgj', active: false, icon: 'iconl-track', num: 326 },
        { label: '轨迹预警', value: 'yjgj', active: false, icon: 'iconl-track' },
        { label: '人像轨迹', value: 'rxgj', active: false, icon: 'iconl-ptrack' },
        { label: '车辆轨迹', value: 'clgj', active: false, icon: 'iconl-car' },
        { label: '我的关注', value: 'wdgz', active: false, icon: 'iconl-focus' }
      ],
      menuActive: 'yjgj',
      // 标题类型切换，ck 撤控，bk 布控，xk 续控，ydfz 移动分组
      pageType: false,
      pageExpand: false,
      popoverKey: 'CONDITIONS_YJGJ',
      total: 0,
      searchCondition: []
    };
  },
  computed: {
    leftListConfig() {
      let url = '/v1/gjxx/search';
      let showExportUrl = '/v1/gjxx/export';
      let searchCondition = this.searchCondition.filter(item => item.name != 'GJFL');
      let condition = {};
      let type = '';

      const TYPES = {
        yjgj: '',
        rxgj: 'RXGJ',
        clgj: 'CLGJ'
      };
      const SORP_PROPS = {
        yjgj: ['轨迹预警', '轨迹预警', { HDFSSJ: 'DESC' }],
        rxgj: ['人像轨迹', '人像轨迹', { HDFSSJ: 'DESC' }],
        clgj: ['车辆轨迹', '车辆轨迹', { HDFSSJ: 'DESC' }],
        wdgz: ['我的关注', '我的关注预警', { HDFSSJ: 'DESC' }]
      };
      if (this.menuActive == 'wdgz') {
        //我的关注
        url = '/v1/concern-gjxx/search';
        showExportUrl = '/v1/concern-gjxx/export';
        // condition = { name: 'SFSC', op: '=', value: '1', type: '', format: '' };
      } else if (TYPES[this.menuActive]) {
        condition = { name: 'GJFL', op: '=', value: TYPES[this.menuActive], type: '', format: '' };
        searchCondition.push(condition);
      }

      return {
        url,
        sortProps: SORP_PROPS[this.menuActive][2],
        titleExport: SORP_PROPS[this.menuActive][1],
        leftTitle: SORP_PROPS[this.menuActive][0],
        searchCondition,
        showExportUrl
      };
    }
  },
  methods: {
    init() {},
    // 导出预警轨迹
    exportYjgj() {},
    // 菜单切换事件
    changeMenu(value) {},
    // 点击卡片
    changeCard(data) {
      this.pageExpand = false;
      this.$router.push({
        name: 'yjgj-detail',
        params: {
          id: this.menuActive == 'wdgz' ? data.concernId : data.id
        }
      });
    },
    infiniteLoad(result, nodeList) {
      // 第一页
      if (result.pageNum === 1) {
        this.total = result.totalElements || 0;
        if (nodeList.length === 0) {
          // 无数据页
          this.$router.replace({
            name: 'yjgj-none'
          });
        }
      }
    },
    exportData() {
      let list = [
        {
          name: this.leftListConfig.titleExport + '列表导出.xls',
          type: 'FILE_NAME',
          format: '',
          split: '',
          display: ''
        },
        { name: 'HDFSSJ', type: 'DATE', format: 'yyyy-MM-dd HH:mm:ss', split: '', display: '发生时间' },
        { name: 'FSDXZ', type: 'CHAR', format: '', split: '', display: '活动地点' },
        { name: 'RYLB', type: 'CODE', format: 'BM_RY_RYXL', split: '', display: '人员类别' },
        { name: 'DXLX', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '对象类型' },
        { name: 'DXHM', type: 'CHAR', format: '', split: '', display: '对象信息' },
        { name: 'CLLX', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '车辆类型' },
        { name: 'XM', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'XB', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'CSRQ', type: 'AGE', format: '', split: '', display: '年龄' },
        { name: 'MZ', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'HJDQH', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '户籍地' },
        { name: 'DTXXLX', type: 'CODE', format: 'VW_BM_YWXXLX', split: '', display: '轨迹类型' },
        // { name: 'GJLY', type: 'CODE', format: 'BM_GJLY_DWJB', split: '', display: '轨迹来源' },
        { name: 'HDXGXX', type: 'CHAR', format: '', split: '', display: '轨迹描述' },
        { name: 'FSDXZ', type: 'CHAR', format: '', split: '', display: '活动地区' },
        { name: 'FSDSHCSMC', type: 'CHAR', format: '', split: '', display: '活动场所' },
        { name: 'FSDGAJGDM', type: 'CODE', format: 'BM_DEPT', split: '', display: '活动地单位' },
        { name: 'ZPXSD', type: 'CHAR', format: '', split: '', display: '相似度' }
        // ,
        // { name: 'BZXZPURL', type: 'CHAR', format: '', split: '', display: '抓拍照片' }
      ];
      nzdrApi
        .toResultExport(
          this.leftListConfig.showExportUrl,
          this.leftListConfig.sortProps,
          list,
          this.leftListConfig.searchCondition,
          this.total,
          {
            fileName: this.leftListConfig.titleExport + '列表导出.xls'
          }
        )
        .then(res => {
          console.log(res);
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.qwbk-monitor {
  .flex-1 {
    .title-text {
      font-weight: 700;
      @include mq($large) {
        font-size: 18px;
      }
      @include mq($medium) {
        font-size: 16px;
      }
      @include mq($small) {
        font-size: 14px;
      }
    }
  }
  .check-all {
    margin-right: 1rem;
  }
}
</style>
