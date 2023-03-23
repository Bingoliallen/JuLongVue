<!--
 * @Author: Liugh
 * @Date: 2020-10-27 09:24:43
 * @LastEditTime: 2021-01-08 11:15:45
 * @LastEditors: Do not edit
 * @Description: 时间线
-->
<template>
  <div class="time-line">
    <infinite-scroll
      v-if="leftListConfig.url"
      v-bind="$attrs"
      class="left-scroll-item__container"
      ref="scroll"
      v-model="scrollModel"
      :url="leftListConfig.url"
      :searchCondition="leftListConfig.searchCondition"
      :sortProps="leftListConfig.sort"
      :module="leftListConfig.module"
      @load="infiniteLoad"
    >
      <template v-slot:prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-slot:list="{ list }">
        <ul class="time-line-ul">
          <slot name="list" :list="list">
            <!-- 以下是插槽模版 -->
            <li class="time-line-ul__li" v-for="(item, index) in list" :key="index">
              <div class="time-line-ul__li__part">
                <time class="time-line-ul__li__time">{{ item.value }}</time>
                <div class="time-line-ul__li__cut">
                  <div
                    :class="[
                      'time-line-ul__li__cut__dot',
                      item.type == 'warning' ? 'warning' : item.type == 'danger' ? 'danger' : ''
                    ]"
                  ></div>
                  <div class="time-line-ul__li__cut__tail" v-if="index != list.length - 1"></div>
                </div>
              </div>
              <div class="time-line-ul__li__content">
                <div class="time-line-ul__li__content__title">
                  <span
                    :class="[
                      'time-line-ul__li__content__tag',
                      item.type == 'warning' ? 'warning' : item.type == 'danger' ? 'danger' : ''
                    ]"
                    >{{ item.tag }}</span
                  >
                  <span class="time-line-ul__li__content__name">{{ item.label }}</span>
                </div>
                <div class="time-line-ul__li__content__text">
                  {{ item.center }}
                </div>
              </div>
            </li>
          </slot>
        </ul>
      </template>
      <template v-slot="row">
        <slot v-bind="row"></slot>
      </template>
    </infinite-scroll>
  </div>
</template>

<script>
export default {
  name: 'time-line', // 组件名称
  props: {
    // 接收父组件的数据
    leftListConfig: {
      type: Object,
      default() {
        return {
          module: 'SCENES_MOCK',
          url: '/table-page/warningnew'
        };
      }
    },
    dataFilter: Boolean
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      scrollModel: ''
    };
  },
  computed: {}, // 计算属性
  watch: {}, // 侦听器（扩展的计算属性）
  components: {}, // 注册局部组件
  methods: {
    /**
     * @description:无限滚动的初始化数据回调
     * @param {Object} result 接口返回
     * @param {Array} nodeList 数据数组
     * @return {void}
     */
    // eslint-disable-next-line no-unused-vars
    infiniteLoad(result, nodeList) {
      this.$emit('load', result, nodeList);
    },
    search(searchCondition) {
      this.$emit('updateCondition', searchCondition);
      const instance = this.$refs.scroll;
      if (instance) {
        instance.init();
      } else {
        this.$emit('search');
      }
    }
  }, // 内部方法
  beforeCreate() {}, // 组件创建前
  created() {}, // 组件创建完成后
  beforeMount() {}, // 组件挂载前
  mounted() {}, // 组件挂载完成后
  beforeUpdate() {}, // 组件更新前
  updated() {}, // 组件挂载完成后
  beforeDestroy() {}, // 组件销毁前
  destroyed() {} // 组件销毁完成后
};
</script>
<style lang="scss" scoped>
.time-line {
  position: absolute;
  height: calc(100% - 25rem);
  width: calc(100% - 4rem);
  /deep/ &-ul {
    padding: 1.5rem 0;
    &__li {
      position: relative;
      display: flex;
      min-height: 110px;
      &__part {
        display: flex;
      }
      &__time {
        display: inline-block;
        width: 80px;
        text-align: right;
        font-size: 14px;
        color: var(--color-text-regular);
      }
      &__cut {
        text-align: center;
        margin: 3px 17px 0 17px;
        &__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--button-color-primary);
          &.warning {
            background-color: var(--color-warning);
          }
          &.danger {
            background-color: var(--color-danger);
          }
        }
        &__tail {
          height: 100%;
          width: 2px;
          margin: 0 auto;
          background: var(--time-line_ul-li-cut-tail_background);
        }
      }
      &__content {
        &__tag {
          padding: 3px 12px;
          border: 1px solid var(--button-color-primary);
          border-radius: 2px;
          font-size: 12px;
          color: var(--button-color-primary);
          line-height: 12px;
          &.warning {
            border: 1px solid var(--color-warning);
            color: var(--color-warning);
          }
          &.danger {
            border: 1px solid var(--color-danger);
            color: var(--color-danger);
          }
        }
        &__name {
          margin-left: 10px;
          font-size: 14px;
          color: var(--color-text-primary);
        }
        &__text {
          margin-top: 15px;
          font-size: 14px;
          color: var(--color-text-regular);
          line-height: 21px;
        }
      }
    }
  }
  .base-line {
    .el-divider__text {
      font-size: 14px;
      color: var(--color-text-placeholder);
      text-align: center;
    }
  }
}
/deep/ .no-record__wrap.infinite-list__empty {
  height: 100% !important;
}
</style>
