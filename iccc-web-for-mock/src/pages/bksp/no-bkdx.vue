<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div ref="no-bkdx" class="right">
    <!-- <div class="title-1">新增布控对象</div> -->
    <!-- <el-divider></el-divider> -->
    <div class="add-apply__wrap">
      <div class="add-apply">
        <div class="add-apply__img"><img src="@icccPath/assets/images/common/add-result.png" alt="" /></div>
        <div class="add-apply__text">暂无布控审批数据，<a @click="$router.go(-1)">点击返回</a></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'no-bkdx',
  // 接收父页面传过来的属性
  props: {},
  beforeRouteEnter(to, from, next) {
    const fn = from.meta && from.meta.viewName;
    const tn = to.meta && to.meta.viewName;
    if (tn && tn === fn) {
      next(false);
    } else {
      next();
    }
  },
  // 页面数据绑定
  data() {
    return {};
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {},
  // 组件创建时调用
  created() {}
};
</script>
<style lang="scss" scoped>
.right {
  background: var(--background-color);
  height: 100%;
  .el-divider--horizontal {
    margin: 0;
  }
  .add-apply__wrap {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .add-apply__img {
      text-align: center;
    }
    .add-apply__text {
      margin-top: 2rem;
      text-align: center;
      font-size: 16px;
      color: var(--color-text-primary);
      line-height: 16px;
    }
  }
}
</style>
