<template>
  <div class="icon-word-box">
    <div :style="{ background: item.iconBackground }" class="icon">
      <i :class="item.icon"></i>
    </div>

    <div class="word">
      <div class="title">{{ item.title }}</div>
      <div class="subTitle">{{ item.subTitle }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          icon: String,
          title: String,
          subTitle: String,
          iconBackground: String
        };
      }
    }
  }
};
</script>
