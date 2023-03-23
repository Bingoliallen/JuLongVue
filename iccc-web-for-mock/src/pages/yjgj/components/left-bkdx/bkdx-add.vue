<template>
  <div class="bkdx-add bkdx-item active">
    <div class="bkdx-item_img">
      <img src="@icccPath/assets/images/icon/default-avatar-ry.png" alt="" />
    </div>
    <div class="bkdx-item_content">
      <div class="bkdx-item_row">
        <span>正在添加布控对象中</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bkdx-add',
  props: {
    data: Object
  }
};
</script>
