<!--
 此处填写文件描述:人员照片列表
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="card-info">
    <dg-row :gutter="10">
      <dg-col :span="20">
        <div class="u-card-layout">
          <div class="u-card-layout__item" v-for="(item, index) in info.urls" :key="index">
            <!-- arrow="hover" -->
            <carousel
              module="QZ_BKSQ"
              :isChange="false"
              :idCard="item.cardid"
              :avatarType="item.type"
              :isChangeNum="false"
              :isSuspend="true"
              isEnlarge="none"
              :isPopoverCenter="true"
              :imgStyleObject="{ width: '60px', height: '76px', margin: '0' }"
            ></carousel>
          </div>
        </div>
      </dg-col>
    </dg-row>
  </div>
</template>
<script>
import Carousel from '../carousel';

export default {
  name: 'headList',
  // 接收父页面传过来的属性
  props: {
    info: {
      type: Object,
      default() {
        return {
          title: '名称：',
          urls: []
        };
      }
    }
  },
  // 页面数据绑定
  data() {
    return {};
  },
  components: {
    Carousel
  }, // 注册局部组件
  // 计算属性
  computed: {},
  // 方法
  methods: {},
  // 组件创建时调用
  created() {}
};
</script>
<style lang="scss" scoped>
.card-info {
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  list-style: none;
  padding: 0 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > li {
    padding: 0px 0;
    font-size: 16px;
    line-height: 34px;
  }
}

.item {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  color: var(--color-text-secondary);
  text-align: right;
  line-height: 34px;
}

.u-card-layout {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  //justify-content: center;
  /*padding-left: 35px;*/
  width: 100%;

  margin-top: 0px;
  margin-bottom: 0px;
  box-sizing: border-box;
  &__item {
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    .carousel {
      margin: 0 8px 8px 0;
    }
  }
}
</style>
