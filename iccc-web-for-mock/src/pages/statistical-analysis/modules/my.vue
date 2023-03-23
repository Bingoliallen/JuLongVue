<!-- Created by hcg on 2021/3/3. -->
<template>
  <div class="my">
    <template v-for="item in data">
      <mine-item :item="item" :key="item.title" class="my__child"></mine-item>
    </template>
  </div>
</template>

<script>
import mineItem from './mine-item.vue';
import { EventBus } from './event-bus.js';
import tjfxApi from '@icccPath/api/tjfx';
export default {
  components: { mineItem },
  // 我的
  name: 'my',
  data() {
    return {
      mineTabVuale: 'mine_control',
      data: [],
      deployControlData: [
        {
          title: '布控中',
          key: '1',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe975;',
          color: 'rgba(108,147,255,0.20)',
          iconColor: '#6C93FF'
        },
        {
          title: '即将到期',
          key: '2',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe981;',
          color: 'rgba(255,154,66,0.20)',
          iconColor: '#FF9A42'
        },
        {
          title: '申请中',
          key: '3',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe978;',
          color: 'rgba(85,203,246,0.20)',
          iconColor: '#55CBF6'
        },
        {
          title: '申请通过',
          key: '4',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe976;',
          color: 'rgba(95,197,58,0.20)',
          iconColor: '#5FC53A'
        },
        {
          title: '审批退回',
          key: '5',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe97f;',
          color: 'rgba(255,102,102,0.20)',
          iconColor: '#FF6666'
        },
        {
          title: '未读轨迹',
          key: '6',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe980;',
          color: 'rgba(183,111,255,0.20)',
          iconColor: '#B76FFF'
        }
      ],
      examineData: [
        {
          title: '待审批',
          key: '1',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe979;',
          color: 'rgba(255,154,66,0.20)',
          iconColor: '#FF9A42'
        },
        {
          title: '已同意',
          key: '4',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe738;',
          color: 'rgba(95,197,58,0.20)',
          iconColor: '#5FC53A'
        },
        {
          title: '已退回',
          key: '5',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe97f;',
          color: 'rgba(255,102,102,0.20)',
          iconColor: '#FF6666'
        },
        {
          title: '全部审批',
          key: '4',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe977;',
          color: 'rgba(85,203,246,0.20)',
          iconColor: '#55CBF6'
        }
      ],
      collectionData: [
        {
          title: '待签收',
          key: '1',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe982;',
          color: 'rgba(255,154,66,0.20)',
          iconColor: '#FF9A42'
        },
        {
          title: '待反馈',
          key: '5',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe97d;',
          color: 'rgba(255,102,102,0.20)',
          iconColor: '#FF6666'
        },
        {
          title: '已反馈',
          key: '4',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe738;',
          color: 'rgba(95,197,58,0.20)',
          iconColor: '#5FC53A'
        },
        {
          title: '全部指令',
          key: '4',
          totalPerson: '0',
          todayNew: '0',
          icon: '&#xe97e;',
          color: 'rgba(85,203,246,0.20)',
          iconColor: '#55CBF6'
        }
      ]
    };
  },
  activated() {
    const vm = this;
    EventBus.$on('update-mine-tab', ({ value }) => {
      vm.mineTabVuale = value;
      vm.init();
    });
  },
  beforeDestroy() {
    EventBus.$off();
  },
  methods: {
    init() {
      this.mineTabVuale == 'mine_control'
        ? this.queryControlData()
        : this.mineTabVuale == 'mine_examine'
        ? this.queryExamineData()
        : this.queryCollectionData();
    },

    async queryControlData() {
      let res = await tjfxApi.getWdbk();
      let deployControlData = [...this.deployControlData];
      if (res.data) {
        if (res.data.BKZ) {
          deployControlData[0].totalPerson = res.data.BKZ.jrzs;
          deployControlData[0].todayNew = res.data.BKZ.jrzs - res.data.BKZ.zrzs;
        }
        if (res.data.JJDQ) {
          deployControlData[1].totalPerson = res.data.JJDQ.jrzs;
          deployControlData[1].todayNew = res.data.JJDQ.jrzs - res.data.JJDQ.zrzs;
        }
        if (res.data.SQZ) {
          deployControlData[2].totalPerson = res.data.SQZ.jrzs;
          deployControlData[2].todayNew = res.data.SQZ.jrzs - res.data.SQZ.zrzs;
        }
        if (res.data.SQTG) {
          deployControlData[3].totalPerson = res.data.SQTG.jrzs;
          deployControlData[3].todayNew = res.data.SQTG.jrzs - res.data.SQTG.zrzs;
        }
        if (res.data.SPTH) {
          deployControlData[4].totalPerson = res.data.SPTH.jrzs;
          deployControlData[4].todayNew = res.data.SPTH.jrzs - res.data.SPTH.zrzs;
        }
        if (res.data.WDGJ) {
          deployControlData[5].totalPerson = res.data.WDGJ.jrzs;
          deployControlData[5].todayNew = res.data.WDGJ.jrzs - res.data.WDGJ.zrzs;
        }
      }
      this.data = deployControlData;
    },
    async queryExamineData() {
      let res = await tjfxApi.getWdsp();
      let examineData = [...this.examineData];
      if (res.data) {
        if (res.data.DSP) {
          examineData[0].totalPerson = res.data.DSP.jrzs;
          examineData[0].todayNew = res.data.DSP.jrzs - res.data.DSP.zrzs;
        }
        if (res.data.YTY) {
          examineData[1].totalPerson = res.data.YTY.jrzs;
          examineData[1].todayNew = res.data.YTY.jrzs - res.data.YTY.zrzs;
        }
        if (res.data.YTH) {
          examineData[2].totalPerson = res.data.YTH.jrzs;
          examineData[2].todayNew = res.data.YTH.jrzs - res.data.YTH.zrzs;
        }
        if (res.data.QBSP) {
          examineData[3].totalPerson = res.data.QBSP.jrzs;
          examineData[3].todayNew = res.data.QBSP.jrzs - res.data.QBSP.zrzs;
        }
      }
      this.data = examineData;
    },
    async queryCollectionData() {
      let res = await tjfxApi.getWdyj();
      let collectionData = [...this.collectionData];
      if (res.data) {
        if (res.data.DQS) {
          collectionData[0].totalPerson = res.data.DQS.jrzs;
          collectionData[0].todayNew = res.data.DQS.jrzs - res.data.DQS.zrzs;
        }
        if (res.data.DFK) {
          collectionData[1].totalPerson = res.data.DFK.jrzs;
          collectionData[1].todayNew = res.data.DFK.jrzs - res.data.DFK.zrzs;
        }
        if (res.data.YFK) {
          collectionData[2].totalPerson = res.data.YFK.jrzs;
          collectionData[2].todayNew = res.data.YFK.jrzs - res.data.YFK.zrzs;
        }
        if (res.data.QBZL) {
          collectionData[3].totalPerson = res.data.QBZL.jrzs;
          collectionData[3].todayNew = res.data.QBZL.jrzs - res.data.QBZL.zrzs;
        }
      }
      this.data = collectionData;
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.my {
  display: flex;
  flex-wrap: wrap;
  margin-left: 2rem;
  height: calc(100% - 3.5rem);
  min-width: 37rem;
  margin-right: 2rem;
  justify-content: space-between;
  align-items: center;
  overflow: auto;
  &__child {
    width: 33%;
    min-width: 10rem;
  }
}
</style>
