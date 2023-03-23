<template>
  <div
    class="scale-img"
    ref="suspend-img-wrapper"
    :style="{ width: boxWidth, height: boxHeight }"
    @mousewheel.prevent="rollImg"
  >
    <el-image ref="imgDiv" class="img" :class="{ 'img__error': isError }" :src="imgSrc" @mousedown="move" @error="imageLoadFailed">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</template>
<script>
export default {
  name: 'scale-img',
  props: {
    imgSrc: {
      type: String,
      default: ''
    },
    boxWidth: {
      type: String,
      default: '100%'
    },
    boxHeight: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      // 图片加载失败
      isError: false
    };
  },
  watch: {
    imgSrc: {
      handler(val) {
        if (val) {
          this.isError = false;
        }
      }
    }
  },
  methods: {
    // 移动图片
    move(e) {
      e.preventDefault();
      var wrapper = this.$refs['suspend-img-wrapper'];
      var img = this.$refs.imgDiv.$el;
      var x = e.pageX - img.offsetLeft;
      var y = e.pageY - img.offsetTop;
      // 添加鼠标移动事件
      wrapper.addEventListener('mousemove', move);

      function move(e) {
        img.style.left = (e.pageX - x) / 16 + 'rem';
        img.style.top = (e.pageY - y) / 16 + 'rem';
      }
      img.addEventListener('mouseup', function() {
        wrapper.removeEventListener('mousemove', move);
      });
      wrapper.addEventListener('mouseout', function() {
        wrapper.removeEventListener('mousemove', move);
      });
    },
    // 缩放图片
    rollImg() {
      var zoom = parseInt(this.$refs.imgDiv.$el.style.zoom) || 100;
      zoom += event.wheelDelta / 12;
      if (zoom >= 80 && zoom < 500) {
        this.$refs.imgDiv.$el.style.zoom = zoom + '%';
      }
      return false;
    },
    // 加载图片失败
    imageLoadFailed() {
      console.log('加载图片失败!');
      this.isError = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.scale-img {
  position: relative;
  overflow: hidden;

  .img {
    position: absolute;
    top: 0;
    left: 0;
    cursor: move;
    &__error {
      font-size: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
}
</style>
