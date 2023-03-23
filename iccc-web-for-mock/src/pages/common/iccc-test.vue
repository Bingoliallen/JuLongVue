<!--
  用于开发阶段测试组件等功能
  Created by hcg on 2020/11/16.
-->
<template>
  <div class="iccc-test" :class="{ noscroll }">
    <div class="iccc-test_card">
      <div class="title-1">预警条件</div>
      <warning-rule class="card-content" v-model="warningRuleModel"></warning-rule>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">dg-tree-drop</div>
      <div class="card-content">
        <dg-tree-drop
          code="BM_QZFKQ_XZQH"
          :lazy-load="true"
          :props="{ value: 'value', label: 'label', children: 'children' }"
          :tree-props="{ isToggleContact: true, isHighLight: true }"
          v-model="fkqModelXzqh"
          placeholder="请选择行政区划"
          :multiple="true"
          clearable
          filterable
          visible-type="branch"
          value-type="branch"
          cur-node-id="440000"
          style="width:100%;"
          @change="xzqhChange"
        ></dg-tree-drop>
        <div style="margin-top: 1rem;">
          <template v-if="fkqModelXzqh">
            <el-tag v-for="code in fkqModelXzqh.split(',')" :key="code" closable @close="closeTag(code)">
              <span v-code="{ code: 'BM_QZFKQ_XZQH', value: code }"></span>
            </el-tag>
          </template>
        </div>
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">dg-select</div>
      <div class="card-content">
        <dg-select
          v-model="multipleSelectModel"
          placeholder="placeholder"
          code="BM_BKDX_BKZT"
          clearable
          :multiple="true"
          outputFormat="String"
          @change="selectChange"
        ></dg-select>
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">
        防控圈
        <dg-button @click="show('fkq')">加载防控圈</dg-button>
      </div>
      <div class="fkq" :style="pageStyle" v-if="showFkq">
        <control-circle v-model="fkqModel"></control-circle>
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">
        表格组件
        <dg-button @click="show('table')">加载表格</dg-button>
      </div>
      <div class="table" :style="pageStyle" v-if="showTable">
        <qs-table v-bind="tableConfig"></qs-table>
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">图标组件</div>
      <div
        style="height: 200px;background: rgba(24, 144, 255, 0.08);padding: 1.5rem 2rem;line-height: 1;font-size:150px;"
      >
        <icon-combination
          :icons="[
            { class: 'iconf-background3', style: { fontSize: 'inherit', color: '#fff' } },
            { class: 'iconf-Anchor2', style: { fontSize: 'inherit', color: '#1890ff' } }
          ]"
        ></icon-combination>
        <!--, transform: 'translateY(6.5%)'-->
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">头像上传</div>
      <div style="background: #fff;padding: 1.5rem 2rem;">
        <dg-upload
          accept=".png,.jpg,.bmp"
          :before-upload="file => $tool.beforeAvatarUpload(file, 'image', 2)"
          :on-success="handSuccess"
          class="upload__img"
          v-model="fileList"
          list-type="viewer"
          multiple
          label-name="label"
          value-name="value"
        ></dg-upload>
      </div>
    </div>

    <div class="iccc-test_card">
      <div class="title-1">指令测试</div>
      <div
        style="height: 200px;background: rgba(24, 144, 255, 0.08);padding: 1.5rem 2rem;line-height: 1;font-size:1rem;"
      >
        <span v-code="{ code: 'BM_RY_RYXL', value: '001060001,00106000100111,001060001002' }">指令测试</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'iccc-test',
  components: {
    'warning-rule': () => import('@icccPath/components/warning-rule'),
    'control-circle': () => import('@icccPath/components/control-circle'),
    'icon-combination': () => import('@icccPath/components/icon-combination')
  },
  data() {
    return {
      pageStyle: {},
      warningRuleModel: '',
      showFkq: false,
      noscroll: false,
      fkqModelXzqh: '',
      multipleSelectModel: '',
      fkqModel: [],
      showTable: false,
      // 表格配置
      tableConfig: {
        url: '/v1/gjxx/search',
        rowKey: 'id',
        condition: [
          { name: 'hdfssj', value: '1,2', op: 'rangeDate' },
          { name: 'gjly', value: '01', op: 'in' }
        ],
        sortProps: { hdfssj: 'DESC' },
        // defaultSort: { order: 'descending', prop: 'hdfssj' },
        columns: [
          { type: 'selection', width: '55', fixed: 'left' },
          { type: 'index', label: '序号', width: '6em', fixed: 'left' },
          { label: '活动时间', prop: 'hdfssj', doFilters: 'filterTime', width: '14em' },
          { label: '轨迹类别', prop: 'gjly', width: '10em' },
          { type: 'slot', label: '经纬度', prop: 'jwd', width: '15em', showOverflowTooltip: true },
          { label: '活动地点', prop: 'hjdxz', width: '16em', showOverflowTooltip: true },
          { label: '活动场所', prop: 'hjdpcsmc', width: '8em', showOverflowTooltip: true },
          { label: '活动描述', prop: 'hdxgxx', width: '22em', showOverflowTooltip: true }
        ]
      },
      fileList: []
    };
  },
  watch: {
    fkqModel(val) {
      console.log('change-fkqModel', val);
    }
  },
  methods: {
    xzqhChange(...arg) {
      console.log('xzqhChange', ...arg);
    },
    selectChange(...arg) {
      console.log('selectChange', ...arg);
    },
    closeTag(code) {
      const set = new Set(this.fkqModelXzqh.split(','));
      set.delete(code);
      this.fkqModelXzqh = Array.from(set).join(',');
    },
    show(id) {
      (this.noscroll = !this.noscroll) &&
        this.$nextTick(() => {
          const rect = this.$el.getBoundingClientRect();
          this.pageStyle.height = rect.height + 'px';
          if (id === 'fkq') {
            (this.showFkq = !this.showFkq) &&
              this.$nextTick(() => {
                this.$el.querySelector('.fkq').scrollIntoView();
              });
          }
          if (id === 'table') {
            (this.showTable = !this.showTable) &&
              this.$nextTick(() => {
                this.$el.querySelector('.table').scrollIntoView();
              });
          }
        });
    },
    /**
     * @description:头像上传成功
     */
    handSuccess(res, file, fileList) {
      console.log({ res, file, fileList, thisFileList: this.fileList });
    }
  }
};
</script>

<style lang="scss" scoped>
.iccc-test {
  &.noscroll {
    height: 100%;
    overflow: hidden;
  }
  &_card {
    & + .iccc-test_card {
      margin-top: 2rem;
    }
  }
  .title-1 {
    background: #fff;
    display: flex;
    align-items: center;
    border-bottom: var(--border-light);
    .dg-button {
      margin-left: auto;
    }
  }
  .card-content {
    padding: 1.5rem 2rem;
    background: #fff;
  }
}
</style>
