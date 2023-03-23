<template>
  <dg-scrollbar class="edit-bkdx" ref="scrollbar">
    <section>
      <div class="title-2">
        <span>布控对象</span>
      </div>
      <bkdx v-bind="$attrs" ref="bkdx"></bkdx>
    </section>
    <section>
      <div class="title-2">
        <span>关联属性布控</span>
      </div>
      <glsxbk v-bind="$attrs" ref="glsxbk"></glsxbk>
    </section>
    <div class="buttonGroup">
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </dg-scrollbar>
</template>

<script>
import { mapActions } from 'vuex';
import Bkdx from './modules/bkdx';
import Glsxbk from './modules/glsxbk';
export default {
  name: 'edit-bkdx',
  components: { Bkdx, Glsxbk },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // 已布控关系对象
      checkedList: [],
      relationList: [],
      relationObj: {}
    };
  },
  methods: {
    ...mapActions(['SBM_EDIT_SHOW', 'SBM_EDIT_OBJECT']),
    /**
     * @description: 初始化数据
     */
    init() {},
    /**
     * @description: 保存编辑对象
     */
    submit() {
      const data = this.$refs.bkdx.getData();
      this.$refs.glsxbk.$refs.manualAdd.save(data);
    },
    /**
     * @description:取消编辑
     */
    cancel() {
      this.SBM_EDIT_SHOW(false);
      this.SBM_EDIT_OBJECT({});
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.title-2 {
  padding: 0 2rem;
}
.buttonGroup {
  text-align: center;
}
</style>
