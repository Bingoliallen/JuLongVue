<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info
        :info="trackInfo"
        :idCard="trackInfo.dxhm"
        :avatarType="trackInfo.dxlx"
        concernType="GJ"
        @follow-with="handleFollowWith"
        @updateSearch="$emit('updateSearch', $event)"
        @page-change="$emit('page-change', $event)"
      >
        <template v-slot:title="{ form }">
          <span class="main-label__slot">
            <span style="margin-right: 1rem" v-if="numberType == 'RLZP'">人像照片</span>
            <span style="margin-right: 1rem" v-else-if="trackInfo.dxlx === 'CPH'">{{ form.dxhm | filterCphDxhm }}</span>
            <span style="margin-right: 1rem" v-else>{{ form.dxhm }}</span>
            <span style="margin-right: 1rem" v-if="needShowName.includes(numberType)">{{ form.xm }}</span>
          </span>
        </template>
        <template v-slot:content="{ form }">
          <Content :type="dxlx" :data="form"></Content>
        </template>
      </base-info>
      <div class="detail-list-container">
        <tab-list :tabItems="tabList" v-model="tabItemShow"></tab-list>
        <div class="detail-list-container__center">
          <keep-alive>
            <cur-trajectory :track-info="trackInfo" v-if="tabItemShow === 'dqgj'"></cur-trajectory>
            <warning-trajectory
              concernId="id"
              concernType="GJ"
              url="/v1/gjxx/search"
              :bzhm="trackInfo.bzhm"
              v-if="tabItemShow === 'yjgj'"
              :sortProps="{ HDFSSJ: 'DESC' }"
            ></warning-trajectory>
          </keep-alive>
        </div>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import TabList from '@icccPath/components/tab-list/index';
import BaseInfo from '@icccPath/components/base-info/index';
import ControlAttribute from './control-attribute/index';
import ControlInformaction from './control-informaction/index';
import WarningTrajectory from '../../../warning-trajectory/index';
import CurTrajectory from './cur-trajectory/index';
import ControlLog from './control-log/index';
import Content from './components/info/content';
import { fetchTrackInfo, followWith, updateGroup } from '@icccPath/api/gjyj';

export default {
  name: 'monitor-list-detail',
  props: {
    id: String
  },
  data() {
    return {
      tempId: '',
      // 需要显示姓名的情况
      needShowName: [
        '111',
        '414',
        'GATXZ',
        'HXZ',
        'QTZJHM',
        'SJ',
        'IMES',
        'IMSI',
        'MAC',
        'WX',
        'QQ',
        'WB',
        'email',
        'QTXNSFHM',
        'YHK',
        'QTBKHM'
      ],
      isEditName: false,
      tabItemShow: 'dqgj',
      trackInfo: {},
      tabList: [
        { label: '当前轨迹', value: 'dqgj' },
        { label: '更多轨迹', value: 'yjgj' }
        // { label: '布控信息', value: 'bkxx' },
        // { label: '申请信息', value: 'sqxx' },
        // { label: '布控日志', value: 'bkrz' }
      ]
    };
  },

  components: { WarningTrajectory, CurTrajectory, TabList, BaseInfo, Content },

  watch: {
    id: {
      handler(val) {
        val && this.init();
      },
      immediate: true
    }
  },

  computed: {
    numberType() {
      return this.trackInfo.bzhm ? this.trackInfo.bzhm.split('@')[0] : '';
    },
    dxlx() {
      const DXLX = {
        '111': 'user',
        CPH: 'car',
        SJ: 'phone',
        RLZP: 'photo'
      };
      // {
      //   "111" : "身份证号",
      //   "CPH" : "车牌号",
      //   "SJ" : "手机号",
      //   "RLZP":"照片"
      // }
      return this.trackInfo.dxlx ? DXLX[this.trackInfo.dxlx] : 'user';
    }
  },
  methods: {
    init() {
      if (this.tempId === this.id) {
        return;
      }
      this.tempId = this.id;

      this.fetchTrackInfo();
    },
    async editClick() {
      this.isEditName = !this.isEditName;
      if (this.isEditName) {
        this.$nextTick(function() {
          this.$refs.myInput.focus();
        });
      } else {
        this.$refs.myInput;
        const result = await updateGroup({ groupName: this.trackInfo.szfz });
        console.log(result);
      }
    },
    async handleFollowWith(isFollow) {
      // 关注/取消关注
      const result = await followWith({ concernId: this.tempId, concernType: 'GJ' }, isFollow, 'BASE_API');
    },
    async fetchTrackInfo() {
      this.trackInfo = {};
      if (this.tempId) {
        const { data } = await fetchTrackInfo(this.tempId, 'BASE_API');
        this.trackInfo = data;
        this.trackInfo.sfgz = this.trackInfo.sfsc;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor-list-detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  flex: 1;
  .detail-list-container {
    flex: 1;
    background: var(--color-white);
    &__center {
      padding: 0rem 2rem;
    }
  }
  /deep/ .tip__attract {
    color: var(--color-danger);
  }
  /deep/ .tip__warning {
    color: var(--color-warning);
  }
}

.editGropIcon {
  /*font-size: 14px;*/
}
.iconl-edit {
  &:hover {
    color: var(--button-color-primary);
  }
}
</style>
