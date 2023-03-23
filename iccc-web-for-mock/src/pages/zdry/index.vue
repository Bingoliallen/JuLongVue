<!--
 重点人员
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <qwbk-layout
    class="qwbk-monitor"
    v-model="menuActive"
    ref="layout"
    :menuItems="menuItems"
    :popover-key="popoverKey"
    :leftTitle="leftListConfig.leftTitle"
    :dataFilter="true"
    :module="module"
    :leftListConfig="leftListConfig"
    :placeholder="placeholder"
    @updateCondition="searchCondition = $event"
    @load="infiniteLoad"
    :primary-key="primaryKey"
    :pageExpand="pageExpand"
    @pageExpand="pageExpand = $event"
    @changeCard="changeCard"
    @change="changeMenu"
    @export-data="exportData"
    :showExport="leftListConfig.showExport"
  >
    <template v-slot:leftTitle>
      <div class="flex-1">
        <span class="title-text">{{ leftListConfig.leftTitle }}</span>
        <span class="yjgj-num">{{ total.toLocaleString() }}个</span>
      </div>

      <template v-if="batchType">
        <el-checkbox
          v-model="isCheckAll"
          class="check-all"
          :indeterminate="isIndeterminate"
          @change="indeterminateChange"
        >
          全选
        </el-checkbox>
        <dg-button type="text" @click="addToRight()">{{ batchType === 'xztksq' ? '新增' : '撤销' }}停控</dg-button>
      </template>

      <template v-else>
        <div class="conrtrol-button-wrap">
          <el-dropdown @command="handleControl" trigger="hover">
            <el-button type="primary" plain size="small">停控申请</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="xztksq">新增停控申请</el-dropdown-item>
              <el-dropdown-item command="cxtksq">撤销停控申请</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button type="text" icon="iconfont iconl-fullscreen" title="展开" @click="pageExpand = true"></el-button>
      </template>
    </template>

    <template v-if="pageExpand" v-slot:expand>
      <tksqd-list
        v-if="menuActive === 'tksqd'"
        :leftListConfig="leftListConfig"
        @changeCard="changeCard"
        @pageExpand="pageExpand = $event"
      ></tksqd-list>
      <zdry-list
        v-else
        :leftListConfig="leftListConfig"
        @changeCard="changeCard"
        @pageExpand="pageExpand = $event"
      ></zdry-list>
    </template>

    <template v-else v-slot="{ node, data }">
      <template v-if="menuActive === 'tksqd'">
        <iccc-card-item :key="node.key" :data="data" cardType="tksqd"></iccc-card-item>
      </template>
      <template v-else>
        <iccc-card-item :key="node.key" :data="data" cardType="zdry"></iccc-card-item>
        <right-menu :menu-list="data | rightMenuList" @click="rightMenuClick($event, node)"></right-menu>
      </template>
    </template>

    <template v-if="batchType === 'xztksq' || batchType === 'cxtksq'" v-slot:list="{ list }">
      <monitor-obj-card
        v-for="(node, index) in list"
        :key="node.key + '-' + index"
        :node="node"
        @add="addToRight([node])"
      ></monitor-obj-card>
    </template>

    <template v-if="batchType === 'xztksq' || batchType === 'cxtksq'" v-slot:view>
      <stop-control v-model="rightList" @cancel="cancelConrtol" :controlType="batchType" @del="batchDel"></stop-control>
    </template>
  </qwbk-layout>
</template>
<script>
import QwbkLayout from '@icccPath/components/qwbk-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import StopControl from './control/stop-control';
import ZdryList from './list/index';
import TksqdList from './list/tksqd-list';
import RightMenu from '@icccPath/components/base/right-menu';
import nzdrApi from '@icccPath/api/nzdr';

export default {
  name: 'zdry',
  components: {
    QwbkLayout,
    IcccCardItem,
    ZdryList,
    TksqdList,
    StopControl,
    RightMenu,
    'monitor-obj-card': () => import(`@icccPath/pages/qwbk/components/monitor-obj-card.vue`)
  },
  data() {
    const module = 'BASE_API';
    return {
      module,
      isCheckAll: false,
      batchType: '',
      primaryKey: 'bjzdrybh',
      batchData: {},
      rightList: [],
      menuItems: [
        { label: '重点人员', value: 'zdry', active: false, icon: 'iconl-personnel' },
        { label: '停控申请单', value: 'tksqd', active: false, icon: 'iconl-file' },
        { label: '我的关注', value: 'wdgz', active: false, icon: 'iconl-focus' }
      ],
      menuActive: 'zdry',
      pageType: false,
      pageExpand: false,
      popoverKey: 'CONDITIONS_ZDRY',
      placeholder: '请输入身份证号、姓名、关联属性',
      total: 0,
      searchCondition: []
    };
  },
  filters: {
    rightMenuList(data) {
      const list = [
        { label: data.sfgz === 'false' || !data.sfgz ? '关注' : '取消关注', value: 'gz' },
        { label: '新增停控', value: 'xztksq', disabled: !(data.tkzt !== '1' && data.dxsqzt !== '1') },
        { label: '撤销停控', value: 'cxtksq', disabled: !(data.tkzt !== '0' && data.dxsqzt !== '2') }
      ];
      return list;
    }
  },
  computed: {
    leftListConfig() {
      const nodeFilter = list =>
        list.map(node => {
          const data = node.data;
          data.hmlx = '111';
          data.hmnr = data.sfzh;
          return node;
        });
      const sortProps = [];
      let searchCondition = JSON.parse(JSON.stringify(this.searchCondition));
      if (this.menuActive === 'tksqd' && !this.batchType) {
        searchCondition.push(
          // 获取停控数据
          { name: 'BKLX', value: '31,32', op: 'in' },
          // 过滤临时状态
          { name: 'TJZT', value: '00', op: '!=', type: '', format: '' }
        );
      }

      if (this.batchType === 'xztksq') {
        const arr = [
          { name: 'TKZT', value: '1', op: '!=' },
          { name: 'DXSQZT', value: '1', op: '!=' }
        ];
        searchCondition = searchCondition.concat(arr);
      }
      if (this.batchType === 'cxtksq') {
        const arr = [
          { name: 'TKZT', value: '0', op: '!=' },
          { name: 'DXSQZT', value: '2', op: '!=' }
        ];
        searchCondition = searchCondition.concat(arr);
      }

      const config = {
        zdry: {
          url: '/v1/zdry/search',
          searchCondition: searchCondition,
          leftTitle: '重点人员',
          titleExport: '重点人员',
          showExport: true,
          showExportUrl: '/v1/zdry/export',
          nodeFilter,
          sortProps
        },
        tksqd: {
          url: '/v1/sqxx/search',
          searchCondition: searchCondition,
          leftTitle: '停控申请单',
          titleExport: '停控申请单',
          showExport: false,
          showExportUrl: '',
          sortProps: []
        },
        wdgz: {
          url: '/v1/concern-zdry/search',
          searchCondition: searchCondition,
          leftTitle: '我的关注',
          titleExport: '我的关注-重点人员',
          showExport: true,
          showExportUrl: '/v1/concern-zdry/export',
          nodeFilter,
          sortProps
        }
      };
      // 批量操作走人员接口
      if (this.batchType) {
        config.tksqd = { url: '/v1/zdry/search', searchCondition, nodeFilter, sortProps };
      }
      return config[this.menuActive] ? config[this.menuActive] : {};
    },
    // 全选状态
    isIndeterminate() {
      let flag = false;
      const layout = this.$refs.layout;
      if (layout) {
        const scroll = layout.$refs.scroll;
        if (scroll) {
          const list = scroll.nodeListShow || [];
          const len = list.filter(e => e.checked).length;
          flag = len !== 0 && len !== list.length;
        }
      }
      return flag;
    },
    rightKeySet() {
      return new Set(this.rightList.map(e => e.data[this.primaryKey]));
    }
  },
  watch: {
    menuActive: {
      handler(value) {
        if (value) {
          switch (value) {
            case 'tksqd':
              this.primaryKey = 'id';
              this.popoverKey = 'CONDITIONS_SPTKDX';
              this.placeholder = '请输入申请人姓名';
              break;
            case 'wdgz':
              this.primaryKey = 'concernId';
              this.popoverKey = 'CONDITIONS_ZDRY';
              this.placeholder = '请输入身份证号、姓名、关联属性';
              break;
            default:
              this.primaryKey = 'bjzdrybh';
              this.popoverKey = 'CONDITIONS_ZDRY';
              this.placeholder = '请输入身份证号、姓名、关联属性';
              break;
          }
        }
      }
    }
  },
  methods: {
    init() {},
    // 导出预警轨迹
    exportYjgj() {},
    // 点击卡片
    changeCard(data) {
      this.pageExpand = false;
      if (this.menuActive === 'tksqd') {
        this.$router.push({
          name: 'tksqd-detail',
          params: { id: data.id }
        });
        return;
      }
      this.$router.push({
        name: 'zdry-detail',
        params: {
          id: this.menuActive == 'zdry' ? data.bjzdrybh : data.concernId
        }
      });
    },
    // 菜单切换事件
    changeMenu(value) {},
    infiniteLoad(result, nodeList) {
      // 第一页
      if (result.pageNum === 1) {
        this.total = result.totalElements || 0;
        if (nodeList.length === 0) {
          // 无数据页
          this.$router.replace({
            name: 'zdry-none'
          });
        }
      }
      // 批量操作时隐藏已经被加入右侧的数据
      if (this.batchType) {
        nodeList.forEach(node => {
          if (this.rightKeySet.has(node.data[this.primaryKey])) {
            this.$set(node, 'hide', true);
          }
        });
      }
    },
    handleControl(command) {
      this.batchType = command;
    },
    cancelConrtol(flage, type) {
      this.batchType = false;
    },
    batchDel(node) {
      const key = node.data[this.primaryKey];
      if (this.batchData[this.primaryKey] === key) {
        const nodeList = this.$refs.layout.$refs.scroll.nodeList;
        const item = nodeList.find(e => e.data[this.primaryKey] === key);
        if (item) {
          this.$set(item, 'hide', false);
        }
      }
    },
    addToRight(list) {
      if (!list) {
        list = this.$refs.layout.$refs.scroll.nodeListShow.filter(e => e.checked);
        this.isCheckAll = false;
      }
      list.forEach(node => {
        this.$set(node, 'hide', true);
        this.$set(node, 'checked', false);
      });
      this.rightList.unshift(...list);
      this.$nextTick(this.judgeIsScroll());
    },
    indeterminateChange(val) {
      const nodeListShow = this.$refs.layout.$refs.scroll.nodeListShow;
      nodeListShow.forEach(node => {
        this.$set(node, 'checked', val);
      });
    },
    // region 批量操作
    rightMenuClick(val, node) {
      // 关注
      if (val === 'gz') {
        const data = node.data;
        const sfgz = data.sfgz === 'false' || !data.sfgz ? 1 : 0;
        let concernType = 'ZDR';
        let concernId = data.bjzdrybh;
        nzdrApi.concern({ concernType, concernId, sfgz }).then(() => {
          this.$message.success(`${sfgz ? '添加' : '取消'}关注成功！`);
          this.$set(node.data, 'sfgz', sfgz);
          if (this.menuActive === 'zdry') {
            this.rightOperationSuccess(node.data);
          }
          if (this.menuActive === 'wdgz') {
            this.$refs.layout.search();
          }
        });
        return;
      }
      // 停控
      if (val === 'xztksq' || val === 'cxtksq') {
        this.$set(node, 'hide', true);
        this.rightList = [node];
      }
      this.batchData = node.data;
      this.batchType = val;
    },
    // 右键操作成功
    rightOperationSuccess(data) {
      this.$nextTick(() => {
        if (data && data.bjzdrybh != this.$refs.layout.$refs.detail.dataSouce.bjzdrybh) return;
        if (this.$refs.layout && this.$refs.layout.$refs.detail) {
          // 刷新详情基本信息
          this.changeCard(data);
          this.$refs.layout.$refs.detail.getDetail();
        }
      });
    },
    judgeIsScroll() {
      const scroll = this.$refs.layout.$refs.scroll;
      const wrap = scroll.$refs.scrollbar.wrap;
      // 距离底部小于100，加载下一页
      if (
        !scroll.noMore &&
        wrap.children[0].getBoundingClientRect().bottom - wrap.parentNode.getBoundingClientRect().bottom < 100
      ) {
        this.$refs.layout.$refs.scroll.load();
      }
    },
    exportData() {
      let list = [
        {
          name: this.leftListConfig.titleExport + '列表导出.xls',
          type: 'FILE_NAME',
          format: '',
          split: '',
          display: ''
        },
        { name: 'XM', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'XB', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'CSRQ', type: 'AGE', format: '', split: '', display: '年龄' },
        { name: 'SFZH', type: 'CHAR', format: '', split: '', display: '身份证号码' },
        { name: 'ZDRYXL', type: 'CODE', format: 'BM_RY_RYXL', split: '', display: '人员类别' },
        // { name: 'RYXL', type: 'CHAR', format: '', split: '', display: '人员细类' },
        { name: 'MZ', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'JG', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '籍贯' },
        { name: 'CSRQ', type: 'DATE', format: '', split: '', display: '出生日期' },
        { name: 'HJDXZ', type: 'CHAR', format: '', split: '', display: '户籍地址' },
        { name: 'HJDPCS', type: 'CHAR', format: '', split: '', display: '户籍地派出所' },
        { name: 'XZDXZ', type: 'CHAR', format: '', split: '', display: '居住地址' },
        { name: 'XZDPCS', type: 'CHAR', format: '', split: '', display: '居住地派出所' }
      ];
      nzdrApi
        .toResultExport(
          this.leftListConfig.showExportUrl,
          { JLBGSJ: 'DESC' },
          list,
          this.leftListConfig.searchCondition,
          this.total,
          {
            fileName: this.leftListConfig.titleExport + '列表导出.xls'
          }
        )
        .then(res => {
          console.log(res);
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.qwbk-monitor {
  .flex-1 {
    .title-text {
      font-weight: 700;
      @include mq($large) {
        font-size: 18px;
      }
      @include mq($medium) {
        font-size: 16px;
      }
      @include mq($small) {
        font-size: 14px;
      }
    }
  }
  .check-all {
    margin-right: 1rem;
  }
}
.conrtrol-button-wrap {
  margin-right: 5px;
}
</style>
