<!--
 * @Author: Liugh
 * @Date: 2020-06-29 10:13:30
 * @LastEditTime: 2020-11-09 13:29:24
 * @LastEditors: Please set LastEditors
 * @Description: 头像组件
-->
<template>
  <div class="carousel" v-enlarge="isEnlarge">
    <div class="carousel__button" @click="prevAndNext('prev')" v-if="isChange">
      <i class="icon iconl-left"></i>
    </div>
    <dg-badge class="dg-message" :value="messageNumber" :id="generateKey">
      <el-carousel
        :style="imgStyleObject"
        ref="carousel"
        v-bind="$attrs"
        :arrow="arrow"
        :indicator-position="indicatorPosition"
        :initial-index="index"
        :autoplay="autoplay"
        @change="carouselChange"
      >
        <el-carousel-item v-for="(item, index) in imageList" :key="index">
          <div :class="['item', isSuspend ? 'hover' : '']" @click="mouseOver">
            <div class="superscript" v-if="imgKey && superFlag ? item[superFlag] : item && isSuper">
              <slot name="superscript">
                <i class="icon iconf-circle-check"></i>
              </slot>
            </div>
            <div class="tip" v-if="isTip">
              <slot name="tip"> </slot>
            </div>
            <img
              :src="imgKey && imageList.length ? item[imgKey] : item"
              :class="iconType"
              :style="{ fontSize: imgStyleObject.fontSize }"
              ref="img"
            />
          </div>
        </el-carousel-item>
        <div class="shadowNum" v-if="isChangeNum && isChangeNum">{{ index + 1 }}/{{ imageList.length }}</div>
        <div
          v-if="isSuspend"
          :class="['position', isPopoverCenter ? 'comparison-img-box' : '']"
          @mouseleave="mouseLeaveSuspend"
          :style="[{ display: coordinate.display }, imgStyleSuspend]"
        >
          <slot name="suspend" :imgSrc="imgKey && imageList.length ? imageList[index][imgKey] : imageList[index]">
            <img
              :src="imgKey && imageList.length ? imageList[index][imgKey] : imageList[index]"
              :class="iconType"
              :style="{ fontSize: imgStyleObject.fontSize }"
            />
          </slot>
        </div>
      </el-carousel>
    </dg-badge>
    <div class="carousel__button" @click="prevAndNext('next')" v-if="isChange">
      <i class="icon iconl-right"></i>
    </div>
  </div>
</template>
<script>
const { getSetting } = window.systemParamsUtils;
const filterPath = function(the) {
  let module = the.$attrs.module ? the.$attrs.module : 'BASE_API';
  let modulePath = getSetting(module);
  return modulePath;
};

import { zpfwShowZp } from '@icccPath/api/common';
import { generateKey } from '@icccPath/utils/tool';

export default {
  name: 'carousel', // 组件名称
  props: {
    // 接收父组件的数据
    imgKey: {
      // 图片显示的key值
      type: String,
      default: 'url'
    },
    // 对象类别
    avatarType: {
      type: String,
      default: '111'
    },
    isChange: {
      // 是否需要自定义切换
      type: Boolean,
      default: true
    },
    isChangeNum: {
      // 是否需要显示张数
      type: Boolean,
      default: true
    },
    isSuspend: {
      // 是否需要悬浮放大图片
      type: Boolean,
      default: false
    },
    isSuspendBody: {
      // 是否需要悬浮放大图片放大图片在body中
      type: Boolean,
      default: false
    },
    isEnlarge: {
      // 是否需要点击图片放大 （none表示不需要其余默认需要）
      type: [String, Object],
      default() {
        return {};
      }
    },
    isSuper: {
      // 是否需要角标，使用插槽自定义（同时需要对象中有superFlag字段）
      type: Boolean,
      default: false
    },
    superFlag: {
      // 角标字段
      type: String,
      default: ''
    },
    isTip: {
      // 是否需要底部遮罩，使用插槽自定义
      type: Boolean,
      default: false
    },
    isImgId: {
      // 是否使用图片ID
      type: Boolean,
      default: false
    },
    idCard: {
      // 身份证ID
      type: [String, Number],
      default: ''
    },
    messageNumber: {
      // 小红点数字
      type: [String, Number],
      default: ''
    },
    imgStyleObject: {
      // 自定义图片Style
      type: Object,
      default() {
        return {
          width: '3.75rem',
          height: '4.75rem',
          fontSize: '1.6rem'
        };
      }
    },
    imgStyleSuspend: {
      // 自定义放大图片Style（isSuspend = true 生效）
      type: Object,
      default() {
        return {
          width: '18.75rem',
          height: '18.75rem'
        };
      }
    },
    activeIndex: {
      // 单前图片显示第几张
      type: Number,
      default: 0
    },
    arrow: {
      // 同element carousel参数
      type: String,
      default: 'never'
    },
    indicatorPosition: {
      type: String,
      default: 'none'
    },
    autoplay: {
      // 同element carousel参数
      type: Boolean,
      default: false
    },
    imgList: {
      // 静态图片list
      type: Array,
      default() {
        return [{}];
      }
    },
    loadingShow: {
      // 接口是否需要出现加载
      type: Boolean,
      default: false
    },
    cardIdModule: {
      // 服务器模块
      type: String,
      default: 'NOAH_ARK'
    },
    serverUrl: {
      // 服务器前缀地址
      type: String,
      default() {
        return ``;
      },
      required: false
    },
    isPopoverCenter: {
      type: Boolean,
      default: false
    },
    nodeIndex: {
      // 卡片索引
      type: Number,
      default: 0
    }
  },
  data() {
    // 组件内部参数
    return {
      generateKey: generateKey(),
      // 参数名称及默认值
      visible: false,
      // imageList: this.imgList,
      imageList: [],
      index: this.activeIndex,
      coordinate: {
        top: 0,
        left: 0,
        display: 'none'
      }
    };
  },
  computed: {
    iconType() {
      return `iconfont avatar-error__${this.$tool.bkdxHmlxToIcon(this.avatarType)}`;
    }
  },
  watch: {
    imgList: {
      handler(value) {
        this.imageList = value;
        if (this.isSuspendBody) this.$nextTick(this.enlargementImg);
      },
      immediate: true,
      deep: true
    },
    idCard: {
      handler(value) {
        this.imageList = [
          {
            url: ''
          }
        ];
        if (this.avatarType == '111') {
          this.getCardidData(value);
        } else if (this.avatarType == 'RLZP') {
          this.getMsgidData(value);
        }
      },
      immediate: true
    },
    activeIndex: {
      handler(val) {
        this.index = val;
        this.$refs.carousel.setActiveItem(this.index);
      }
    }
  }, // 侦听器（扩展的计算属性）
  methods: {
    carouselChange(index, oldIndex) {
      this.index = index;
    },
    /**
     * @description:上一张下一张
     * @param {String} type 切换类型
     * @return {null} null
     */
    prevAndNext(type) {
      if (type == 'next') {
        if (this.index != this.imageList.length - 1) {
          this.$refs.carousel.next();
          this.index++;
        } else {
          // return;
          this.index = 0;
        }
      } else {
        if (this.index !== 0) {
          this.$refs.carousel.prev();
          this.index--;
        } else {
          // return;
          this.index = this.imageList.length - 1;
        }
      }
      this.$refs.carousel.setActiveItem(this.index);
      this.$emit('update:activeIndex', this.index);
    },
    /**
     * @description: 移入
     * @param {type}
     * @return {null} null
     */
    mouseOver(event) {
      // this.coordinate.top = event.clientY + 10;
      // this.coordinate.left = event.clientX + 10;
      this.coordinate.display = 'block';
    },
    /**
     * @description: 移出
     * @param {type}
     * @return {null} null
     */
    mouseLeave(event) {
      this.coordinate.display = 'none';
    },
    mouseLeaveSuspend(event) {
      // this.coordinate.display = 'none';
    },
    /**
     * @description:图片放大功能（body中）
     * @return {null} null
     */
    enlargementImg() {
      this.$refs.img.forEach((ele, index) => {
        const item = this.imageList[index];
        this.$tool.enlargementImg(ele, this.imgKey && this.imageList.length ? item[this.imgKey] : item);
      });
    },
    /**
     * @description:
     * @param {Object} e 事件对象
     * @return {null} null
     */
    handleError(item) {
      item.hide = true;
    },
    /*
     *通过身份证获取照片数据
     */
    async getCardidData(val) {
      if (val) {
        let imageList = Array.isArray(this.value) ? this.value : [];
        try {
          const list = await zpfwShowZp(val);
          list.forEach(url => {
            imageList.push({
              url,
              hide: false
            });
          });
        } catch (e) {
          console.log(e);
        }
        if (imageList.length === 0) {
          imageList.push({
            url: '',
            hide: false
          });
        }
        this.imageList = imageList;
        this.$emit('input', imageList);
      }
    },
    /*
      通过id获取附件数据
      */
    getMsgidData(val) {
      if (val != '-' && val) {
        const imageId = val.split(',');
        const modulePath = filterPath(this);
        const limitNum = this.limit ? this.limit : imageId.length;
        let imageList = Array.isArray(this.value) ? this.value : [];
        imageId.map((p, i) => {
          if (i < limitNum) {
            imageList.push({
              id: new Date().getTime(),
              url: `${modulePath}/api/file/view/${p}`,
              name: '图片',
              size: '1M',
              hide: false
            });
          }
        });
        imageList = this.filterArray(imageList);
        this.imageList = imageList;
        this.$emit('input', imageList);
      }
    },
    /**
     * 数组对象去重
     */
    filterArray(arr) {
      const newArr = arr.map(item => {
        return {
          ...item,
          id: item.response ? item.response.data[0] : item.id
        };
      });
      const res = new Map();
      return newArr.filter(item => !res.has(item.id) && res.set(item.id, 1));
    }
  },
  mounted() {
    const _this = this;
    window.addEventListener('click', e => {
      e.stopPropagation();
      const imgBox = document.querySelectorAll('.comparison-img-box');
      const dgMessage = document.getElementById(_this.generateKey);
      const condition1 = imgBox[_this.nodeIndex] && !imgBox[_this.nodeIndex].contains(e.target);
      const condition2 = dgMessage && !dgMessage.contains(e.target);

      if (condition1 && condition2) {
        _this.coordinate.display = 'none';
        return;
      }
    });
  },
  created: function() {
    // this.$attrs['initial-index'] && (this.activeIndex = this.$attrs['initial-index'] + 1);
  } // 组件创建完成后
};
</script>
<style lang="scss" scoped>
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1.25rem 0 0.5rem;

  .el-carousel {
    margin: 0 0.5rem;
  }

  /deep/ .el-carousel__container {
    border: 1px solid var(--border-color-base);
    width: 100%;
    height: 100%;
    display: flex;

    /deep/ .el-carousel__item {
      display: flex;
      align-items: center;
      justify-content: center;

      .item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        .superscript {
          top: 0;
          right: 0;
          position: absolute;
        }

        .tip {
          background: var(--carousel_tip_background);
          position: absolute;
          z-index: 1;
          bottom: 0;
          width: 100%;
          font-size: 0.75rem;
          height: 1.5rem;
          line-height: 1.5rem;
          color: var(--color-pink);
          text-align: center;
        }

        &.hover {
          &:hover {
            border: 1px solid var(--button-primary-hover-background-color);
            box-shadow: 0 0.1875rem 0.625rem 0 var(--carousel_hover_box-shadow);
            cursor: pointer;
          }
        }
      }
    }
  }

  &__button {
    cursor: pointer;
    line-height: 4.75rem;
    width: 0.875rem;
    height: 4.75rem;
    background: var(--carousel_button_background);
    display: flex;
    justify-content: center;

    &:hover {
      background: var(--carousel_button_hover_background);
      border: 1px solid var(--carousel_hover_box-shadow);
    }

    .icon {
      font-size: 0.75rem;
    }
  }

  .shadowNum {
    z-index: 9;
    text-align: center;
    bottom: 0;
    position: absolute;
    background: var(--carousel_shadow-num_background);
    width: 100%;
    height: 0.875rem;
    font-family: MicrosoftYaHei;
    font-size: 0.75rem;
    color: var(--color-white);
    line-height: 0.75rem;
  }

  /deep/ .el-carousel__arrow--left {
    left: 0;
  }

  /deep/ .el-carousel__arrow--right {
    right: 0;
  }

  /deep/ .el-carousel__arrow {
    width: 1rem;
    height: 1rem;
    // background: red;
  }
}

.position {
  z-index: 10;
  border: 1px solid var(--border-color-extra-light);
  position: fixed;
  /* width: 160px;
    height: 200px; */
  bottom: 0;
  transition: all 0.2s;

  > img {
    width: 100%;
    height: 100%;
    box-shadow: 0 0.25rem 1rem 0 var(--carousel_img_box-shadow);
  }
}

.dg-message {
  /deep/ .el-badge__content.is-fixed {
    z-index: 3;
  }
}
.error-avatar {
  background: var(--color-gray);
  width: 100%;
  height: 100%;
  color: var(--color-text-placeholder);
  i {
    position: relative;
    display: block;
    top: 50%;
    text-align: center;
    font-size: 1.6rem;
    transform: translateY(-50%);
  }
}
.comparison-img-box {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
