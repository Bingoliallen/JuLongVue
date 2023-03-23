<!--
 此处填写文件描述:详情基本信息
 @Author: cyp
 @Date: 2019-06-29
-->
<template>
  <detail-head-panel class="detail-top" v-bind="$attrs" v-on="$listeners" module="QZ_BKSQ">
    <el-form
      ref="detailForm"
      :inline="true"
      :model="topForm"
      :validate-on-rule-change="false"
      class="detail-form"
      label-width="6em"
    >
      <el-form-item class="main-label">
        <slot name="title" class="main-label__slot" :form="topForm"></slot>

        <div class="button-gtoup">
          <slot name="buttons">
            <template>
              <dg-button v-if="isGroup" type="primary" @click="handleEditGroup">
                编辑
              </dg-button>
              <dg-tag v-if="topForm.tkzt + '' === '1'" type="primary" size="small">
                <span v-code="{ code: BM_BKSQ_TKZT, value: topForm.tkzt }"></span>
              </dg-tag>
              <dg-button
                v-if="isFollowFlag"
                class="followed"
                :type="topForm.sfgz ? 'warning' : 'primary'"
                plain
                :disabled="isFollowDis"
                @click="handleFollowWith"
                ><i class="icon" :class="[topForm.sfgz ? 'iconf-focus' : 'iconl-focus']"></i
                >{{ topForm.sfgz ? '已关注' : '关注' }}</dg-button
              >
            </template>
          </slot>
          <slot name="needfollow"></slot>
        </div>
      </el-form-item>
      <slot name="content" :form="topForm"></slot>
    </el-form>
  </detail-head-panel>
</template>

<script>
import DetailHeadPanel from '../detail-head-panel/index';
import nzdrApi from '@icccPath/api/nzdr/index';
import { BM_BKSQ_TKZT } from '@icccPath/common/constant';

export default {
  name: 'BaseInfo',
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    isFollowFlag: {
      type: Boolean,
      default: true
    },
    isFollowDis: {
      type: Boolean,
      default: false
    },
    concernId: {
      type: String,
      default: 'id'
    },
    concernType: {
      type: String,
      default: '' // ZDR重点人、GJ轨迹、BKDX布控对象、BKQZ布控群组
    },
    // 分组基本信息
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      BM_BKSQ_TKZT,
      topForm: this.info
    };
  },
  watch: {
    info(val) {
      val.sfgz = Number(val.sfgz);
      this.topForm = val;
    }
  },
  components: {
    DetailHeadPanel
  },
  methods: {
    handleEditGroup() {
      this.$emit('edit-group', this.info);
    },
    handleFollowWith() {
      // 关注接口
      let the = this;
      const param = {
        sfgz: !this.topForm.sfgz,
        concernType: this.concernType,
        concernId: this.topForm[this.concernId]
      };
      nzdrApi.concern(param).then(res => {
        the.$set(the.topForm, 'sfgz', param.sfgz);
        the.$forceUpdate();
        the.$emit('updateSearch');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail {
  &-top {
    position: relative;
    margin-bottom: 0.72rem;
    // .back-group {
    //   position: absolute;
    //   right: 2.27rem;
    // }
  }

  &-form {
    width: 100%;
    margin: auto 0;

    /deep/ .el-form-item {
      width: 100%;
      margin: 0;
      color: var(--color-text-secondary);

      &__content {
        color: var(--color-text-primary);
      }
    }

    /deep/ .font-yellow {
      color: var(--color-warning);
    }

    .main-label {
      position: relative;
      margin-bottom: 20px;

      // margin-left: 2em;
      .font-blue {
        color: var(--color-primary);
      }

      .font-yellow {
        color: var(--color-warning);
      }

      /deep/ .el-form-item__content {
        width: 100%;
        display: flex;
      }

      /deep/ .main-label__slot {
        display: flex;
        flex: 1;

        span {
          font-size: 20px;
          color: var(--color-text-primary);
        }
        .hmlxzh {
          font-size: 0.75em;
        }
      }

      .button-gtoup {
        display: flex;
        align-items: center;

        .dg-tag {
          margin-right: 10px;
        }

        .followed {
          padding: 0;
        }

        .follow {
          padding: 0;
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
        }
      }
    }

    .item-inline {
      &-group {
        /deep/ .el-form-item__error {
          right: 0px;
          width: 8.6rem;
          left: auto;
        }
      }

      &-40 {
        width: 40%;
        max-width: calc(100% - 20.2rem);
      }

      &-60 {
        width: 60%;
        min-width: 20.2rem;
      }

      /deep/ .el-form-item__content {
        @include ellipsis();
        max-width: calc(100% - 4.88rem);
        color: var(--color-text-secondary);
      }
    }

    &_group_name {
      background: var(--disabled-fill-base);
      border: 1px solid var(--disabled-border-base);
      border-radius: 2px;
      font-size: 0.75em;
      margin: 0 8px 0 10px;
    }

    .editGropIcon {
      font-size: 14px;
    }

    .iconl-edit {
      &:hover {
        color: var(--color-primary);
      }
    }

    .apply-status {
      color: var(--color-danger);
    }

    .approve-status {
      color: var(--color-warning);
    }

    &_input {
      width: 8.6rem;
      margin: 0 8px 0 10px;

      /deep/ .el-input__inner {
        height: 1.8rem;
        line-height: 1.8rem;
      }
    }

    /deep/ .el-form-item__error {
      padding-top: 0px;
      margin-top: -0.2rem;
    }
  }
}

/deep/ .el-form-item__label::before {
  content: '' !important;
}
</style>
