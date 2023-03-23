<!--
 * @Author: Liugh
 * @Date: 2020-10-20 09:10:35
 * @LastEditTime: 2021-02-24 09:00:12
 * @LastEditors: Do not edit
 * @Description: 布控对象卡片组件
-->
<template>
  <div class="control-object-card-main" :style="{ 'margin-bottom': item.showPopper ? this.marginBottom : '0' }">
    <div
      class="control-object-card"
      slot="reference"
      @click="developClick"
      :class="{ active: item.showPopper, hover: isDel ? 'hover' : '' }"
    >
      <div class="content">
        <div :class="['content__title', item.bkdxlx == 'RLZP' ? 'zp' : '']">
          <i :class="['icon', switchType]"></i>
          <span
            class="bkdx-line"
            :data-type="item.hmlxzh"
            v-code="{ code: 'BM_BKDX_HMLX', value: item.hmlxzh, showTitle: true }"
          ></span>
          <span class="bkdx-content" v-if="item.bkdxlx != 'RLZP'" :title="item && item.bkdxhm">
            {{ item && item.bkdxhm }}
          </span>
          <img v-else :src="QZ_SHOWIMG + item.bkdxhm" alt="" />
          <span v-if="item.bkdxlx === '111'" class="ryxm" :title="ryxm">{{ ryxm }}</span>
        </div>
        <template v-if="item.sfyx === '1'">
          <div v-if="!isDel">关联属性：{{ item.glsxs ? item.glsxs : '0' }}个</div>
          <div v-else>关联属性：{{ item && item.bkdxsx && item.bkdxsx.length ? item.bkdxsx.length : '0' }}个</div>
        </template>
        <template v-else>
          <div>
            异常说明：<span class="bk-error-msg">{{ item.errmsg | filterGetErrorMsg }}</span>
          </div>
        </template>
      </div>
      <div class="del" v-if="isDel">
        <el-button @click.stop="delObj" :disabled="disabledDel">
          <i class="icon iconl-minus"></i>
        </el-button>
      </div>
    </div>
    <el-collapse-transition>
      <div class="diy-popover_warp" v-if="item.showPopper">
        <control-object-popover-content ref="copc" class="diy-popover_content" :item="item">
          <template #buttonGroup>
            <div class="right__buttonGroup">
              <el-button class="edit" @click="edit">编辑对象</el-button>
              <el-button class="del" @click="item.showPopper = false">关闭</el-button>
            </div>
          </template>
        </control-object-popover-content>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import ControlObjectPopoverContent from '../control-object-popover-content/index';
import { getRyxmBySfzh } from '@icccPath/api/bkdx/qjdxryxx';
import { getSetting } from '@icccPath/utils/request';
const QZ_BKSQ = getSetting('QZ_BKSQ');

export default {
  name: 'control-object-card', // 组件名称
  components: { ControlObjectPopoverContent, ElCollapseTransition }, // 注册局部组件
  props: {
    // 接收父组件的数据
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: [String, Number],
      default: 0
    },
    usePopper: Boolean,
    isDel: {
      type: Boolean,
      default: true
    },
    unrelated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      formObject: {},
      marginBottom: '0rem',
      QZ_SHOWIMG: QZ_BKSQ + '/api/file/view/',
      ryxm: '',
      disabledDel: false
    };
  },
  watch: {
    'item.bkdxlx': function(val) {
      if (val === '111') {
        this.getRyxmBySfzh();
      }
    }
  },
  computed: {
    switchType() {
      let array = [
        { name: 'CPH', value: 'iconl-car' },
        { name: '111', value: 'iconl-idcard' },
        { name: 'SJ', value: 'iconl-mobile' },
        { name: 'WX', value: 'iconl-WeChat' },
        { name: 'QQ', value: 'iconl-QQ' },
        { name: 'RLZP', value: 'iconl-photo' }
      ];
      let validatorObj = array.find(item => {
        return item.name == this.item.bkdxlx;
      });
      return validatorObj && validatorObj.value;
    }
  },
  filters: {
    filterGetErrorMsg(errmsg) {
      try {
        const obj = JSON.parse(errmsg);
        return (obj && obj.cwxx) || '-';
      } catch (e) {
        console.log({ e, errmsg });
        return '-';
      }
    }
  },
  methods: {
    ...mapActions(['SBM_EDIT_SHOW', 'SBM_EDIT_OBJECT']),
    /**
     * @description:点击查看详情（展开关闭）
     */
    developClick() {
      if (this.usePopper) {
        this.$set(this.item, 'showPopper', !this.item.showPopper);
        this.$emit('showPopperChange', this.item);
        if (this.item.showPopper) {
          this.$nextTick(() => {
            this.marginBottom = this.$refs.copc.$el.clientHeight + 12 + 'px';
          });
        }
      }
    },
    // /**
    //  * @description:判断是否为数组
    //  * @param {String|Array}
    //  * @return {*}
    //  */
    // canvent(val) {
    //   if (Array.isArray(val)) return;
    //   val = JSON.parse(val);
    //   this.item.bkdxsx = val;
    // },
    /**
     * @description:进入编辑界面
     */
    edit() {
      this.SBM_EDIT_SHOW(true);
      this.SBM_EDIT_OBJECT(this.item);
    },
    /**
     * @description:删除对象（子级调用）
     */
    delObj() {
      this.disabledDel = true;
      this.$emit('delObj', this.item, this.index);
    },
    async getRyxmBySfzh() {
      this.ryxm = await getRyxmBySfzh(this.item.bkdxhm);
    }
  }, // 内部方法
  created() {}
};
</script>
<style lang="scss" scoped>
.control-object-card-main {
  transition: all 0.5s ease;
  .control-object-card {
    padding-left: 16px;
    // width: 300px;
    display: flex;
    justify-content: space-between;
    border: 1px solid var(--border-color-base);
    cursor: pointer;
    // margin-bottom: 1rem;
    &.hover {
      &:hover {
        border: 1px solid var(--color-primary);
        box-shadow: 0 3px 10px 0 var(--control-object-card_shadow_color);
      }
    }

    &.active {
      border: 1px solid var(--color-primary);
      box-shadow: 0 3px 10px 0 var(--control-object-card_shadow_color);
    }
    .content {
      padding: 10px 0;
      width: 100%;
      &__title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: var(--color-primary);
        &.zp {
          margin-bottom: 1px;
        }
        i {
          font-size: 20px;
          margin-right: 10px;
        }
        img {
          width: 28px;
          height: 28px;
          display: block;
        }
      }
      > div {
        line-height: 21px;
      }
      .bkdx-line {
        margin-right: 0.5em;
        @include text-ellipsis(5em);
      }
      .bkdx-content {
        width: 0;
        flex: 1;
        @include text-ellipsis(false);
      }
      .ryxm {
        margin-left: 0.5em;
        @include text-ellipsis(3em);
      }
    }
    .del /deep/ {
      .el-button {
        min-width: 42px;
        border: none;
        border-left: 1px solid var(--border-color-base);
        height: 100%;
        &:hover {
          background: red;
          color: white;
        }
      }
    }
  }
  .right__buttonGroup {
    margin-top: 1.5rem;
    text-align: center;
    .edit {
      background: rgba(24, 144, 255, 0.08);
      border: 1px solid #1890ff;
      color: #1890ff;
      border-radius: 2px;
    }
    .del {
      &:hover {
        background: red;
        border: 1px solid red;
        color: white;
      }
    }
  }
  .diy-popover {
    position: relative;
    &_warp {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 1;
      margin-top: 12px;
      border: 1px solid var(--border-color-base);
      background: var(--background-color);
    }
    &_content {
      // height: 20.3125rem;
      overflow: auto;
      background: var(--control-object-popovere-content_popover_background);
    }
  }
  .bk-error-msg {
    color: var(--color-danger);
  }
}
</style>
