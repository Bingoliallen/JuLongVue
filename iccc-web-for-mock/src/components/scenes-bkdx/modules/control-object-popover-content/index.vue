<template>
  <div class="control-object-card__popover">
    <div class="control-object-popover-content">
      <div class="left">
        <h1 class="title">布控对象</h1>
        <dg-tag class="tag__item" v-if="item.bkdxlx !== 'RLZP'" :class="{ unusual: item.sfyx === '0' }">
          <span v-code="{ code: 'BM_BKDX_HMLX', value: item.bkdxlx, emptyText: '暂无' }"></span>
          <!-- <span>{{ item.bkdxlx }}</span> -->
          :<span>{{ item.bkdxhm }}</span>
        </dg-tag>
        <img v-else :src="QZ_SHOWIMG + item.bkdxhm" alt="" />
        <!-- {{}} -->
        <!-- <div><label> 手机号：</label><span>18273742244</span></div> -->
        <!-- <el-form :model="formAttribute">
          <el-form-item label="手机号：">{{}}</el-form-item>
        </el-form> -->
        <div v-if="item.bkdxlx == '111'" class="attributeContainer">
          <!-- <dg-tag class="tag__item" v-if="item.kzzd && item.kzzd !== '{}'">
            <span>人员姓名</span>:<span>{{ kzzd.ryxm ? kzzd.ryxm : '暂无' }}</span>
          </dg-tag> -->
          <dg-tag class="tag__item" v-if="item.kzzd && item.kzzd !== '{}'">
            <span>人员类别</span>:
            <span v-code="{ code: 'BM_BKSQ_RYLB', value: item.rylbs, emptyText: '暂无' }"></span>
          </dg-tag>
          <dg-tag class="tag__item" v-if="item.kzzd && item.kzzd !== '{}'">
            <span>人员编号</span>:<span>{{ kzzd.rybh ? kzzd.rybh : '暂无' }}</span>
          </dg-tag>
        </div>
        <div v-if="item.bkdxlx == 'CPH'" class="attributeContainer">
          <dg-tag class="tag__item" v-if="item.kzzd && item.kzzd !== '{}'">
            <span>号牌颜色</span>:<span>{{ kzzd.hpys ? kzzd.hpys : '暂无' }}</span>
          </dg-tag>
          <dg-tag class="tag__item" v-if="item.kzzd && item.kzzd !== '{}'">
            <span>车辆颜色</span>:<span>{{ kzzd.clys ? kzzd.clys : '暂无' }}</span>
          </dg-tag>
        </div>
      </div>
      <div class="right" v-if="item.bkdxsx && item.bkdxsx.length">
        <div class="right__contianer">
          <h1 class="title padding">关联属性</h1>
          <dg-tag
            class="tag__item"
            v-for="(bkdxsxItem, index) in item.bkdxsx"
            :key="index"
            :class="{ unusual: bkdxsxItem.sfyx === '0' }"
          >
            <span v-code="{ code: 'BM_BKDX_HMLX', value: bkdxsxItem.hmlx, emptyText: '暂无' }"></span>:
            <span v-if="bkdxsxItem.hmlx !== 'RLZP'">{{ bkdxsxItem.hmnr }}</span>
            <img v-else :src="QZ_SHOWIMG + bkdxsxItem.hmnr" alt="" />
          </dg-tag>
        </div>
      </div>
    </div>
    <slot name="buttonGroup"></slot>
  </div>
</template>

<script>
import { getSetting } from '@icccPath/utils/request';
const QZ_BKSQ = getSetting('QZ_BKSQ');

export default {
  name: 'control-object-popover-content',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    kzzd() {
      if (typeof this.item.kzzd == 'object') {
        return this.item.kzzd;
      } else {
        let obj = this.item;
        obj.kzzd = JSON.parse(this.item.kzzd);
        return obj.kzzd;
      }
    }
  },
  data() {
    return {
      formAttribute: {},
      formObject: {},
      QZ_SHOWIMG: QZ_BKSQ + '/api/file/view/'
    };
  },
  methods: {
    init() {}
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss">
.control-object-card__popover {
  padding: 1.5rem 2rem;
  .control-object-popover-content {
    display: flex;
    color: var(--color-text-primary);
    > div {
      .title {
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 16px;
        &.padding {
          padding-left: 12px;
        }
      }
      > img {
        width: 8.75rem;
        height: 8.75rem;
      }
      .el-form {
        .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
    .left {
      flex: 1;
      .attributeContainer {
        display: inline-block;
        > span {
          margin-top: 8px;
          margin-left: 0;
        }
      }
      .tag__item {
        height: auto;
        line-height: unset;
      }
    }
    .right {
      flex: 6;
      display: flex;
      &__contianer {
        margin-left: 4rem;
        .tag__item {
          height: auto;
          line-height: unset;
          background: var(--table-header-background-color);
          border: 1px solid var(--border-color-base);
          border-radius: 2px;
          color: var(--color-text-primary);
          margin: 0 8px 8px 0;
          > img {
            height: 1.5625rem;
            width: 1.5625rem;
            margin-bottom: 3px;
          }
        }
      }
    }
    .unusual {
      border: 1px solid red;
    }
  }
}
.attribute {
  > div {
    display: flex;
    label {
      display: inline-block;
      text-align: right;
      flex: 100px 0 0;
      padding-right: 12px;
    }
  }
}
// .right__buttonGroup {
//   margin-top: 32px;
//   text-align: center;
//   .edit {
//     background: var(--background-color-base);
//     border: 1px solid var(--color-primary);
//     color: var(--color-primary);
//     border-radius: 2px;
//   }
//   .del {
//     &:hover {
//       background: var(--color-danger);
//       border: 1px solid var(--color-danger);
//       color: var(--color-white);
//     }
//   }
// }

.el-popover.dark {
  padding: 0 !important;
  border: 1px solid var(--border-color-base);
  border-radius: 0;
  .control-object-card__popover {
    background: var(--control-object-popovere-content_popover_background);
  }
  &[x-placement^='bottom'] {
    .popper__arrow {
      border-top-color: var(--border-color-base);
      &::after {
        border-bottom-color: var(--control-object-popovere-content_popper__arrow_border);
      }
    }
  }
  &[x-placement^='top'] {
    .popper__arrow {
      border-top-color: var(--border-color-base);
      &::after {
        border-top-color: var(--control-object-popovere-content_popper__arrow_border);
      }
    }
  }
}
</style>
