<!--右键菜单组件-->
<template>
  <ul class="right-menu-context" v-if="showMenu" @click.stop>
    <li
      v-for="(item, index) in menuList"
      :key="index"
      @click.stop="menuClick(item, $event)"
      :class="{ 'no-click': item.disabled }"
    >
      <template v-if="item.slot || item.children">
        <span>{{ item.label }}</span>
        <!--自定义二级菜单-->
        <template v-if="item.slot">
          <slot></slot>
        </template>
        <!--普通的二级菜单-->
        <template v-else>
          <ul class="sub-menu" v-if="item.children">
            <li v-for="(child, i) in item.children" :key="index + '-' + i" @click.stop="menuClick(child, $event)">
              {{ child.label }}
            </li>
          </ul>
        </template>
        <i class="el-icon-caret-right"></i>
      </template>
      <span v-else>{{ item.label }}</span>
    </li>
  </ul>
</template>

<script>
import { registerRightMenu, cancellationRightMenu, closeAllMenu } from './right-menu-map';
export default {
  name: 'right-menu',
  props: {
    // 触发右键菜单的元素， 默认父节点
    target: Element,
    // 菜单数据
    menuList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return { id: '', showMenu: false };
  },
  watch: {
    target: {
      handler(newVal, oldVal) {
        if (oldVal) {
          oldVal.removeEventListener('contextmenu', this.openMenu);
        }
        this.$nextTick(() => {
          if (!newVal) {
            newVal = this.$el.parentElement;
          }
          newVal.addEventListener('contextmenu', this.openMenu);
        });
      },
      immediate: true
    }
  },
  methods: {
    menuClick(item, e) {
      if (item.slot || item.children) {
        // 有二级菜单，点击之后二级菜单显示出来，鼠标移开不会隐藏
        const li = e.currentTarget;
        li.classList.add('hover');
      }
      if (item.disabled || !item.value || item.slot || item.children) {
        return;
      }
      // 关闭右键菜单
      document.body.click();
      this.$emit('click', item.value, item);
    },
    openMenu(e) {
      e.preventDefault();
      if (this.$el.contains(e.target)) {
        // 在右键菜单上右键，跳过
        return;
      }
      // 把所有的右键菜单关闭
      closeAllMenu();
      // 显示当前的菜单
      this.showMenu = true;
      // 点击其它地方关闭菜单
      this.visibleChange(true);
      this.$nextTick(() => {
        this.getPosition(e, this.$el);
        this.$emit('opened', e);
      });
    },
    getPosition(e, ele) {
      // 获取鼠标位置进行定位
      const position = { left: e.clientX, top: e.clientY };
      const { width, height } = ele.getBoundingClientRect();
      const bodyHeight = document.body.clientHeight;
      const bodyWidth = document.body.clientWidth;
      // 判断定位不能超出浏览器；
      // 用浏览器高度减去菜单高度，再减去鼠标点击位置距顶部距离；宽度同理；
      position.top -= bodyHeight - height - position.top < 20 ? height : 0;
      position.left -= bodyWidth - width - position.left < 20 ? width : 0;

      ele.style.top = position.top + 'px';
      ele.style.left = position.left + 'px';
    },
    closeMenu(e) {
      this.showMenu = false;
      this.visibleChange(false);
      this.$emit('closed', e);
    },
    visibleChange(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    }
  },
  created() {
    this.id = registerRightMenu(this);
  },
  beforeDestroy() {
    cancellationRightMenu(this.id);
  }
};
</script>

<style lang="scss" scoped>
// 右键菜单
@mixin menu-style() {
  line-height: 1.5;
  list-style-type: none;
  background: var(--background-color);
  width: 146px;
  border-radius: 2px;
  padding: 5px 0;
  border: 1px solid #d0d0d0;
  color: var(--color-text-primary);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    position: relative;
    &:not(.no-click) {
      &:hover,
      &.hover {
        background-color: var(--background-color-base);
        span {
          & + .sub-menu {
            z-index: auto;
            visibility: visible;
            opacity: 1;
          }
        }
      }
      &:active {
        background-color: var(--background-color-base);
        span {
          color: var(--color-primary);
        }
      }
    }
    &.no-click {
      /*cursor: not-allowed;*/
      cursor: default;
      color: var(--color-text-regular);
    }
  }
}
.right-menu-context {
  @include menu-style();
  margin: 0;
  position: fixed;
  z-index: 999;
  top: -9999999px;
  left: -9999999px;
  font-size: 12px;
  font-weight: 400;
  /deep/ .sub-menu {
    @include menu-style();
    transition: all 0.3s ease-in-out;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    z-index: -999;
    left: 100%;
    top: -6px;
    margin-left: -5px;
    max-height: 320px;
    overflow: auto;
    & + i {
      position: absolute;
      right: 7px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-secondary);
    }
  }
}
</style>
