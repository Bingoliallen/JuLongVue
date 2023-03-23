<!-- Created by hcg on 2020/12/25. -->
<template>
  <div class="iccc-fz-select">
    <dg-select
      v-model="fz"
      :placeholder="placeholder"
      :data="fzList"
      clearable
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :disabled="disabled"
    ></dg-select>
  </div>
</template>

<script>
import request from '@icccPath/utils/request';
import qs from 'qs';
// 查询群组列表
function qzxxList() {
  return request({
    url: '/v1/qzxx/paging',
    method: 'POST',
    data: qs.stringify({
      page: 0,
      size: 999,
      sort: JSON.stringify({ RKSJ: 'DESC' })
    })
  });
}
export default {
  name: 'iccc-fz-select',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '请选择分组'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fzList: []
    };
  },
  computed: {
    fz: {
      get() {
        return this.value;
      },
      set(val) {
        if (val instanceof Array) {
          val = val.join(',');
        }
        this.$emit('input', val);
      }
    }
  },
  methods: {
    async init() {
      const res = await qzxxList();
      this.fzList = (res.data.content || []).map(({ qzid, qzmc }) => ({ label: qzmc, value: qzid }));
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped></style>
