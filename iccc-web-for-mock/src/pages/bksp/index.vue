<!-- 布控审批 -->
<template>
  <qwbk-layout
    ref="layoutRef"
    class="bksp"
    v-model="menuActive"
    :menuItems="menuItems"
    :popover-key="popoverKey"
    :leftTitle="leftListConfig.leftTitle"
    :leftListConfig="leftListConfig"
    @updateCondition="searchCondition = $event"
    @load="infiniteLoad"
    :pageExpand="pageExpand"
    :primaryKey="primaryKey"
    @pageExpand="pageExpand = $event"
    @changeCard="changeCard"
    @change="changeMenu"
  >
    <template v-slot:leftTitle>
      <div class="flex-1">
        <span class="title-text">{{ leftListConfig.leftTitle }}</span>
        <span class="bksp-num">{{ total.toLocaleString() }}个</span>
      </div>
      <el-button type="text" icon="iconfont iconl-fullscreen" title="展开" @click="pageExpand = true"></el-button>
    </template>
    <template v-if="pageExpand" v-slot:expand>
      <bksp-list
        :left-list-config.sync="leftListConfig"
        :leftTitle="leftListConfig.leftTitle"
        @changeCard="changeCard"
        @pageExpand="pageExpand = $event"
      ></bksp-list>
    </template>
    <template v-else v-slot="{ node, data }">
      <iccc-card-item :key="node.key" :data="data" card-type="bksp"></iccc-card-item>
    </template>
  </qwbk-layout>
</template>

<script>
import QwbkLayout from '@icccPath/components/qwbk-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import BkspList from './list';

export default {
  name: 'bksp',
  components: { QwbkLayout, IcccCardItem, BkspList },
  data() {
    const module = 'QZ_BKDX';
    return {
      module,
      menuItems: [
        { label: '审批任务', value: 'sprw', active: false, icon: 'iconl-Appstore' },
        { label: '待审批', value: 'dsp', active: false, icon: 'iconl-review' },
        // { label: '待审批', value: 'dsp', active: false, icon: 'iconl-review', num: 15 },
        { label: '已审批', value: 'ysp', active: false, icon: 'iconl-agree' },
        { label: '已退回', value: 'yth', active: false, icon: 'iconl-back' }
      ],
      menuActive: 'sprw',
      // 标题类型切换，ck 撤控，bk 布控，xk 续控，ydfz 移动分组
      pageType: false,
      pageExpand: false,
      popoverKey: 'CONDITIONS_SPBKDX',
      total: 0,
      searchCondition: [],
      primaryKey: 'id'
    };
  },
  computed: {
    leftListConfig() {
      let url = 'v1/spjl/search';
      let searchCondition = this.searchCondition.filter(item => item.name != 'sqzt');
      let condition = {};
      let sqzt = '';

      const TYPES = {
        dsp: '0',
        ysp: '1,2',
        yth: '2'
      };
      const config = {
        sprw: '审批任务',
        dsp: '待审批',
        ysp: '已审批',
        yth: '已退回'
      };
      const SORP_PROPS = {
        sprw: [{ SQDZT: 'ASC' }, { SQSJ: 'DESC' }],
        dsp: [{ SQSJ: 'DESC' }],
        ysp: [{ SPSJ: 'DESC' }],
        yth: [{ SPSJ: 'DESC' }]
      };

      if (TYPES[this.menuActive]) {
        searchCondition.push({ name: 'SQZT', op: 'in', value: TYPES[this.menuActive], type: '', format: '' });
      }

      return {
        url,
        leftTitle: config[this.menuActive],
        sortProps: SORP_PROPS[this.menuActive],
        searchCondition
      };
    }
  },
  methods: {
    init() {},
    // 菜单切换事件
    changeMenu(value) {},
    // 点击卡片
    changeCard(data) {
      this.pageExpand = false;
      this.$router.push({
        name: 'bksp-detail',
        params: {
          id: data.id
        }
      });
    },
    infiniteLoad(result) {
      if (result.pageNum === 1) {
        this.total = result.totalElements || 0;
      }
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.bksp {
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
