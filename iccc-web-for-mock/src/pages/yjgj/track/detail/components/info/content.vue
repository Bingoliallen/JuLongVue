<template>
  <el-form inline label-width="8em">
    <el-row>
      <template v-for="(field, index) in showFields">
        <el-col v-if="index % 2 == 0" :xs="10" :sm="10" :md="10" :lg="10" :xl="12" :key="index">
          <el-form-item :label="field.label + '：'">
            <show-label
              v-if="field.key == 'bzhm'"
              :item="field"
              :title="data[field.key].splic('@')[0]"
              :value="data[field.key].splic('@')[0]"
            ></show-label>
            <show-label v-else :item="field" :value="data[field.key]" :title="data[field.key]"></show-label>
          </el-form-item>
        </el-col>
        <el-col v-else :xs="14" :sm="14" :md="14" :lg="14" :xl="12" :key="index">
          <el-form-item :label="field.label + '：'">
            <show-label
              v-if="field.key == 'bzhm'"
              :item="field"
              :title="data[field.key].splic('@')[0]"
              :value="data[field.key].splic('@')[0]"
            ></show-label>
            <show-label v-else :item="field" :value="data[field.key]" :title="data[field.key]"></show-label>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import ShowLabel from './showLabel';
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'user'
    }
  },
  data() {
    return {
      userFields: [
        { key: '', label: '状态', value: '-' },
        { key: 'mz', label: '民族', type: 'code', code: 'BM_MZ0000' },
        { key: 'dxlx', label: '对象类别', type: 'code', code: 'BM_BKDX_HMLX' },
        { key: 'csrq', label: '出生日期', type: 'date' },
        { key: 'hjdxz', label: '户籍地址' },
        { key: 'hjdpcsmc', label: '户籍地派出所' },
        { key: 'jzdxz', label: '居住地址' },
        { key: 'jzdpcsmc', label: '居住地派出所' }
      ],
      photoFields: [
        // TODO: 本期后端未提供，先隐藏
        // { key: '', label: '状态', value: '-' },
        { key: 'csrq', label: '出生日期', type: 'date' },
        { key: 'dxlx', label: '对象类别', type: 'code', code: 'BM_BKDX_HMLX', value: '-' }
        // TODO: 本期后端未提供，先隐藏
        // { key: '', label: '布控时间', value: '-' }
      ],
      carFields: [
        // TODO: 本期后端未提供，先隐藏
        // { key: '', label: '状态', value: '-' },
        // { key: '', label: '车牌颜色', value: '-' },
        // { key: '', label: '车辆颜色', value: '-' },
        // { key: '', label: '布控时间', value: '-' },
        { key: 'cllx', label: '对象类别', type: 'code', code: 'BM_BKDX_HMLX', value: '-' }
      ],
      phoneFields: [
        { key: '', label: '状态', value: '-' },
        { key: '', label: '布控时间', value: '-' },
        { key: 'dxlx', label: '对象类别', type: 'code', code: 'BM_BKDX_HMLX', value: '-' }
      ]
    };
  },
  components: {
    ShowLabel
  },
  computed: {
    showFields() {
      return this[`${this.type}Fields`];
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item /deep/ {
  display: flex;
  .el-form-item__content {
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
