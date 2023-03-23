<template>
  <div class="bkdx-info iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <img src="" v-avatar="{ type: data.dxlx, id: data.dxhm, module: 'QZ_BKSQ' }" />
    </div>
    <div class="iccc-card-item_content">
      <div class="iccc-card-item_row">
        <span v-if="data.dxlx == '111'">{{ data.sfzh }}&nbsp;&nbsp;{{ data.xm }}</span>
        <span v-else-if="data.dxlx == 'RLZP'"
          >相似度：<span class="similarity">{{ data.zpxsd | filterPercent }}</span></span
        >
        <!--        <template v-if="data.bzhm.split('@')[0] === 'RLZP'">人像照片</template>-->
        <span v-else-if="data.dxlx === 'CPH'">{{ data.dxhm | filterCphDxhm }}</span>
        <span v-else>{{ data.dxhm }}</span>

        <i v-if="data.sfsc == '1'" class="iconfont iconf-focus"></i>
        <!-- <i v-if="!isDetail" class="iccc-card-item_unread"></i> -->
      </div>
      <div class="iccc-card-item_row iccc-card-item_main">
        <span>{{ data.fsdxz }}</span>
      </div>
      <div class="iccc-card-item_row iccc-card-item_bottom">
        <span>{{ data.xxbdsj | filterDate }}</span>
        <span :class="data.bkzt" v-code="{ code: 'BM_BKDX_HMLX', value: data.dxlx === 'CPH' ? data.cllx : data.dxlx }">
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isDetail: Boolean,
    data: Object
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.iccc-card-item {
  padding: 0.75rem 1.25rem 0.75rem 1.5rem;
  &_content {
    line-height: 1;
  }
  &_row:first-child {
    margin-bottom: 0.81rem;
  }
  &_row_left em:first-child {
    margin: 0px;
  }
  &.bkdx-detail {
    padding: 0px 1.5rem 0px 0rem;
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
