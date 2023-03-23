<!-- 布控 -->
<template>
  <qwbk-layout
    class="qwbk-monitor"
    ref="layout"
    v-bind="layoutConfig"
    v-model="menuActive"
    :menuItems="menuItems"
    :module="module"
    :pageExpand="pageExpand"
    :showExport="layoutConfig.showExport"
    @updateCondition="searchCondition = $event"
    @change="changeMenu"
    @load="infiniteLoad"
    @pageExpand="pageExpand = $event"
    @changeCard="changeCard"
    @export-data="exportData"
  >
    <!-- left -->
    <template v-if="layoutConfig.leftContent === 'left-link'" #left="{ className }">
      <left-link :class="className" @changeCard="changeCard"></left-link>
    </template>
    <!-- leftTitle -->
    <template #leftTitle>
      <div class="flex-1">
        <span class="title-text">{{ layoutConfig.leftTitle }}</span>
        <span class="bkdx-num">{{ Number(total - delNum).toLocaleString() }}个</span>
      </div>
      <template v-if="pagePlczType">
        <el-checkbox
          v-model="isCheckAll"
          class="check-all"
          :indeterminate="isIndeterminate"
          @change="indeterminateChange"
          >全选</el-checkbox
        >
        <dg-button type="text" @click="addToRight()">
          <template v-if="pagePlczType === 'xk'">添加续控</template>
          <template v-else-if="pagePlczType === 'ck'">添加撤控</template>
          <template v-else-if="pagePlczType === 'ydd'">移动到分组</template>
          <template v-else-if="pagePlczType === 'bjfz' || pagePlczType === 'xjfz'">添加到分组</template>
          <template v-else-if="pagePlczType === 'xztksq' || pagePlczType === 'cxtksq'"
            >{{ pagePlczType === 'xztksq' ? '新增' : '撤销' }}停控</template
          >
          <template v-else></template>
        </dg-button>
      </template>
      <template v-else>
        <dg-button v-if="menuActive === 'fz'" type="primary" plain size="small" @click="addFz">新建分组</dg-button>
        <el-dropdown v-else-if="menuActive === 'zdry'" @command="handleStopControlApply" trigger="hover">
          <el-button type="primary" plain size="small">停控申请</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="xztksq">新增停控申请</el-dropdown-item>
            <el-dropdown-item command="cxtksq">撤销停控申请</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <dg-button v-else type="primary" plain size="small" @click="addBkdx">添加</dg-button>
        <!-- 展开按钮 -->
        <el-button
          v-if="!isAdd"
          type="text"
          icon="iconfont iconl-fullscreen"
          title="展开"
          @click="pageExpand = true"
        ></el-button>
      </template>
    </template>
    <!-- leftContent -->
    <template v-if="isAdd" #prepend>
      <iccc-card-item></iccc-card-item>
    </template>
    <template #empty>
      <no-record class="infinite-list__empty" text="暂无数据" v-if="!isAdd"></no-record>
      <span v-else></span>
    </template>
    <template v-if="layoutConfig.leftContent === 'left-plcz'" #list="{ list }">
      <monitor-obj-card
        v-for="(node, index) in list"
        :key="node.key + '-' + index"
        :node="node"
        @add="addToRight([node])"
      ></monitor-obj-card>
    </template>
    <template v-else-if="layoutConfig.leftContent === 'left-bkdx'" v-slot="{ node, data, index }">
      <iccc-card-item :key="node.key + '-' + index" :data="data"></iccc-card-item>
      <right-menu :menu-list="data | filterRightList" @click="rightMenuClick($event, node)">
        <right-menu-fz @moveSuccess="rightOperationSuccess(data)" :data="data"></right-menu-fz>
      </right-menu>
    </template>
    <template v-else-if="layoutConfig.leftContent === 'left-zdry'" v-slot="{ node, data, index }">
      <iccc-card-item :key="node.key + '-' + index" :data="data" cardType="zdry"></iccc-card-item>
      <right-menu :menu-list="data | filterRightList(true)" @click="rightMenuClick($event, node)"></right-menu>
    </template>
    <template v-else-if="layoutConfig.leftContent === 'left-fz'" v-slot="{ node, data, index }">
      <iccc-card-item :key="node.key + '-' + index" :data="data" card-type="fz"></iccc-card-item>
      <right-menu :menu-list="data | filterRightList" @click="rightMenuClick($event, node)">
        <right-menu-fz :data="data"></right-menu-fz>
      </right-menu>
    </template>
    <template v-else-if="layoutConfig.leftContent === 'left-rwd'" v-slot="{ node, data, index }">
      <iccc-card-item :key="node.key + '-' + index" :data="data" card-type="task"></iccc-card-item>
    </template>
    <template v-else-if="layoutConfig.leftContent === 'expand-' + menuActive" #expand>
      <component
        :is="layoutConfig.leftContent"
        :leftTitle="layoutConfig.leftTitle"
        :leftListConfig="layoutConfig.leftListConfig"
        :placeholder="layoutConfig.placeholder"
        @changeCard="changeCard"
        @pageExpand="pageExpand = $event"
      ></component>
    </template>

    <!-- view -->
    <template v-if="pagePlczType === 'xk'" #view>
      <monitor-xk v-model="rightList" @cancel="cancelPlcz" @del="plczDel" @changeNum="delNum = $event"></monitor-xk>
    </template>
    <template v-else-if="pagePlczType === 'ck'" #view>
      <monitor-ck v-model="rightList" @cancel="cancelPlcz" @del="plczDel" @changeNum="delNum = $event"></monitor-ck>
    </template>
    <template v-else-if="pagePlczType === 'ydd'" #view>
      <monitor-yddfz
        v-model="rightList"
        @cancel="cancelPlcz"
        @changeNum="delNum = $event"
        @del="plczDel"
      ></monitor-yddfz>
    </template>
    <template v-else-if="pagePlczType === 'bjfz'" #view>
      <monitor-bjfz ref="bjfz" :groupData="plczData" @cancel="cancelPlcz" @del="plczDel"></monitor-bjfz>
    </template>
    <template v-else-if="pagePlczType === 'xjfz'" #view>
      <monitor-xjfz
        v-model="rightList"
        @cancel="cancelPlcz"
        :groupNode="activeGroupNode"
        @del="plczDel"
        @changeNum="delNum = $event"
      ></monitor-xjfz>
    </template>
    <template v-else-if="pagePlczType === 'xztksq' || pagePlczType === 'cxtksq'" #view>
      <stop-control
        v-model="rightList"
        @cancel="cancelPlcz"
        :controlType="pagePlczType"
        @del="plczDel"
        @changeNum="delNum = $event"
      ></stop-control>
    </template>
  </qwbk-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import QwbkLayout from '@icccPath/components/qwbk-layout';
import IcccCardItem from '@icccPath/components/iccc-card-item';
import RightMenu from '@icccPath/components/base/right-menu';
import NoRecord from '@icccPath/components//base/no-record';
import StopControl from '@icccPath/pages/zdry/control/stop-control';
import { concern, jsQz } from './request';
import { confirm } from '@icccPath/utils/tool';
import sqdxApi from '@icccPath/api/sqdx';
import nzdrApi from '@icccPath/api/nzdr';
import { EventBus } from '@icccPath/pages/qwbk/group-detail/event-bus';

const importComponent = name => {
  return () => import(`./components/${name}.vue`);
};
/**
 * 获取页面配置项
 * @param menuActive 菜单选中项
 * @param pagePlczType 批量操作类型
 * @param pageExpand 页面是否展开为列表
 * @param searchCondition 高级弹出框的搜索条件
 * @param qzid 分组ID
 * @param addListBjfz 分组待添加的数据
 * @param removeListBjfz 分组待移除的数据
 * @return {{dataFilter: boolean, leftContent: string, leftTitle: string, placeholder: string, leftListConfig: {}, popoverKey: string, primaryKey: string}}
 */
const getLayoutConfig = (menuActive, pagePlczType, pageExpand, searchCondition, qzid, addListBjfz, removeListBjfz) => {
  const config = {
    popoverKey: '',
    leftTitle: '',
    leftListConfig: {},
    leftContent: '',
    dataFilter: false,
    primaryKey: '',
    placeholder: ''
  };
  let leftListConfig = {};

  switch (menuActive) {
    case 'bkdx':
      config.popoverKey = 'CONDITIONS_BKDX';
      config.leftTitle = '布控对象';
      config.showExport = true;
      config.showExportUrl = '/v1/bkdx/search-export';
      leftListConfig.url = '/v1/bkdx/search';
      leftListConfig.sortProps = [{ SQSJ: 'DESC' }];
      // 布控对象的批量操作（续控，撤控），只显示布控中
      if (pagePlczType === 'xk' || pagePlczType === 'ck') {
        // bkzt：20 布控中 21 即将到期 10 申请中 01 已到期 02 已撤控
        searchCondition.push({ name: 'BKZT', value: '20,21', op: 'in' });
      }
      leftListConfig.searchCondition = searchCondition;
      config.leftContent = 'left-bkdx';
      config.primaryKey = 'bkdxbh';
      config.placeholder = '请输入布控号码、姓名查询';
      break;
    case 'zdry':
      config.popoverKey = 'CONDITIONS_ZDRY';
      config.leftTitle = '重点人员';
      config.showExport = true;
      config.showExportUrl = '/v1/zdry/export';
      leftListConfig.url = '/v1/zdry/search';
      leftListConfig.sortProps = [{ JLBGSJ: 'DESC' }];
      // 重点人的批量操作，新增或撤销停控申请
      searchCondition.push(
        ...(pagePlczType === 'xztksq'
          ? [
              { name: 'TKZT', value: '1', op: '!=' },
              { name: 'DXSQZT', value: '1', op: '!=' }
            ]
          : pagePlczType === 'cxtksq'
          ? [
              { name: 'TKZT', value: '0', op: '!=' },
              { name: 'DXSQZT', value: '2', op: '!=' }
            ]
          : [])
      );
      leftListConfig.searchCondition = searchCondition;
      leftListConfig.nodeFilter = list =>
        list.map(node => {
          const data = node.data;
          data.hmlx = '111';
          data.hmnr = data.sfzh;
          return node;
        });
      config.leftContent = 'left-zdry';
      config.primaryKey = 'bjzdrybh';
      config.placeholder = '请输入身份证号、姓名、关联属性查询';
      break;
    case 'fz':
      config.popoverKey = pagePlczType ? 'CONDITIONS_FZ_BKDX' : 'CONDITIONS_BKDXFZ';
      config.leftTitle = pagePlczType ? '布控对象' : '分组';
      config.showExport = false;
      config.showExportUrl = '';
      // 分组的批量操作，只显示当前分组内的布控对象
      if (pagePlczType) {
        leftListConfig.url = '/v1/bkdx/search';
        leftListConfig.sortProps = [{ SQSJ: 'DESC' }, { BKKSRQ: 'ASC' }];
        leftListConfig.showPopover = true;
        if (pagePlczType === 'xk' || pagePlczType === 'ck') {
          searchCondition.push({ name: 'QZID', value: qzid, op: 'in' });
          searchCondition.push({ name: 'BKZT', value: '20,21', op: 'in' });
        }
        if (pagePlczType === 'bjfz') {
          leftListConfig.url = '/v1/bkdx/search';
          // 这个搜索条件后端有进行特殊处理
          searchCondition = {
            and: [
              // 原先的条件
              ...searchCondition,
              // 非本分组的人
              { name: 'QZID', value: qzid, op: '!=' },
              // 分组待添加的数据
              { name: 'BKDXBH', value: addListBjfz.map(e => e.bkdxbh).join(','), op: 'not in' },
              // 分组待删除的数据
              { name: 'BKDXBH', value: removeListBjfz.map(e => e.bkdxbh).join(','), op: 'in' }
            ]
          };
        }
      } else {
        leftListConfig.showPopover = false;
        leftListConfig.url = '/v1/qzxx/paging';
        leftListConfig.sortProps = { RKSJ: 'DESC' };
      }
      leftListConfig.searchCondition = searchCondition;
      config.leftContent = 'left-fz';
      config.primaryKey = 'qzid';
      config.placeholder = '请输入分组名称查询';
      break;
    case 'rwd':
      config.popoverKey = 'CONDITIONS_RWD';
      config.leftTitle = '布控任务';
      config.showExport = false;
      config.showExportUrl = '';
      leftListConfig.url = '/v1/sqxx/search';
      leftListConfig.sortProps = { SQDZT: 'ASC', SQSJ: 'DESC' };
      searchCondition.push({ name: 'TJZT', value: '00', op: '!=' });
      leftListConfig.searchCondition = searchCondition;
      config.leftContent = 'left-rwd';
      config.primaryKey = 'id';
      config.placeholder = '请输入申请单名称、布控号码查询';
      break;
    case 'link':
      config.leftContent = 'left-link';
      leftListConfig = false;
      break;
    case 'wdgz':
      config.popoverKey = 'CONDITIONS_BKDX';
      config.leftTitle = '我的关注';
      config.showExport = true;
      config.showExportUrl = '/v1/concern-bkdx/search-export';
      leftListConfig.url = '/v1/concern-bkdx/search';
      leftListConfig.sortProps = { RKSJ: 'DESC' };
      leftListConfig.searchCondition = searchCondition;
      config.leftContent = 'left-bkdx';
      config.primaryKey = 'bkdxbh';
      config.placeholder = '请输入布控号码、姓名查询';
      break;
  }

  if (pagePlczType) {
    config.leftContent = 'left-plcz';
    config.dataFilter = true;
    if (menuActive !== 'zdry') {
      // 非重点人的批量操作，操作的是布控对象
      config.primaryKey = 'bkdxbh';
      config.placeholder = '请输入布控号码、姓名查询';
    }
    // 批量操作时不会有选中项
    leftListConfig.activeFirst = false;
  }
  if (pageExpand) {
    config.leftContent = 'expand-' + menuActive;
  }
  config.leftListConfig = leftListConfig;
  return config;
};

export default {
  name: 'qwbk-monitor',
  components: {
    QwbkLayout,
    IcccCardItem,
    RightMenu,
    NoRecord,
    StopControl,
    'monitor-obj-card': importComponent('monitor-obj-card'),
    'monitor-ck': importComponent('monitor-ck'),
    'monitor-xk': importComponent('monitor-xk'),
    'monitor-xjfz': importComponent('monitor-xjfz'),
    'monitor-yddfz': importComponent('monitor-yddfz'),
    'right-menu-fz': importComponent('right-menu-fz'),
    'expand-bkdx': importComponent('expand-bkdx'),
    'expand-fz': importComponent('expand-fz'),
    'expand-rwd': importComponent('expand-rwd'),
    'expand-wdgz': importComponent('expand-wdgz'),
    'monitor-bjfz': importComponent('monitor-bjfz'),
    'expand-zdry': () => import('@icccPath/pages/zdry/list'),
    'left-link': importComponent('left-link')
  },
  data() {
    const module = 'BASE_API';
    return {
      module,
      menuItems: [
        { label: '布控对象', value: 'bkdx', active: false, icon: 'iconl-personnel', num: 0 },
        { label: '重点人员', value: 'zdry', active: false, icon: 'iconl-Keypersonnel', num: 0 },
        { label: '分组', value: 'fz', active: false, icon: 'iconl-team', num: 0 },
        { label: '布控任务', value: 'rwd', active: false, icon: 'iconl-file', num: 0 },
        // { label: '联动页面', value: 'link', active: false, icon: 'iconl-link', num: 0 },
        { label: '我的关注', value: 'wdgz', active: false, icon: 'iconl-focus', num: 0 }
      ],
      menuActive: 'bkdx',
      // 批量操作类型切换；
      // xk 续控；ck 撤控；ydd 移动到；bjfz 编辑分组；xjfz 新建分组；xztksq 新增停控申请；cxtksq 撤销停控申请
      pagePlczType: false,
      plczData: {},
      // 页面默认未展开
      pageExpand: false,
      total: 0,
      delNum: 0,
      isCheckAll: false,
      rightList: [],
      searchCondition: [],
      activeRwdNode: {},
      activeGroupNode: {}
    };
  },
  computed: {
    isAdd() {
      return this.$route.name === 'monitor-apply' && !this.$route.query.id;
    },
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
    /**
     * 页面配置项
     * @return {{dataFilter: boolean,leftContent: string,leftTitle: string,placeholder: string,leftListConfig: {},popoverKey: string,primaryKey: string}}
     */
    layoutConfig() {
      return getLayoutConfig(
        this.menuActive,
        this.pagePlczType,
        this.pageExpand,
        this.$tool.deepClone(this.searchCondition) || [],
        this.plczData.qzid,
        this.addListBjfz,
        this.removeListBjfz
      );
    },
    primaryKey() {
      return this.layoutConfig.primaryKey;
    },
    rightKeySet() {
      return new Set(this.rightList.map(e => e.data[this.primaryKey]));
    },
    ...mapGetters({ addListBjfz: 'addList', removeListBjfz: 'removeList' })
  },
  watch: {
    pagePlczType() {
      this.delNum = 0;
      this.total = 0;
    }
  },
  filters: {
    filterRightList(data, isZdr) {
      let list = [];
      if (isZdr) {
        list = [
          { label: '新增停控', value: 'xztksq', disabled: !(data.tkzt !== '1' && data.dxsqzt !== '1') },
          { label: '撤销停控', value: 'cxtksq', disabled: !(data.tkzt !== '0' && data.dxsqzt !== '2') }
        ];
      } else {
        // 是否分组
        const isGropup = data.qzid;
        // bkzt：20 布控中 21 即将到期 10 申请中 01 已到期 02 已撤控
        list = [
          { label: '续控', value: 'xk', disabled: !(isGropup || data.bkzt === '20' || data.bkzt === '21') },
          { label: '撤控', value: 'ck', disabled: !(isGropup || data.bkzt === '20' || data.bkzt === '21') }
        ];
        if (isGropup) {
          list.push(
            { label: '编辑', value: 'bjfz', disabled: false },
            { label: '解散分组', value: 'jsfz', disabled: false }
          );
        } else {
          list.unshift({ label: !data.sfgz ? '关注' : '取消关注', value: 'gz' });
          // 分组不能移动
          list.push(
            { label: '移动到…', value: 'ydd', disabled: false },
            { label: '移动到分组', value: 'yddfz', disabled: false, slot: true }
          );
        }
      }
      return list;
    }
  },
  methods: {
    ...mapActions({ SBM_PROVISIONAL_ID: 'SBM_PROVISIONAL_ID', addBkdxBjfz: 'addBkdx' }),
    // 菜单切换事件
    changeMenu(value) {
      this.pagePlczType = false;
      this.delNum = 0;
      this.total = 0;
    },
    addBkdx() {
      this.$router.push({
        name: 'monitor-apply'
      });
      if (this.isAdd) {
        return;
      }
      sqdxApi.getTempId(11).then(res => {
        this.SBM_PROVISIONAL_ID(res.data);
        this.$router.push({
          name: 'monitor-apply'
        });
      });
    },
    addFz() {
      this.pagePlczType = 'xjfz';
      this.layoutConfig.leftTitle = '布控对象';
    },
    // 切换卡片，进入详情页
    changeCard(data) {
      this.pageExpand = false;
      // 选择其他卡片时将之前在分组列表选中的信息置空
      this.activeGroupNode = {};
      this.activeRwdNode = {};
      let name,
        id,
        sfgz = data.sfgz,
        fzmc = data.qzmc;
      switch (this.menuActive) {
        case 'rwd':
          if (data.sqdzt === '01') {
            name = 'monitor-apply';
          } else {
            name = 'monitor-detail-task';
          }
          id = data.id;
          this.activeRwdNode = data;
          break;
        case 'fz':
          name = 'monitor-detail-group';
          id = data.qzid;
          this.activeGroupNode = JSON.parse(JSON.stringify(data));
          break;
        case 'zdry':
          name = 'monitor-detail-zdry';
          id = data.bjzdrybh;
          break;
        case 'link':
          name = 'monitor-link';
          id = data.id;
          break;
        default:
          name = 'monitor-detail';
          id = data.bkdxbh;
          break;
      }
      if (data.sqdzt === '01') {
        this.$router.push({ name, params: { id, fzmc, sfgz }, query: { id, sfgz } });
      } else {
        this.$router.push({ name, params: { id, fzmc, sfgz }, query: { sfgz } });
      }
    },
    infiniteLoad(result, nodeList) {
      // 第一页
      if (result.pageNum === 1) {
        this.total = result.totalElements || 0;
        if (nodeList.length === 0) {
          // 无数据页
          this.$router.replace({
            name: 'monitor-none'
          });
        }
      }
      // 批量操作时隐藏已经被加入右侧的数据
      if (this.pagePlczType) {
        nodeList.forEach(node => {
          if (this.rightKeySet.has(node.data[this.primaryKey])) {
            this.$set(node, 'hide', true);
          }
        });
      }
    },

    // region 停控部分
    // 处理停控申请
    handleStopControlApply(command) {
      this.pagePlczType = command;
    },
    // endregion 停控部分

    // region 批量操作
    rightMenuClick(val, node) {
      if (val === 'gz') {
        const data = node.data;
        const sfgz = +!data.sfgz;
        let concernType = 'BKDX';
        let concernId = data.bkdxbh;
        if (this.menuActive === 'fz') {
          concernType = 'BKQZ';
          concernId = data.qzid;
        }
        concern({ concernType, concernId, sfgz }).then(() => {
          this.$message.success(`${sfgz ? '添加' : '取消'}关注成功！`);
          this.$set(node.data, 'sfgz', sfgz);
          if (this.menuActive === 'bkdx') {
            this.rightOperationSuccess(node.data);
          }
          if (this.menuActive === 'wdgz') {
            const layout = this.$refs.layout;
            let flag = false;
            if (layout.scrollModel === this.$route.params.id) {
              // 在我的关注菜单进行取关操作，如果详情页是当前选中项，刷新时回到第一页的第一条
              flag = true;
            }
            layout.search(false, false, flag);
          }
        });
        return;
      }
      // 解散分组
      if (val === 'jsfz') {
        const data = node.data;
        confirm('要解散分组吗？解散分组，分组成员将被移出分组，但不会被删除。').then(() => {
          jsQz(data.qzid).then(() => {
            this.$message.success('分组解散成功！');
            this.$refs.layout.search(false, false, true);
          });
        });
        return;
      }
      if (val === 'gz' || val === 'yddfz') {
        return;
      }
      if (this.menuActive === 'fz') {
        // 分组的续控撤控编辑，显示布控对象
        this.rightList = [];
      } else {
        this.$set(node, 'hide', true);
        this.rightList = [node];
      }
      this.plczData = node.data;
      this.pagePlczType = val;
    },
    // 右键操作成功
    rightOperationSuccess(data) {
      if (data && data.bkdxbh != this.$refs.layout.$refs.detail.baseInfo.bkdxbh) return;
      if (this.$refs.layout && this.$refs.layout.$refs.detail) {
        this.$nextTick(() => {
          // 刷新详情基本信息
          this.changeCard(data);
          this.$refs.layout.$refs.detail.getBaseInfo();
          this.$refs.layout.$refs.detail.geFzmc();
        });
      }
    },
    addToRight(list) {
      if (!list) {
        list = this.$refs.layout.$refs.scroll.nodeListShow.filter(e => e.checked);
        this.isCheckAll = false;
      }
      if (this.pagePlczType === 'bjfz') {
        // 编辑分组走另外的逻辑
        this.addBkdxBjfz(list.map(e => e.data));
        this.$refs.layout.search();
        return;
      }
      const tempList = [...this.rightList];
      for (let i = list.length - 1; i >= 0; i--) {
        const node = list[i];
        tempList.unshift(node);

        this.$set(node, 'hide', true);
        this.$set(node, 'checked', false);
      }
      this.rightList = tempList;
      this.$nextTick(this.judgeIsScroll);
    },
    plczDel(node) {
      if (this.pagePlczType === 'bjfz') {
        // 编辑分组走另外的逻辑，这里不需要处理
        return;
      }
      const key = node.data[this.primaryKey];
      if (this.plczData[this.primaryKey] === key) {
        const nodeList = this.$refs.layout.$refs.scroll.nodeList;
        const item = nodeList.find(e => e.data[this.primaryKey] === key);
        if (item) {
          this.$set(item, 'hide', false);
        }
      }
    },
    indeterminateChange(val) {
      const nodeListShow = this.$refs.layout.$refs.scroll.nodeListShow;
      nodeListShow.forEach(node => {
        this.$set(node, 'checked', val);
      });
    },
    checkedChange(node, list) {
      const len = list.filter(e => e.checked).length;
      this.isIndeterminate = len !== 0 && len !== list.length;
    },
    cancelPlcz(flage, type) {
      // 编辑分组返回后，
      // if (type === 'is-edit') {
      //   this.layoutConfig.leftTitle = '分组';
      // }
      this.pagePlczType = false;
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
        { name: this.layoutConfig.leftTitle + '列表导出.xls', type: 'FILE_NAME', format: '', split: '', display: '' },
        { name: 'hmlxzh', type: 'CODE', format: 'BM_BKDX_HMLX', split: '', display: '对象类型' },
        { name: 'hmnr', type: 'CHAR', format: '', split: '', display: '对象信息' },
        { name: 'rylb', type: 'CHAR', format: '', split: '', display: '人员类别' },
        { name: 'ryjb', type: 'CHAR', format: '', split: '', display: '人员等级' },
        { name: 'szqt', type: 'CHAR', format: '', split: '', display: '所在群体' },
        { name: 'xm', type: 'CHAR', format: '', split: '', display: '姓名' },
        { name: 'xb', type: 'CODE', format: 'BM_XB0000', split: '', display: '性别' },
        { name: 'nl', type: 'CHAR', format: '', split: '', display: '年龄' },
        { name: 'mz', type: 'CODE', format: 'BM_MZ0000', split: '', display: '民族' },
        { name: 'hjdbh', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '户籍地' },
        { name: 'jg', type: 'CODE', format: 'BM_BZ_XZQH', split: '', display: '籍贯' },
        { name: 'sqsj', type: 'DATE', format: 'yyyy-MM-dd HH:mm:ss', split: '', display: '申请时间' },
        { name: 'bkzq', type: 'CHAR', format: '', split: '', display: '布控周期' }
      ];
      if (this.menuActive === 'zdry') {
        list = [
          {
            name: this.layoutConfig.leftTitle + '列表导出.xls',
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
      }
      nzdrApi
        .toResultExport(
          this.layoutConfig.showExportUrl,
          this.layoutConfig.leftListConfig.sortProps,
          list,
          this.layoutConfig.leftListConfig.searchCondition,
          this.total,
          {
            fileName: this.layoutConfig.leftTitle + '列表导出.xls'
          }
        )
        .then(res => {
          console.log(res);
        });
    }
    // endregion 批量操作
  },
  activated() {
    const $this = this;
    EventBus.$on('edit-group', data => {
      $this.pagePlczType = 'bjfz';
      $this.activeGroupNode = data;
      $this.plczData = data;
      $this.layoutConfig.leftTitle = '布控对象';
    });
    EventBus.$on('edit-rwd', () => {
      let id = this.activeRwdNode.id,
        sfgz = this.activeRwdNode.sfgz,
        fzmc = this.activeRwdNode.qzmc;
      this.$router.push({
        name: 'monitor-apply',
        params: { id, fzmc, sfgz },
        query: { id, sfgz }
      });
    });
  },
  destroyed() {
    EventBus.$off();
  }
};
</script>

<style lang="scss" scoped>
.qwbk-monitor {
  /deep/ .flex-1 {
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
  .el-dropdown + .el-button {
    margin-left: 5px;
  }
}

.infinite-list__no-more {
  $top: 3rem;
  position: relative;
  padding: $top 0 1.5rem;
  .no-more_line {
    width: 100%;
    height: 0;
    border-bottom: var(--border-light);
  }
  .no-more_tip {
    background: var(--background-color);
    padding: 0 1rem;
    color: var(--color-text-placeholder);
    position: absolute;
    top: $top;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
