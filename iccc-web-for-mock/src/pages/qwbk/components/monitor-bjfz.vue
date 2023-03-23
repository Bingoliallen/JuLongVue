<!-- 编辑分组 Created by hcg on 2021/3/30. -->
<template>
  <div class="monitor-plcz monitor-bjfz">
    <div class="title-1">分组编辑</div>
    <el-form ref="form" :model="model" label-width="7em">
      <dg-form-item label="分组名称：" prop="qzmc" rules="required">
        <el-input
          v-trim
          placeholder="请输入分组名称，不超过20个字符"
          clearable
          maxlength="20"
          v-model="model.qzmc"
        ></el-input>
      </dg-form-item>
    </el-form>
    <div class="title-2 monitor-bjfz_row">
      <span>分组成员</span>
      <span class="overview"
        ><em class="bkdx">{{ zrs }}</em> 个</span
      >
    </div>
    <el-form label-width="7em" label-suffix="：" style="margin: -2rem 0 -0.5rem;">
      <dg-form-item label="布控状态" prop="BKZT">
        <dg-checkbox-group
          value=""
          v-model="condition.BKZT"
          row
          check-all
          check-all-text="不限"
          code="BM_BKDX_BKZT"
        ></dg-checkbox-group>
      </dg-form-item>
      <dg-form-item label="布控对象" prop="HMLXZH">
        <dg-tree-drop
          value=""
          v-model="condition.HMLXZH"
          code="BM_BKDX_HMLX"
          multiple
          clearable
          filterable
          :lazy-load="false"
          collapse-tags
          :props="{ value: 'value' }"
          style="width: 100%;"
        ></dg-tree-drop>
      </dg-form-item>
      <dg-form-item label="关键字查询" prop="GJZ">
        <el-input
          v-model="condition.GJZ"
          clearable
          placeholder="请输入布控号码、姓名查询"
          @keyup.enter.native="inputSearch"
          @clear="inputSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="inputSearch"></i>
        </el-input>
      </dg-form-item>
    </el-form>
    <div class="monitor-bjfz_grid">
      <infinite-scroll
        ref="scroll"
        infinite-class="monitor-plcz_list"
        url="/v1/bkdx/search"
        :searchCondition="searchCondition"
        :sortProps="[{ SQSJ: 'DESC' }, { BKKSRQ: 'ASC' }]"
        :dataFilter="true"
        primaryKey="primaryKey"
        :lazy="true"
        @load="infiniteLoad"
      >
        <template #list="{ list }">
          <monitor-obj-card
            v-for="(node, index) in list"
            :key="node.key + '-' + index"
            class="monitor-plcz_item"
            :node="node"
            :is-del="true"
            :class="{ active: node.showPopper }"
            :use-popper="true"
            @showPopperChange="showPopperChange"
            @del="delNode(node)"
          ></monitor-obj-card>
        </template>
        <template #noMore><span class="no-more"></span></template>
      </infinite-scroll>
    </div>
    <div class="monitor-plcz_btn">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MonitorObjCard from './monitor-obj-card';
import { qzdxUpdate } from './../request';
import { confirm } from '@icccPath/utils/tool';

export default {
  // 编辑分组
  name: 'monitor-bjfz',
  components: { MonitorObjCard },
  props: {
    groupData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      model: {
        fzmc: ''
      },
      condition: {}
    };
  },
  computed: {
    addbkdxbhs() {
      return this.addList.map(e => e.bkdxbh).join(',');
    },
    delbkdxbhs() {
      return this.removeList.map(e => e.bkdxbh).join(',');
    },
    searchCondition() {
      if (this.groupData && this.groupData.qzid) {
        // 这个搜索条件后端有进行特殊处理
        return {
          and: [
            { name: 'BKZT', value: this.condition.BKZT, op: 'in' },
            { name: 'HMLXZH', value: this.condition.HMLXZH, op: 'in' },
            { name: 'GJZ', mergerName: 'HMNR,XM', value: this.condition.GJZ, op: 'like' },
            // 本分组的人
            { name: 'QZID', value: this.groupData.qzid, op: '=' },
            // 分组待添加的数据
            { name: 'BKDXBH', value: this.addbkdxbhs, op: 'in' },
            // 分组待删除的数据
            { name: 'BKDXBH', value: this.delbkdxbhs, op: 'not in' }
          ]
        };
      }
      return [];
    },
    zrs() {
      return +this.model.zrs || 0;
    },
    ...mapGetters(['addList', 'removeList'])
  },
  watch: {
    groupData: {
      handler(v) {
        this.model = { ...v };
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    inputSearch() {
      this.$refs.scroll.reinit();
    },
    infiniteLoad({ totalElements }) {
      this.$set(this.model, 'zrs', totalElements);
    },
    showPopperChange(node) {
      const item = this.$refs.scroll.nodeListShow.find(e => e.showPopper && e !== node);
      item && this.$set(item, 'showPopper', false);
    },
    delNode(node) {
      this.removeBkdx([node.data]);
      this.$nextTick(this.judgeIsScroll);
    },
    judgeIsScroll() {
      const scroll = this.$refs.scroll;
      const wrap = scroll.$refs.scrollbar.wrap;
      // 距离底部小于100，加载下一页
      if (
        !scroll.noMore &&
        wrap.children[0].getBoundingClientRect().bottom - wrap.parentNode.getBoundingClientRect().bottom < 100
      ) {
        this.$refs.scroll.load();
      }
    },
    submit() {
      this.$refs.form.validate(async () => {
        if (!this.model.qzmc) {
          this.$message.error('分组名称不能为空！');
          return;
        }
        await qzdxUpdate({
          // 群组id(有修改，无新增)
          qzid: this.model.qzid || undefined,
          // 群组名称
          qzmc: this.model.qzmc,
          // 新增的成员的bkdxh
          addbkdxbhs: this.addbkdxbhs,
          // 删除的成员的bkdxh
          delbkdxbhs: this.delbkdxbhs
        });
        setTimeout(() => {
          // 应后端要求，延迟1秒再返回
          this.$message.success('分组保存成功！');
          this.back(true);
        }, 1000);
      });
    },
    cancel() {
      confirm('暂未保存变更，是否进行保存？')
        .then(this.submit)
        .catch(() => {
          this.back(false);
        });
    },
    back(flag) {
      this.$emit('cancel', flag, this.isEditGroup ? 'is-edit' : '');
    },
    ...mapActions(['removeBkdx', 'clearBjfz'])
  },
  mounted() {
    this.inputSearch();
  },
  beforeDestroy() {
    this.clearBjfz();
  }
};
</script>

<style lang="scss" scoped>
.monitor-bjfz {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-form {
    padding: 1.5rem 2rem 0;
    /deep/ .el-form-item {
      margin-bottom: 1rem;
    }
  }
  &_row {
    padding: 0 2rem;
  }
  &_grid /deep/ {
    flex: 1;
    height: 0;
    padding-left: 2rem;
    .el-scrollbar__view {
      padding-right: 2rem;
    }
    .diy-popover_warp {
      right: 2rem;
    }
    .infinite-list__no-more {
    }
  }
  .monitor-plcz_btn {
    padding: 1rem 2rem;
  }
}
</style>
