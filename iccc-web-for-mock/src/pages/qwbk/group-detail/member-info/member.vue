<template>
  <div class="member">
    <div class="avatar" :class="{ 'no-avatar': noAvatar, checked: info.checked }">
      <carousel
        class="member__avatar"
        module="QZ_BKSQ"
        :isChange="false"
        :isSuspend="false"
        isEnlarge="none"
        :isImgId="true"
        :idCard="info.hmnr"
        :avatarType="info.hmlx"
        :isChangeNum="false"
        imgKey="url"
        :imgStyleObject="imgStyleObject"
      >
      </carousel>
      <div v-if="info.hmlx === 'RLZP'" class="name">人像照片</div>
      <div v-else class="name" v-name="{ type: info.hmlx, value: info.hmnr, emptyText: '未知' }"></div>
    </div>
  </div>
</template>

<script>
import carousel from '@icccPath/components/carousel';
export default {
  name: 'member',
  components: {
    carousel
  },
  props: {
    showCheckbox: Boolean,
    info: Object
  },
  data() {
    return {
      noAvatar: false,
      imgStyleObject: {
        width: '5.625rem',
        height: '5.625rem',
        fontSize: '1.8rem'
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.member {
  &__avatar {
    margin: 0px;
    /deep/.el-carousel {
      margin: 0px !important;
      &:active,
      &:hover {
        border: 1px solid var(--color-primary);
        box-shadow: 0 0.1875rem 1.66rem 0 var(--box-shadow);
        color: var(--color-primary);
      }
    }
  }
  .name {
    height: 2.125rem;
    line-height: 2.125rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
