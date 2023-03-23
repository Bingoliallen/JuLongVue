<!--
 * @Author: Liugh
 * @Date: 2020-10-23 11:04:24
 * @LastEditTime: 2021-02-18 10:33:03
 * @LastEditors: Please set LastEditors
 * @Description: 申请信息
-->
<template>
  <dg-scrollbar>
    <div class="apply-info-wrapper">
      <div class="cv-detail-page__box">
        <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}">
          <el-form-item
            :class="[isTk ? 'cv-detail-page__form--label' : '']"
            v-for="(item, index) in controls"
            :key="index"
            :label="item.title + '：'"
          >
            <div
              v-if="item.length > 0"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              :title="bkfwTitle"
            >
              <span v-for="(data, k) in item.value" :key="k">
                <span :data-type="data" v-code="{ code: item.code, value: data, module: item.module }"> </span>
                <span v-if="item.length - 1 == k"></span>
                <span v-else>,</span>
              </span>
            </div>
            <span
              v-else-if="item.code"
              :data-type="item.value"
              :title="bkfwTitle"
              v-code="{ code: item.code, value: item.value, module: item.module }"
            ></span>
            <div
              v-else
              :style="
                bkdxbh || detail.bklx === '11' ? 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap' : ''
              "
              :title="item.value"
            >
              {{ item.value | filterText }}
            </div>
          </el-form-item>
          <el-form-item v-if="bkdxbh || detail.bklx === '11'" label="处置要求：" :title="detail.czcsyq">
            <span>{{ detail.czcsyq | filterText }}</span>
          </el-form-item>
          <el-form-item v-if="detail.bklx === '11' || isTk || bkdxbh" :label="`${isTk ? '申请' : '执法'}依据：`">
            <dg-upload
              v-if="detail.zfyjxx && detail.zfyjxx.length > 0"
              ref="upload"
              disabled
              :on-preview="loadDownFiled"
              v-model="detail.zfyjxx"
              :class="{ 'tk-upload': isTk }"
            >
              <div
                v-if="!isTk && detail.zfyjxx && detail.zfyjxx.length > 0"
                class="el-upload__tip"
                style="margin-left: 0.8rem"
              >
                点击以下附件名称可下载
              </div>
              <template slot="fileList" slot-scope="{ id, name, size }">
                <!--              <i :class="`dg-icon-${scope.type}`"></i>-->
                <i class="el-icon-paperclip"></i>
                {{ `${name} (${size / 1024})KB` }}
              </template>
            </dg-upload>
            <span v-else>{{ '' | filterText }}</span>
          </el-form-item>
          <el-form-item
            v-if="!isTk && (detail.bklx === '11' || bkdxbh)"
            label="预警条件："
            class="cv-detail-page__form--row"
          >
            <ul class="warning-condition__wrap" v-if="detail.gjTjxx || detail.fkqTjxxList">
              <li class="warning-condition__item" v-if="detail.gjTjxx && detail.gjTjxx.dtxxlx.length">
                <div class="warning-condition__item--label">轨迹类型：</div>
                <div class="warning-condition__item--tags">
                  <dg-tag v-for="(item, index) in detail.gjTjxx.dtxxlx" :key="item + index"
                    ><span v-code="{ code: 'VW_BM_YWXXLX', value: item }"></span
                  ></dg-tag>
                </div>
              </li>
              <li class="warning-condition__item" v-if="detail.gjTjxx && detail.gjTjxx.mddqh.length">
                <div class="warning-condition__item--label">目的地：</div>
                <div class="warning-condition__item--tags">
                  <dg-tag v-for="(item, index) in detail.gjTjxx.mddqh" :key="item + index"
                    ><span v-code="{ code: 'BM_BZ_XZQH', value: item }"></span
                  ></dg-tag>
                </div>
              </li>
              <li class="warning-condition__item" v-if="detail.gjTjxx && detail.gjTjxx.fsdqh.length">
                <div class="warning-condition__item--label">活动地：</div>
                <div class="warning-condition__item--tags">
                  <dg-tag v-for="(item, index) in detail.gjTjxx.fsdqh" :key="item + index"
                    ><span v-code="{ code: 'BM_BZ_XZQH', value: item }"></span
                  ></dg-tag>
                </div>
              </li>
              <li class="warning-condition__item" v-if="detail.fkqTjxxList && detail.fkqTjxxList.length">
                <div class="warning-condition__item--label">区域防控：</div>
                <div class="warning-condition__item--tags">
                  <dg-tag v-for="(item, index) in detail.fkqTjxxList" :key="item + index"
                    ><span v-code="{ code: 'BM_FKQ_JCLX', value: item.fx }"></span>
                    &nbsp;
                    <span>{{ item.mc }}</span></dg-tag
                  >
                </div>
              </li>
            </ul>
            <span v-else>-</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import bkxxApi from '@icccPath/api/qwbk';
import sqdxApi from '@icccPath/api/sqdx/index';
import { mapActions } from 'vuex';
export default {
  name: 'control-informaction', // 组件名称
  props: {
    // 接收父组件的数据
    id: String,
    bkdxbh: String
  },
  data() {
    // 组件内部参数
    return {
      bkfwTitle: '',
      detail: {},
      controls: [
        // { title: '布控事由', value: '', code: '', module: '', length: 0 },
        // { title: '布控范围', value: '', code: '', module: '', length: 0 },
        //
        // { title: '布控级别', value: '', code: '', module: '', length: 0 },
        // { title: '布控单位', value: '', code: '', module: '', length: 0 },
        //
        // { title: '布控类别', value: '', code: '', module: '', length: 0 },
        // { title: '申请人', value: '', code: '', module: '', length: 0 },
        //
        // { title: '布控周期', value: '', code: '', module: '', length: 0 }
      ]
    };
  },
  components: {},
  computed: {
    // 是否是停控信息
    isTk() {
      return this.detail.bklx === '31' || this.detail.bklx === '32';
    }
  },
  watch: {
    id(val) {
      if (!val) return;
      this.getSqxx();
    },
    bkdxbh(val) {
      if (!val) return;
      this.getSqxx();
    }
  },
  // 方法
  methods: {
    ...mapActions(['getBmMc', 'getBmList']),
    _isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.log('error：' + str + '!!!' + e);
          return false;
        }
      }
      console.log('It is not a string!');
    },
    /**
     *字符串转json
     *
     */
    stringToJson(data) {
      if (this._isJSON(data)) {
        return JSON.parse(data);
      } else {
        return '';
      }
    },
    /*
     下载文件
      */
    loadDownFiled(file) {
      bkxxApi.fileDownLoad({ fileName: file.name }, file.url).then(res => {});
    },
    // 获取申请信息
    async getSqxx() {
      let that = this;
      that.detail = {};
      that.bkfwTitle = '';
      that.controls = [];
      let bkxxData = this.bkdxbh ? await bkxxApi.getBkdxXq(this.bkdxbh) : await bkxxApi.getSqxx(this.id);

      if (bkxxData.data) {
        if (bkxxData.data.zfyjxx) {
          bkxxData.data.zfyjxx = that.stringToJson(bkxxData.data.zfyjxx);
        }
        that.detail = bkxxData.data;
        let per = that.detail.bkdyfw ? that.detail.bkdyfw.split(',') : [];
        // 过滤空值
        per = per.filter(e => e);
        let bkksrq = that.detail.bkksrq ? this.$dayjs(that.detail.bkksrq).format('YYYY-MM-DD') : '-';
        let bkjsrq = that.detail.bkjsrq ? this.$dayjs(that.detail.bkjsrq).format('YYYY-MM-DD') : '-';
        let sqsj = that.detail.sqsj ? this.$dayjs(that.detail.sqsj).format('YYYY-MM-DD HH:mm:ss') : '-';
        if (that.isTk) {
          // 停控、撤销停控
          that.controls = [
            {
              title: this.detail.bklx == '31' ? '停控原因' : '撤销停控原因',
              value: this.detail.bklx == '31' ? that.detail.bkyy : that.detail.sqms,
              code: this.detail.bklx == '31' ? 'BM_BKSQ_TKYY' : '',
              length: 0
            },
            {
              title: '申请时间',
              value: sqsj,
              length: 0
            },
            {
              title: '申请人姓名',
              value: that.detail.sqrxm,
              length: 0
            },
            {
              title: '申请人联系方式',
              value: that.detail.sqrxm,
              length: 0
            },
            {
              title: '申请人公安机关代码',
              value: that.detail.sqdwdm,
              length: 0
            },
            { title: '申请人公安机关名称', value: that.detail.sqdwdm, code: 'BM_DEPT', length: 0 }
          ];
          if (that.detail.bklx === '31') {
            that.controls.splice(1, 0, {
              title: '原因描述',
              value: that.detail.sqms,
              length: 0
            });
          }
        } else if (this.bkdxbh || that.detail.bklx == '11') {
          const { gjTjxx, fkqTjxxList } =
            (this.detail.yjgzid && (await sqdxApi.yjgzDetail(this.detail.yjgzid)).data) || {};
          if (gjTjxx) {
            const { dtxxlx, fsdqh, mddqh } = gjTjxx;
            gjTjxx.dtxxlx = (dtxxlx && dtxxlx.split(',')) || [];
            gjTjxx.fsdqh = (fsdqh && fsdqh.split(',')) || [];
            gjTjxx.mddqh = (mddqh && mddqh.split(',')) || [];
          }
          this.$set(this.detail, 'gjTjxx', gjTjxx);
          this.$set(this.detail, 'fkqTjxxList', fkqTjxxList);
          // 布控详情-申请信息使用时或者申请单为布控时
          that.controls = [
            {
              title: that.detail.bklx == '13' ? '续控原因' : that.detail.bklx == '12' ? '撤控原因' : '布控事由',
              value: that.detail.bkyy,
              code: '',
              module: '',
              length: 0
            },
            {
              title: '布控范围',
              value: that.detail.bkfwbm === '99' ? per : that.detail.bkfwbm,
              code: that.detail.bkfwbm === '99' ? 'VW_BZ_XZQH' : 'BM_BKSQ_BKFW',
              length: that.detail.bkfwbm === '99' ? per.length : 0
            },
            { title: '布控级别', value: that.detail.bkjb, code: 'BM_BKSQ_BKJB', length: 0 },
            { title: '布控单位', value: that.detail.sqdwdm, code: 'BM_DEPT', module: '', length: 0 },
            { title: '布控类别', value: that.detail.bklb, code: 'BM_BKSQ_BKLB', length: 0 },
            { title: '申请人', value: that.detail.sqrxm, code: '', module: '', length: 0 },
            {
              title: '布控周期',
              value: bkksrq + '至' + bkjsrq,
              code: '',
              module: '',
              length: 0
            }
          ];
        } else {
          that.controls = [
            {
              title: that.detail.bklx == '13' ? '续控原因' : that.detail.bklx == '12' ? '撤控原因' : '布控事由',
              value: that.detail.bkyy,
              code: '',
              module: '',
              length: 0
            },
            { title: '布控单位', value: that.detail.sqdwdm, code: 'BM_DEPT', module: '', length: 0 },
            { title: '申请人', value: that.detail.sqrxm, code: '', module: '', length: 0 }
          ];
          if (that.detail.bkqx && that.detail.bkqx > 0) {
            // 存在布控期限时
            that.controls.push({
              title: '布控周期',
              value: that.detail.bkqx,
              code: 'BM_BKSQ_BKQX',
              module: '',
              length: 0
            });
          } else {
            if (that.detail.bklx != '12') {
              that.controls.push({
                title: that.detail.bklx == '13' ? '续控周期' : '布控周期',
                value: that.detail.bklx == '13' ? '截止日期至' + bkjsrq : bkksrq + '至' + bkjsrq,
                code: '',
                module: '',
                length: 0
              });
            }
          }

          if (that.detail.bklx === '12') {
            that.controls.splice(1, 0, {
              title: '原因描述',
              value: that.detail.sqms,
              length: 0
            });
          }

          that.controls.push(
            {
              title: '申请时间',
              value: sqsj,
              length: 0
            },
            {
              title: '申请人姓名',
              value: that.detail.sqrxm,
              length: 0
            },
            {
              title: '申请人联系方式',
              value: that.detail.sqrxm,
              length: 0
            },
            {
              title: '申请人单位代码',
              value: that.detail.sqdwdm,
              length: 0
            },
            { title: '申请单位', value: that.detail.sqdwdm, code: 'BM_DEPT', length: 0 }
          );
        }

        this.bkfwTitle = '';
        if (that.detail.bkfwbm === '99') {
          let title = '';
          const list = await this.getBmList({ codeId: 'VW_BZ_XZQH' });
          per.forEach(item => {
            const data = list.find(e => e.value === item);
            if (title) {
              title += ',' + (data && data.label) || item;
            } else {
              title = (data && data.label) || item;
            }
          });
          this.bkfwTitle = title;
        } else if (that.detail.bkfwbm) {
          this.bkfwTitle = await this.getBmMc({ codeId: 'BM_BKSQ_BKFW', key: that.detail.bkfwbm });
        }
      }
    }
  },
  // 组件创建时调用
  created() {
    if (!this.id && !this.bkdxbh) return;
    this.getSqxx();
  }
};
</script>
<style lang="scss" scoped>
.apply-info-wrapper {
  margin: 1.5rem 0rem;
}

.cv-detail-page {
  &__box {
    margin-bottom: 0px;

    &-tittle {
      margin-bottom: 0px;
    }

    &-row {
      padding: 0px 0 0px 10px;
      border-bottom: solid 1px var(--control-informaction_cv-detail-page__box-row_border);

      .text-title {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    p {
      line-height: 16px;
    }

    .el-col {
      padding: 5px 0;
    }

    &-no {
      color: var(--color-danger);
    }
  }

  &__table {
    .el-form--inline .el-form-item {
      display: block;
      margin-bottom: 0;
    }

    .el-table__body td {
      background: transparent;
    }
  }

  &__form {
    .el-form-item {
      width: 50%;
      margin: 0px;
      padding: 0.17rem 0px;
      color: var(--color-text-secondary);

      /deep/ .el-form-item__label {
        padding: 0px;
      }

      /deep/ .el-form-item__content {
        color: var(--color-text-primary);
        width: 60%;
      }
    }

    &--photo {
      width: 100% !important;
      display: flex;

      /deep/ .el-form-item__label {
        flex: 0 0 5rem;
      }

      /deep/ .el-form-item__content {
        width: 100% !important;
      }
    }
    & &--row {
      width: 100%;
      display: flex;
      /deep/ .el-form-item__content {
        flex: 1;
      }
      .warning-condition {
        &__wrap {
          border: 1px solid var(--border-color-extra-light);
          border-radius: 2px;
          padding: 1.5rem 1rem;
        }
        &__item {
          display: flex;
          &--label {
            width: 8rem;
          }
          &--tags {
            flex: 1;
            .dg-tag {
              margin: 0 0 8px 8px;
            }
          }
        }
      }
    }

    .tk-upload {
      /deep/ {
        .el-upload--text {
          display: none;
        }
        .el-upload-list__item:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
