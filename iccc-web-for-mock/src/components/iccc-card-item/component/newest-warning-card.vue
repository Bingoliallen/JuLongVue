<template>
  <div class="bkdx-info iccc-card-item" :class="{ 'bkdx-detail': isDetail }">
    <div v-if="index + 1 > 0" class="iccc-card-item_sort" :data-type="index + 1">
      <span>{{ index + 1 }}</span>
    </div>
    <div class="iccc-card-item_img" :class="{ 'iccc-card-item_plan': isDetail }">
      <img src="" v-avatar="{ type: data.dxlx, id: data.sfzh, module: 'QZ_BKSQ' }" />
    </div>
    <div class="iccc-card-item_content">
      <div class="label">
        <div class="iccc-card-item_row">
          <span v-if="data.dxlx == '111'">{{ data.sfzh }}&nbsp;&nbsp;{{ data.xm }}</span>
          <span v-else-if="data.dxlx == 'RLZP'"
            >相似度：<span class="similarity">{{ data.zpxsd ? data.zpxsd : 0 }}%</span></span
          >
          <span v-else>{{ data.dxhm }}</span>
          <!-- <i v-if="data.sfsc == '1'" class="iconfont iconf-focus"></i> -->
        </div>
        <dg-tag class="tiptag" data-type="1" custom-color>
          <span class="tiptext" v-code="{ code: 'BM_YJJB', value: '1', module: '' }"></span>
        </dg-tag>
        <!-- <span v-if="data.dxlx == 'RLZP'" v-else class="tiptext">-</span> -->
      </div>

      <div class="iccc-card-item_row iccc-card-item_main">
        <span>{{ data.fsdxz }}</span>
      </div>
      <div class="label">
        <div class="iccc-card-item_row iccc-card-item_bottom">
          <span>{{ data.xxbdsj | filterDate }}</span>
          <!-- <span :class="data.bkzt" v-code="{ code: 'BM_BKDX_HMLX', value: data.bzhm.split('@')[0] }"> </span> -->
        </div>
        <div class="tag" ref="tag" :title="tagListTest">
          <dg-tag v-for="(tag, index) in tagList" :size="tagSize" custom-color :color="tag.color" :key="index">{{
            tag.label
          }}</dg-tag>
          <dg-tag :size="tagSize" v-if="tagHiddenLength" class="tag-disable">+{{ tagHiddenLength }}</dg-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isDetail: Boolean,
    index: Number,
    data: Object
  },
  data() {
    return {
      // 参数名称及默认值
      tagSize: 'small',
      tagHiddenLength: 0,
      tagShowLength: 4,
      JTAG: [
        { label: '稳', color: '#FF6666' },
        { label: '赌', color: '#6C93FF' },
        { label: '毒', color: '#B76FFF' },
        { label: '疆', color: '#CCCCCC' },
        { label: '黄', color: '#FF6666' }
      ]
    };
  },
  computed: {
    /**
     * @description:处理标签超出问题
     */
    tagList() {
      if (this.tagShowLength) {
        return this.JTAG.slice(0, this.tagShowLength);
      } else {
        return this.JTAG;
      }
    },
    /**
     * @description:处理标签超出问题
     */
    tagListTest() {
      let listText = this.JTAG
        ? this.JTAG.map(item => {
            return item.label;
          })
        : '';
      return listText.toString();
    }
  },
  methods: {
    init() {
      // this.tagHiddenLength = this.JTAG.length - this.tagShowLength;
    }
  },
  created() {
    this.init();
  } // 组件创建完成后
};
</script>

<style lang="scss" scoped>
.iccc-card-item {
   padding: 0.75rem 1.5rem 0.75rem 1.5rem !important;
 
  @include mq($small) {
     padding: 0.75rem 1rem 0.75rem 1rem !important;
  }
  &_sort {
    width: 1.375rem;
    height: 1.375rem;
    background: #97bdff;
    border-radius: 2px;
    border-radius: 2px;

    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-family: MicrosoftYaHei;
      font-size: 0.875rem;
      color: var(--color-white);
    }
    &[data-type='1'] {
      background: #ff6666;
    }
    &[data-type='2'] {
      background: #ff9a42;
    }
    &[data-type='3'] {
      background: #ff9a42;
    }
    @include mq($large) {
      margin-right: 1.25rem;
    }
    @include mq($medium) {
      margin-right: 1rem;
    }
    @include mq($small) {
      margin-right: 0.5rem;
    }
  }
  &_content {
    line-height: 1;
  }
  &_row:first-child {
    // margin-bottom: 0.81rem;
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
    margin: 0.625rem 0;
  }
  &_bottom {
    font-size: 0.75rem;
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

  .label {
    margin-top: 0.375rem;
    display: flex;
    position: relative;
    font-size: 0.875rem;
    color: var(--color-text-primary);
    align-items: center;
    justify-content: space-between;
    > .tip {
      position: absolute;
      // right: -4px;
      // top: -4px;
      right: 1.2rem;
      border-radius: 50%;
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      &.primary {
        background: var(--color-primary);
      }
      &.danger {
        background: var(--color-danger);
      }
      &.warning {
        background: var(--earlywarning_background_orange);
      }
      &.warninglevel {
        background: var(--earlywarning_background_yellow);
      }
    }
    > .tiptext {
      width: 0.875rem;
      height: 1.125rem;
      overflow: hidden;
      position: absolute;
      right: -3px;
      display: block;
      color: var(--color-text-regular);
    }
    .tiptag {
      padding: 0 0.625rem;
      &[data-type='1'] {
        color: var(--color-danger);
        border-color: var(--color-danger);
      }
      &[data-type='2'] {
        color: var(--earlywarning_background_orange);
        border-color: var(--earlywarning_background_orange);
      }
      &[data-type='4'] {
        color: var(--earlywarning_background_yellow);
        border-color: var(--earlywarning_background_yellow);
      }
      &[data-type='5'] {
        color: var(--color-primary);
        border-color: var(--color-primary);
      }
    }
    .acquaintance {
      font-size: 0.875rem;
      color: var(--color-danger);
    }
  }
  .tag {
    display: flex;
    align-items: center;
    overflow: hidden;
    .el-tag + .el-tag {
      margin-left: 0.375rem;
    }
    .el-tag {
      height: auto;
      line-height: normal;
      padding: 0 0.1875rem;
    }
    .tag-disable {
      margin-right: 0px;
      color: var(--color-text-regular);
      border: 1px solid var(--color-text-placeholder);
    }
  }
}
</style>
