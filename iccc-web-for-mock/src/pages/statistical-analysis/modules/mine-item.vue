<template>
  <div class="statistical-mine">
    <div class="statistical-mine__left" :style="{ 'background-color': item.color, color: item.iconColor }">
      <div>
        <span class="icon iconfont i-fontsize" v-html="item.icon"></span>
      </div>
    </div>

    <div class="statistical-mine__right">
      <span class="fontsize-title">{{ item.title }}</span>
      <span style="color: rgba(0,0,0,0.45);">
        <em class="fontsize-large" :style="{ color: item.iconColor }">{{ item.totalPerson }} </em>人
      </span>

      <span class="fontsize-small" style="color: rgba(0,0,0,0.45);">
        今日新增{{ item.todayNew >= 0 ? '+' : '' }}
        <em :style="{ color: item.iconColor }">{{ item.todayNew }}</em>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mine-item',
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          title: '布控中',
          key: '1',
          totalPerson: '399',
          todayNew: '45'
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    getRandomNumber() {
      return Math.ceil(Math.random() * 100);
    }
  }
};
</script>

<style lang="scss" scoped></style>
