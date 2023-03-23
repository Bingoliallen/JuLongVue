<template>
  <div v-if="componentId === 'bkdx-add'" class="bkdx-add-item iccc-card-item active">
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <img src="@icccPath/assets/images/icon/default-avatar-ry.png" alt="" />
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span>正在添加布控对象中</span>
      </div>
    </div>
  </div>
  <div v-else-if="componentId === 'bkdx'" class="iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <dg-badge v-if="!isDetail" :value="data.WARING_NUM" :max="99" :hidden="!data.WARING_NUM">
        <img src="" alt="" v-avatar="{ type: data.hmlx, id: data.hmnr, module: 'QZ_BKSQ' }" />
      </dg-badge>
      <img v-else src="" alt="" v-avatar="{ type: data.hmlx, id: data.hmnr, module: 'QZ_BKSQ' }" />
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <template v-if="data.hmlx === 'RLZP'">人像照片</template>
        <span v-else>
          <template v-if="data.hmlxzh">
            <span class="hmlxzh" v-code="{ code: 'BM_BKDX_HMLX', value: data.hmlxzh, showTitle: true }"></span
            >：</template
          ><span :title="data.hmnr">{{ data.hmnr }}{{ ' ' + (data.xm || '') }}</span>
        </span>
        <i v-if="data.sfgz" class="iconfont iconf-focus"></i>
      </div>
      <div class="iccc-card-item_row">
        <span>{{ data.bksj | filterDate }}</span>
        <span class="icon-bkzt" :data-type="data.bkzt" v-code="{ code: 'BM_BKDX_BKZT', value: data.bkzt }"></span>
      </div>
    </div>
  </div>
  <div v-else-if="componentId === 'fz'" class="iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <dg-badge v-if="!isDetail" :value="data.WARING_NUM" :max="99">
        <group-head
          :qz-id="data.qzid"
          :key="data.qzid"
          :imgStyleObject="{ width: 'calc(4.75rem - 2px)', height: 'calc(4.75rem - 2px)' }"
        ></group-head>
      </dg-badge>
      <group-head
        v-else
        :qz-id="data.qzid"
        :key="data.qzid"
        :imgStyleObject="{ width: '4.75rem', height: '4.75rem' }"
      ></group-head>
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span>{{ data.qzmc | filterText }}</span>
        <i v-if="data.sfgz" class="iconfont iconf-focus"></i>
      </div>
      <div class="iccc-card-item_row">
        <span>{{ data.cjsj | filterDate }}</span>
        <!--<span class="icon-bkzt" :data-type="data.bkzt" v-code="{ code: 'BM_BKDX_BKZT', value: data.bkzt }"></span>-->
      </div>
    </div>
  </div>
  <div v-else-if="componentId === 'bkdx-detail'" class="iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <img src="" alt="" v-avatar="{ type: data.hmlx, id: data.hmnr, module: 'QZ_BKSQ' }" />
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <template v-if="data.hmlx === 'RLZP'">人像照片</template>
        <span v-else>{{ data.hmnr | filterText }}&nbsp;{{ data.xm || '' }}</span>
        <i v-if="data.sfgz" class="iconfont iconf-focus"></i>
      </div>
      <div class="iccc-card-item_row">
        <span>{{ data.bksj | filterDate }}</span>
        <span class="icon-bkzt" :data-type="data.bkzt" v-code="{ code: 'BM_BKDX_BKZT', value: data.bkzt }"></span>
      </div>
    </div>
  </div>
  <!-- 布控审批左侧列表 -->
  <div v-else-if="componentId === 'bksp'" class="bksp-item iccc-card-item" :class="{ 'rwd-detail': isDetail }">
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span :title="data.sqrxm"><span class="iccc-card-item_label">申请人</span>：{{ data.sqrxm | filterText }}</span>
        <dg-tag class="icon-splb" :data-type="data.bklx" size="mini" effect="plain">
          <span v-code="{ code: 'BM_BKSQ_BKLX', value: data.bklx }"></span>
        </dg-tag>
      </div>
      <div class="iccc-card-item_row">
        <span :title="data.sqdwmc"
          ><span class="iccc-card-item_label">申请单位</span>：{{ data.sqdwmc | filterText }}</span
        >
      </div>
      <div class="iccc-card-item_row iccc-card-item_time">
        <span><span class="iccc-card-item_label">申请时间</span>：{{ data.sqsj | filterDate }}</span>
        <span class="icon-splb-spzt" :data-type="data.sqzt" v-code="{ code: 'BM_BKSQ_SQZT', value: data.sqzt }"></span>
      </div>
    </div>
  </div>
  <!-- 申请任务单左侧列表 -->
  <div
    v-else-if="componentId === 'bksp-task'"
    class="bksp-task-item iccc-card-item"
    :class="{ 'rwd-detail': isDetail }"
  >
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span :title="data.sqrxm"><span class="iccc-card-item_label">申请人</span>：{{ data.sqrxm | filterText }}</span>
        <dg-tag class="icon-splb" :data-type="data.bklx" size="mini" effect="plain">
          <span v-code="{ code: 'BM_BKSQ_BKLX', value: data.bklx }"></span>
        </dg-tag>
      </div>
      <div class="iccc-card-item_row">
        <span :title="data.sqdwmc"
          ><span class="iccc-card-item_label">申请单位</span>：{{ data.sqdwmc | filterText }}</span
        >
      </div>
      <div class="iccc-card-item_row iccc-card-item_time">
        <span><span class="iccc-card-item_label">申请时间</span>：{{ data.sqsj | filterDate }}</span>
        <span
          class="icon-splb-spzt"
          :data-type="data.sqdzt"
          v-code="{ code: 'BM_BKSQ_SQDZT', value: data.sqdzt }"
        ></span>
      </div>
    </div>
  </div>
  <!-- 停控申请单左侧列表 -->
  <div
    v-else-if="componentId === 'bkdx-tksqd'"
    class="bksp-task-item iccc-card-item"
    :class="{ 'rwd-detail': isDetail }"
  >
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span :title="data.sqrxm"><span class="iccc-card-item_label">申请人</span>：{{ data.sqrxm | filterText }}</span>
        <dg-tag class="icon-splb" :data-type="data.bklx" size="mini" effect="plain">
          <span v-code="{ code: 'BM_BKSQ_BKLX', value: data.bklx }"></span>
        </dg-tag>
      </div>
      <div class="iccc-card-item_row">
        <span :title="data.sqdwmc"
          ><span class="iccc-card-item_label">申请单位</span>：{{ data.sqdwmc | filterText }}</span
        >
      </div>
      <div class="iccc-card-item_row iccc-card-item_time">
        <span><span class="iccc-card-item_label">申请时间</span>：{{ data.sqsj | filterDate }}</span>
        <span
          class="icon-splb-spzt"
          :data-type="data.sqdzt"
          v-code="{ code: 'BM_BKSQ_SQDZT', value: data.sqdzt }"
        ></span>
      </div>
    </div>
  </div>
  <!-- 预警轨迹左侧列表 -->
  <gjyj-card v-else-if="componentId === 'bkdx-info'" :data="data" :is-detail="isDetail"></gjyj-card>
  <newest-warning-card
    v-else-if="componentId === 'newest-warning'"
    :data="data"
    :is-detail="isDetail"
    :index="index"
  ></newest-warning-card>

  <div v-else-if="componentId === 'bkdx-zdry'" class="iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div class="iccc-card-item_img">
      <!--第一阶段统计数隐藏--->
      <dg-badge v-if="!isDetail">
        <img src="" alt="" v-avatar="{ type: data.hmlx, id: data.sfzh, module: 'QZ_BKSQ' }" />
      </dg-badge>
      <img v-else src="" alt="" v-avatar="{ type: data.hmlx, id: data.sfzh, module: 'QZ_BKSQ' }" />
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <div>
          <span>{{ data.sfzh | filterText }}</span>
          <dg-tag v-if="data.tkzt + '' === '1'" type="primary" size="small">
            <span v-code="{ code: BM_BKSQ_TKZT, value: data.tkzt }"></span>
          </dg-tag>
        </div>
        <i v-if="data.sfgz == '1'" class="iconfont iconf-focus"></i>
      </div>
      <div class="iccc-card-item_row">
        <div class="iccc-card-item_row_left">
          {{ data.xm | filterText }}
          <em v-code="{ code: 'BM_XB0000', value: data.xb }" class="margin"></em>
          <em>{{ $tool.showYear(data.sfzh) | filterText }}岁</em>
          <em v-code="{ code: 'BM_MZ0000', value: data.mz }"></em>
        </div>
        <span class="icon-gzzt" :data-type="data.yxx" v-code="{ code: 'BM_ZDRYXX', value: data.yxx }"></span>
      </div>
    </div>
  </div>
</template>

<script>
import GjyjCard from './component/gjyj-card.vue';
import NewestWarningCard from './component/newest-warning-card.vue';

import { getRyxmBySfzh } from '@icccPath/api/bkdx/qjdxryxx';
import groupHead from '../group-head';
import { BM_BKSQ_TKZT } from '@icccPath/common/constant';

export default {
  name: 'iccc-card-item',
  props: {
    data: {
      type: Object,
      default() {
        return { _NONE_DATA: true };
      }
    },
    index: Number,
    // 是否是展开详情列表，区分未展开左侧列表
    isDetail: Boolean,
    // 卡片类型
    cardType: String
  },
  data() {
    return { BM_BKSQ_TKZT, unWatchFn: false };
  },
  components: { GjyjCard, groupHead, NewestWarningCard },
  computed: {
    groupHeads() {
      return this.data.sqdxs.map(item => item.bkdxhm);
    },
    avatarType() {
      return this.$tool.bkdxHmlxToIcon(this.data && this.data.hmlx);
    },
    componentId() {
      if (this.data._NONE_DATA && this.$route.name === 'monitor-apply' && !this.$route.query.id) {
        return 'bkdx-add';
      }
      // let type = this.data.type;
      let type = this.cardType;
      if (!type) {
        type = this.avatarType;
      }

      // 根据 type 区分
      switch (type) {
        case 'ry':
        case 'zp':
        case 'cl':
        case 'sj':
        case 'wx':
        case 'qq':
        case 'RYBK':
        case 'CLBK':
        case 'SJBK':
        case 'XNSFBK':
          return 'bkdx';
        case 'fz':
          return 'fz';
        case 'bksp':
          return 'bksp';
        case 'task':
          return 'bksp-task';
        case 'track':
          return 'bkdx-info';
        case 'newest':
          return 'newest-warning';
        case 'zdry':
          return 'bkdx-zdry';
        case 'tksqd':
          return 'bkdx-tksqd';
        case 'bkdxlist':
          return 'bkdx-detail';

        default:
          return 'bkdx';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.iccc-card-item {
  padding: 0.75rem 1.25rem 0.75rem 1.5rem;
  &_img {
    margin-right: 1em;
  }
  &_content {
    line-height: 1;
    margin: 0;
  }
  &_row:first-child {
    margin-bottom: 0.83rem;
    .hmlxzh {
      @include text-ellipsis(5em);
    }
  }
  &_label {
    display: inline-block;
    margin: 0;
    width: 4.375em;
    text-align: justify;
    text-align-last: justify;
    text-justify: distribute-all-lines; // 兼容ie浏览器
  }
  &.bksp-item,
  &.bksp-task-item {
    .icon-splb {
      padding: 0 0.5em;
      :first-child {
        margin: 0;
      }
      margin: 0;
      text-align: center;
      color: var(--color-text-primary);
      background-color: var(--color-white);
      &[data-type='0'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
      &[data-type='10'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
      &[data-type='20'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
      &[data-type='4'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
      &[data-type='30'] {
        color: var(--color-success);
        border-color: var(--color-success);
      }
      &[data-type='1'] {
        color: var(--color-success);
        border-color: var(--color-success);
      }
      &[data-type='11'] {
        color: var(--color-success);
        border-color: var(--color-success);
      }
      &[data-type='21'] {
        color: var(--color-success);
        border-color: var(--color-success);
      }
      &[data-type='3'] {
        color: var(--color-success);
        border-color: var(--color-success);
      }
      &[data-type='2'] {
        color: var(--color-warning);
        border-color: var(--color-warning);
      }
      &[data-type='12'] {
        color: var(--color-warning);
        border-color: var(--color-warning);
      }
      &[data-type='22'] {
        color: var(--color-warning);
        border-color: var(--color-warning);
      }
      &[data-type='32'] {
        color: var(--color-warning);
        border-color: var(--color-warning);
      }
      &[data-type='02'] {
        color: var(--color-text-regular);
        border-color: var(--color-text-regular);
      }
      &[data-type='31'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
    }
    .iccc-card-item {
      &_row {
        font-size: 14px;
      }
      &_row:not(:last-child) {
        margin-bottom: 0.83rem;
      }
      &_time {
        font-size: 12px;
        color: var(--color-text-regular);
      }
    }
  }
  &_row_left em:first-child {
    margin: 0px;
  }
  &.bkdx-detail,
  &.rwd-detail {
    padding: 0.75rem 1.25rem 0.75rem 2.2rem;
    cursor: pointer;
    border: 1px solid var(--border-color-base);
    &:hover {
      background-color: transparent;
      border-color: var(--button-color-primary);
    }
    .iccc-card-item_img {
      border: none;
    }
  }
  &.bkdx-detail {
    padding: 0px 1.5rem 0px 0rem;
  }
  .similarity {
    color: var(--color-danger);
  }
  &_unread {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-danger);
  }
  &_main {
    margin: 2px 0;
  }
  &_bottom {
    font-size: 12px;
    color: var(--color-text-regular);
  }
  &_tag {
    &.orange {
      color: var(--color-warning);
    }
    &.green {
      color: var(--color-success);
    }
    &.red {
      color: var(--color-danger);
    }
  }
}
</style>
