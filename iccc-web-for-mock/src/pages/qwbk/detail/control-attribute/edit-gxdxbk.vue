<template>
  <dg-scrollbar class="edit-gxdxbk">
    <!-- <gxdxbk v-model="value" :bkdxid="bkdxid" :module='module'></gxdxbk> -->
  </dg-scrollbar>
</template>

<script>
// import Gxdxbk from './../../apply/edit-bkdx/gxdxbk';
export default {
  name: 'edit-gxdxbk',
  // components: { Gxdxbk },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      value: [],
      bkdxid: '',
      module: ''
    };
  },
  methods: {
    init() {
      const { value, bkdxid, module } = this.options;
      this.value = value;
      this.bkdxid = bkdxid;
      this.module = module;
    },
    async submit() {
      return true;
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped></style>
