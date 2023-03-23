<template>
  <warning-layout
    class="qwbk-monitor"
    primary-key="id"
    :leftListConfig="leftListConfig"
    @updateCondition="searchCondition = $event"
    @load="infiniteLoad"
    @changeCard="changeCard"
  >
    <template v-slot="{ node, data, index }">
      <iccc-card-item :key="node.key" :data="data" cardType="newest" :index="isTop ? index : -1"></iccc-card-item>
    </template>
  </warning-layout>
</template>

<script>
import WarningLayout from './warning-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
export default {
  // 活跃对象
  name: 'active-object',
  components: { WarningLayout, IcccCardItem },
  props: {
    isTop: Boolean,
    url: String
  },
  data() {
    return {
      total: 0,
      searchCondition: []
    };
  },
  computed: {
    leftListConfig() {
      let url = this.url;
      let searchCondition = this.searchCondition.filter(item => item.name != 'GJFL');
      let condition = {};
     
      return {
        url,
        sortProps: { HDFSSJ: 'DESC' },
        searchCondition
      };
    }
  },
  methods: {
    init() {},
    // 点击卡片
    changeCard(data) {},
    infiniteLoad(result, nodeList) {
      // 第一页
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
