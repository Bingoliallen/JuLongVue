<!--
 * @Author: Liugh
 * @Date: 2020-10-27 15:04:28
 * @LastEditTime: 2020-10-30 15:02:00
 * @LastEditors: Please set LastEditors
 * @Description: 群组头像组件
-->
<template>
  <div class="group-head" :style="imgStyleObject">
    <div class="group-head-img" :class="{ 'group-head-img__empty iconfont': showImgList.length < 1 }">
      <img
        v-for="(item, index) in showImgList"
        :key="index"
        src=""
        v-avatar="{
          type: item.hmlx,
          id: item.hmnr,
          className: showImgList.length >= 0 ? 'group-head-avatar' : 'group-head-avatar__big',
          module: 'QZ_BKSQ'
        }"
      />
    </div>
  </div>
</template>

<script>
import DataOp from 'ui-jz-v4-common/src/utils/zt-data';

export default {
  name: 'groupHead', // 组件名称
  props: {
    // 接收父组件的数据
    imgStyleObject: {
      // 自定义图片Style
      type: Object,
      default() {
        return {
          width: '8.75rem',
          height: '8.75rem',
          border: '1px solid var(--border-color-extra-light)'
        };
      }
    },
    qzId: {
      // 群组ID
      type: [String, Number],
      default() {
        return '';
      }
    }
  },
  data() {
    // 组件内部参数
    return {
      showImgList: []
    };
  },
  computed: {}, // 计算属性
  watch: {
    qzId: {
      handler(value) {
        this.getMember(value);
      },
      immediate: true,
      deep: true
    }
  }, // 侦听器（扩展的计算属性）
  components: {}, // 注册局部组件
  methods: {
    getMember() {
      if (this.qzId) {
        const param = {
          sort: JSON.stringify({}),
          searchCondition: JSON.stringify({
            and: [
              {
                name: 'QZID',
                value: this.qzId,
                op: 'in',
                type: '',
                format: ''
              }
            ]
          }),
          page: 0,
          size: 4
        };
        DataOp.reqTableData({ url: '/v1/qzdx/search' }, param).then(({ data }) => {
          this.showImgList = data.content ? data.content : data;
        });
      }
    }
  }, // 内部方法
  created() {}, // 组件创建完成后
  mounted() {} // 组件挂载完成后
};
</script>
<style lang="scss" scoped>
.group-head {
  margin: auto;
  background: var(--background-color);
  &-img {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap-reverse;
  }
  &-avatar {
    position: relative;
    width: 48%;
    height: 48%;
    margin: 0.5%;
  }
  &-avatar__big {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
