<!--预警规则配置-->
<template>
  <div class="warning-rule">
    <dg-button class="warning-rule-btn-add" type="primary" @click="editRule">添加</dg-button>
    <div class="warning-rule_content" v-if="ruleItems.length > 0">
      <div class="warning-rule_item" v-for="item in ruleItems" :key="item.prop">
        <div class="label">{{ item.label }}：</div>
        <div class="value">
          <div :class="item.prop">
            <dg-tag v-for="(tag, i) in item.value" :key="i" effect="plain" closable @close="handleClose(tag, i, item)">
              <template v-if="item.code">
                <span v-code="{ code: item.code, value: tag, module: item.module }"></span>
              </template>
              <template v-else-if="item.prop === 'qyfk'">
                <span v-code="{ code: 'BM_FKQ_JCLX', value: tag.fx }"></span>
                &nbsp;
                <span>{{ tag.mc }}</span>
              </template>
              <template v-else>-</template>
            </dg-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sqdxApi from '@icccPath/api/sqdx/index';
import { getControlCircleDetail } from '@icccPath/components/control-circle/request';
export default {
  // 预警规则配置
  name: 'warning-rule',
  props: {
    // 预警规则ID
    value: String,
    module: String
  },
  data() {
    return {
      valueModel: {}
    };
  },
  computed: {
    ruleItems() {
      const ruleItems = [
        { label: '轨迹类型', prop: 'gjlx', code: 'VW_BM_YWXXLX' },
        { label: '目的地', prop: 'mdd', code: 'BM_BZ_XZQH' },
        { label: '活动地', prop: 'hdd', code: 'BM_BZ_XZQH' },
        { label: '区域防控', prop: 'qyfk' }
      ];

      return ruleItems
        .map(e => ({
          ...e,
          value: this.valueModel[e.prop]
        }))
        .filter(e => e.value && e.value.length > 0);
    }
  },
  watch: {
    value: {
      handler(val) {
        val && this.init(val);
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 获取后端数据回显
     * @param val
     * @return {Promise<void>}
     */
    async init(val) {
      const res = await sqdxApi.yjgzDetail(val);
      if (!res || !res.data) {
        this.valueModel = {};
      }

      const gjTjxx = res.data.gjTjxx;
      const qyfk = await Promise.all(
        (res.data.fkqTjxxList || []).map(async data => {
          const fkqid = data.id;
          try {
            const fkqRes = await getControlCircleDetail(fkqid);
            data = { ...data, ...fkqRes.data };
          } catch (e) {
            console.log(e);
          }
          const zbxx = data.zbxx;
          data.fkq = zbxx ? JSON.parse(zbxx) : [];
          return data;
        })
      );

      this.valueModel = {
        ...gjTjxx,
        gjlx: (gjTjxx.dtxxlx && gjTjxx.dtxxlx.split(',')) || [],
        mdd: (gjTjxx.mddqh && gjTjxx.mddqh.split(',')) || [],
        hdd: (gjTjxx.fsdqh && gjTjxx.fsdqh.split(',')) || [],
        qyfk
      };
    },
    editRule() {
      let width = window.innerWidth;
      let height = width < 1366 ? 490 : width < 1680 ? 520 : 550;
      width = width < 1366 ? 800 : width < 1680 ? 850 : 900;

      const value = this.$tool.deepClone(this.valueModel);
      const layer = this.$dgLayer({
        title: '预警条件',
        // 组件内容
        component: require('./warning-rule-layer-content'),
        maxmin: false,
        resize: false,
        props: { value, module: this.module },
        btn: ['确定', '取消'],
        btnAlign: 'c',
        area: [width + 'px', height + 'px'],
        skin: 'layer-transparent layer-flex',
        yes: () => {
          const value = layer.$children[0].getData();
          this.changeValue(value, flag => {
            if (flag) {
              layer.close(layer.dialogIndex);
            }
          });
        },
        close() {
          layer.close(layer.dialogIndex);
        }
      });
    },
    handleClose(tag, i, item) {
      item.value.splice(i, 1);
      this.changeValue(this.valueModel);
    },
    changeValue(value, cb) {
      let gjTjxx = {
        mddqh: value.mdd ? value.mdd.toString() : '',
        fsdqh: value.hdd ? value.hdd.toString() : '',
        dtxxlx: value.gjlx ? value.gjlx.toString() : ''
      };

      const data = { ...this.valueModel, gjTjxx, fkqTjxxList: value.qyfk, gzlx: '1' };
      delete data.gjlx;
      delete data.mdd;
      delete data.hdd;
      delete data.qyfk;

      sqdxApi.yjgzAddOrUpdate(data).then(res => {
        const id = res.data;
        this.$emit('input', id);
        this.$emit('change', id);
        cb && cb(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.warning-rule {
  &-btn {
    &-add {
      margin-bottom: 1.25rem;
    }
  }
  &_content {
    display: table;
    width: 100%;
    background: var(--table-header-background-color);
    border: 1px dashed var(--border-color-extra-light);
    border-radius: 2px;
    padding: 1.5rem 1rem 0;
  }
  &_item {
    display: table-row;
    .label {
      display: table-cell;
      color: var(--color-text-secondary);
      text-align: right;
      width: 6em;
    }
    .value {
      display: table-cell;
      padding-left: 8px;
      padding-bottom: 1.5rem;
      /deep/ .el-icon-close {
        margin-left: 1em;
      }
      .qyfk {
        line-height: 2.5;
        margin-left: -8px;
        .dg-tag {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
