<template>
  <div class="statistical-summary">
    <div class="statistical-summary-item">
      <total-card title="布控对象总数" icon="pic_bk" :modelData="bkqkgy.BKDX"></total-card>
      <total-card title="比中轨迹总数" unit="条" icon="pic_gj" :modelData="bkqkgy.BZGJ"></total-card>
    </div>
    <div class="statistical-summary-item">
      <total-card title="联控对象总数" icon="pic_lk" :modelData="bkqkgy.LKDX"></total-card>
      <total-card title="预警指令总数" unit="条" icon="pic_zl" :modelData="bkqkgy.YJZL"></total-card>
    </div>
  </div>
</template>

<script>
import TotalCard from './total-card';
import tjfxApi from '@icccPath/api/tjfx';

export default {
  // 统计摘要
  name: 'statistical-summary',
  data() {
    return {
      bkqkgy: {
        BKDX: { hbs: '0', jrzs: '0', zrzs: '0' },
        BZGJ: { hbs: '0', jrzs: '0', zrzs: '0' },
        LKDX: { hbs: '0', jrzs: '0', zrzs: '0' },
        YJZL: { hbs: '0', jrzs: '0', zrzs: '0' }
      }
    };
  },
  components: {
    TotalCard
  },
  methods: {
    init() {
      tjfxApi.getBkqkgy().then(res => {
        if (res.data) {
          this.bkqkgy=res.data;
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.statistical-summary {
  width: 100%;
  height: calc(100% - 5.5rem);
  margin-top: 2rem;
  &-item {
    display: flex;
    flex: 1;
    margin-bottom: 2rem;
    margin-left: 2rem;
  }
}
</style>
