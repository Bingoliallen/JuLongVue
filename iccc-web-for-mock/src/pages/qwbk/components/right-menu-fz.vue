<!-- 分组 右键菜单项 Created by hcg on 2020/12/7. -->
<template>
  <div class="right-menu-fz sub-menu">
    <div class="right-menu-fz_search">
      <el-input
        class="right-menu-fz_input"
        v-if="isShowInput"
        v-model="keyword"
        suffix-icon="el-icon-search"
        placeholder="请输入分组名称查询"
      ></el-input>
      <el-input
        class="right-menu-fz_input"
        v-if="!isShowInput"
        v-model="groupName"
        v-trim
        placeholder="请输入新建分组名称"
        @keyup.enter.native="updateGroup"
        ref="groupName"
      ></el-input>
      <i
        v-if="isShowAdd"
        class="icon el-icon-circle-plus-outline right-menu-fz_add"
        @click="showInput"
        title="新增分组"
      ></i>
      <i v-if="!isShowAdd" class="icon el-icon-circle-check right-menu-fz_add" @click="updateGroup" title="保存"></i>
    </div>
    <ul class="">
      <li v-for="fz in fzListShow" :key="fz.qzid" @click="addToFz(fz)">
        <span>{{ fz.qzmc }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { qzxxList, addToFz, addFz } from './../request';
export default {
  name: 'right-menu-fz',
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      keyword: '',
      fzList: [],
      isShowInput: true,
      groupName: '',
      isShowAdd: true
    };
  },
  computed: {
    fzListShow() {
      return this.keyword ? this.fzList.filter(e => e.qzmc.indexOf(this.keyword) !== -1) : this.fzList;
    }
  },
  methods: {
    init() {
      qzxxList().then(res => {
        this.fzList = res.data.content || [];
      });
    },
    addToFz(data) {
      addToFz(data.qzid, this.data.bkdxbh).then(() => {
        this.$message.success('移入分组成功！');
        // 关闭右键菜单
        document.body.click();
        this.$emit('moveSuccess');
      });
    },
    fzClick() {},
    // 显示新建群组框
    showInput() {
      this.isShowInput = false;
      this.isShowAdd = false;
      this.$nextTick(() => {
        this.$refs.groupName.focus();
      });
    },
    // 提交分组名称
    updateGroup() {
      if (!this.groupName) {
        this.$message.error('分组名称不能为空！');
        return;
      }
      const data = { id: this.$tool.generateKey(), qzmc: this.groupName };
      addFz(data).then(() => {
        this.init();
        // 清空还原
        this.groupName = '';
        this.isShowAdd = true;
        this.isShowInput = true;
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.right-menu-fz {
  &.sub-menu {
    position: absolute;
    width: 18rem;
    top: auto;
    bottom: 0;
    ul {
      max-height: 260px;
      overflow: auto;
    }
  }
  &_search {
    padding: 7px 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  &_input {
    width: 95%;
  }
  &_add {
    margin-left: 0.5em;
    color: rgba(182, 179, 179, 0.85);
  }
  &_add:hover {
    margin-left: 0.5em;
    color: #1890ff;
  }
}
</style>
