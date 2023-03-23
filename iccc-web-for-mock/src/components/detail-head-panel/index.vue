<!--
 此处填写文件描述:详情头部面板
 @Author: cyp
 @Date: 2019-06-29
-->
<template>
  <div class="h-panel">
    <div class="h-panel-left">
      <el-button @click="prev" type="button" class="h-panel-arrow">
        <i class="el-icon-arrow-left"></i>
      </el-button>
    </div>
    <div class="h-panel-container">
      <div class="h-panel-main">
        <template v-if="isShowPhone">
          <carousel
            v-if="!isGroupDetail"
            class="h-panel-main_phone"
            :imgStyleObject="{ width: '8.875rem', height: '8.875rem', margin: '0', fontSize: '2rem' }"
            v-bind="$attrs"
            v-on="$listeners"
            :isChange="false"
            :isChangeNum="false"
            :isSuspend="false"
            isEnlarge="none"
          ></carousel>
          <group-head v-else v-bind="$attrs" v-on="$listeners"></group-head>
        </template>
        <div class="h-panel-main_info">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="h-panel-right">
      <el-button type="button" @click="next" class="h-panel-arrow">
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import carousel from '../carousel';
import groupHead from '../group-head';
export default {
  name: 'DetailHeadPanel',
  props: {
    isGroupDetail: {
      type: Boolean,
      default: false
    },
    isShowPhone: {
      type: Boolean,
      default: true
    },
    idKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      prevState: true, // 上一页状态
      nextState: false // 下一页状态
    };
  },
  computed: {},
  watch: {},
  components: { carousel, groupHead },
  methods: {
    /**
     * 上一页
     */
    prev() {
      this.pageChange(-1);
      // if (this.pageNum > 1) {
      //   this.pageNum--;
      //   this.pageChange(-1);
      //   this.$emit('on', this.pageNum);
      // } else {
      //   this.prevState = false;
      // }
    },
    /**
     * 下一页
     */
    next() {
      this.pageChange(1);
      // if (this.pageNum < this.total) {
      //   this.pageNum++;
      //   this.pageChange(1);
      //   this.$emit('onNext', this.pageNum);
      // } else {
      //   this.nextState = false;
      // }
    },
    pageChange(type) {
      this.$emit('page-change', {
        type,
        idKey: this.idKey,
        callback: params => {
          if (params) {
            //this.nextState = false;
            // const { data, node } = params;
          }
        }
      });
    }
  },
  created: function() {},
  mounted: function() {}
};
</script>

<style lang="scss" scoped>
.h-panel {
  display: flex;
  padding: 0.7rem 0px;
  background: var(--color-white);
  &-left,
  &-right {
    text-align: center;
    width: 4.5rem;
    min-height: 13rem;
    padding: 0px;
  }
  &-arrow {
    border: none;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 0;
    height: 2.5rem;
    width: 2.5rem;
    min-width: 2.5rem;
    background-color: var(--detail-head-panel_arrow_background);
    color: var(--detail-head-panel_arrow_color);
    padding: 0px;
    &:hover {
      color: var(--button-color-primary);
    }
  }
  &-container {
    flex: 1;
  }
  &-main {
    width: 100%;
    text-align: left;
    display: flex;
    min-height: 13rem;
    &_phone {
      margin: auto 0;
      width: 10rem;
      height: 10rem;
    }
    &_info {
      flex: 1;
      margin-left: 2.28rem;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
