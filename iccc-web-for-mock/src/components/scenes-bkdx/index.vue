<!--
 * @Author: Liugh
 * @Date: 2020-10-20 09:10:51
 * @LastEditTime: 2021-02-24 09:07:23
 * @LastEditors: Do not edit
 * @Description:  新增布控对象组件
-->
<template>
  <div class="scenes-bkdx">
    <addControlObject v-bind="$attrs" @addObj="addObj" ref="addObj"></addControlObject>
    <div v-if="tabList[0].num || importing">
      <div class="title-2">布控对象</div>
      <div class="scenes-bkdx__content">
        <ul class="tabList">
          <li
            v-for="item in tabList"
            :key="item.value"
            @click.stop="tabClick(item)"
            :class="{ active: active === item.value }"
          >
            {{ item.label }}
            <span v-if="item.num">({{ item.num }})</span>
            <i class="el-icon-refresh" v-if="active === item.value && importing" @click.stop="initSearch(active)"></i>
          </li>
          <li class="tip" v-if="importing">
            <span>共导入{{ importObj.fileSize }}个文件，共{{ importObj.total }}条，文件解析中</span>
            <el-progress
              :percentage="importObj.percentage"
              :text-inside="false"
              :stroke-width="11"
              :color="customColors"
            ></el-progress>
            <i class="el-icon-close" v-if="importObj.percentage !== 100" @click="stopImport"></i>
          </li>
        </ul>
        <div class="errButton" v-if="active == '0'">
          <dg-button type="primary" plain @click="exportErr">导出异常数据</dg-button>
          <dg-button type="primary" plain @click="emptyErr">清空异常数据</dg-button>
        </div>
        <div class="grid-container" v-if="addListData.length">
          <controlObjectCard
            v-for="(item, index) in addListData"
            :key="item.id"
            :item="item"
            :index="index"
            :usePopper="true"
            @delObj="delObj"
            @showPopperChange="showPopperChange"
          ></controlObjectCard>
        </div>
        <div v-else><no-record></no-record></div>
        <div class="scenes-bkdx__content__pagination">
          <el-pagination
            v-if="tabList[0].num"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searyQuery.page"
            :page-sizes="[12, 24, 36]"
            :page-size="searyQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import addControlObject from './modules/add-control-object/index';
import controlObjectCard from './modules/control-object-card/index';
import noRecord from '@icccPath/components/base/no-record';
import sqdxApi from '@icccPath/api/sqdx/index.js';
export default {
  name: 'scenes-bkdx', // 组件名称
  components: { addControlObject, controlObjectCard, noRecord }, // 注册局部组件
  props: {
    // 接收父组件的数据
  },
  data() {
    // 组件内部参数
    return {
      // 参数名称及默认值
      isShow: false,
      popoverWidth: 1280,
      relevanceShow: false, // 获取关联弹窗是否显示
      relevanceDis: false, // 获取关联按钮是否禁用
      importing: false,
      timeoutTime: null,
      importObj: { percentage: 0, total: 0, fileSize: 0 },
      addListData: [], // 列表数据
      form: {}, // 获取关联弹窗Form
      searyQuery: {
        page: 1,
        size: 12,
        sort: {},
        searchCondition: {
          and: [
            { name: 'SQID', value: '', op: '=' },
            { name: 'SFYX', value: '', op: '=' }
          ]
        }
      },
      total: 0, // 分页总数
      // TODO 暂时不做
      attributeList: [
        { label: '手机号', value: 'sjh' },
        { label: 'QQ', value: 'qq' }
      ],
      relationalObjectList: [
        { label: '配偶', value: 'po' },
        { label: '儿子', value: 'ez' }
      ],
      active: 'all', // Tab 切换值
      tabList: [
        // Tab 数据
        { label: '全部', value: 'all', num: '' },
        { label: '可布控', value: '1', num: '' },
        { label: '异常', value: '0', num: '' }
      ],
      customColors: [
        { color: '#909399', percentage: 30 },
        { color: '#e6a23c', percentage: 70 },
        { color: '#67c23a', percentage: 100 }
      ]
    };
  },
  computed: {
    ...mapGetters(['addListObj', 'editObject', 'provisionalId', 'editShow'])
  },
  watch: {
    editShow(val) {
      if (val) return;
      this.numCalc();
      this.initSearch(this.active);
    },
    '$route.query.id': {
      handler(val) {
        if (!val || !this.provisionalId) return;
        this.numCalc();
        this.initSearch(this.active);
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['SBM_IS_NEXT', 'SBM_ADD_LIST_OBJ', 'SBM_EDIT_SHOW']),
    /**
     * @description: 初始化
     */
    init() {
      this.$nextTick(() => {
        this.popoverWidth = this.$parent.$el.clientWidth + 64;
      });
      if (this.provisionalId) {
        this.numCalc();
        if (this.addListObj['addListData'] && this.addListObj['addListData'].length) {
          this.addListData = this.addListObj['addListData'];
        } else {
          this.initSearch(this.active);
        }
      }
    },
    /**
     * @description:获取已经添加的对象列表
     * @param {String} type 全部all，异常0，正常1
     */
    initSearch(type) {
      this.searyQuery.searchCondition.and[0].value = this.provisionalId;
      this.searyQuery.searchCondition.and[1].value = type;
      let condition = JSON.parse(JSON.stringify(this.searyQuery));
      if (type == 'all') {
        condition.searchCondition.and.splice(1, 1);
      } else {
        condition = { ...this.searyQuery };
      }
      condition.searchCondition = JSON.stringify(condition.searchCondition);
      condition.page = condition.page - 1;
      condition.sort = JSON.stringify(condition.sort);
      sqdxApi.paging(condition).then(res => {
        this.total = res.data.totalElements;
        this.addListData = res.data.content;
        this.addListData.forEach(item => {
          this.$set(item, 'bkdxsx', JSON.parse(item.bkdxsx));
        });
        this.SBM_ADD_LIST_OBJ({ name: 'addListData', list: this.addListData });
      });
    },
    /**
     * @description:tab切换事件
     * @param {Object} item tabList项
     */
    tabClick(item) {
      this.active = item.value;
      this.initSearch(this.active);
    },
    /**
     * @description: 统计全部，异常，正常数据
     */
    numCalc() {
      // TODO 使用统计接口对接
      sqdxApi.availableExceptionStatistics(this.provisionalId).then(res => {
        this.tabList[0].num = res.data.total;
        this.tabList[1].num = res.data.valid;
        this.tabList[2].num = res.data.invalid;
        if (res.data.total) {
          this.SBM_IS_NEXT(true);
        } else {
          this.SBM_IS_NEXT(false);
        }
      });
    },
    /**
     * @description:添加对象
     * @param {Object} value 添加的对象值
     */
    addObj(value) {
      if (typeof value == 'boolean' && value) {
        this.importing = true;
        this.fileLoadStart(false);
      } else {
        // 切断原型关系
        if (!value) return;
        let item = { ...value };
        this.$set(item, 'showPopper', false); // 添加展开标识
        this.initSearch(this.active);
        this.numCalc();
      }
    },
    /**
     * @description: 导入文件的轮询方法
     */
    fileLoadStart(flag) {
      this.timeoutTime = setTimeout(
        () => {
          sqdxApi
            .loadStat(this.provisionalId)
            .then(res => {
              if (res.data.sfjs == '1') {
                this.importing = false;
                clearTimeout(this.timeoutTime);
                this.initSearch(this.active);
              } else {
                this.fileLoadStart(true);
              }
              this.importObj.percentage = Number(res.data.bfb);
              this.importObj.total = Number(res.data.sum);
              this.importObj.fileSize = Number(res.data.fjs);
              // this.initSearch(this.active);
              this.numCalc();
            })
            .catch(err => {
              console.log(err);
              this.importing = false;
              clearTimeout(this.timeoutTime);
            });
        },
        flag ? 1000 : 0
      );
    },
    /**
     * @description: 清空异常数据
     */
    emptyErr() {
      sqdxApi.deleteImportErr(this.provisionalId).then(res => {
        this.$message.success('操作成功');
        this.numCalc();
        this.initSearch(this.active);
      });
    },
    /**
     * @description: 停止轮询
     */
    stopImport() {
      clearTimeout(this.timeoutTime);
      sqdxApi.deleteImport(this.provisionalId).then(res => {
        this.importing = false;
        this.initSearch(this.active);
      });
    },
    /**
     * @description: 导出异常数据
     */
    exportErr() {
      sqdxApi.downloadError(this.provisionalId).then(res => {
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(res); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '失败对象.xlsx'; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
    },
    /**
     * @description:删除对象
     * @param {Object} value 删除的值
     * @param {Stgring|Number} index 删除的下标
     */
    delObj(value, index) {
      sqdxApi.del(value.id).then(res => {
        this.$message.success('操作成功');
        // TODO 这里需要判断是否全部删除
        this.initSearch(this.active);
        this.numCalc();
      });
    },
    /**
     * @description:点击展开之后的回调
     * @param {Object} item 当前展开项
     */
    showPopperChange(item) {
      let value = this.addListData;
      const node = value.find(e => e.showPopper && e !== item);
      node && this.$set(node, 'showPopper', false);
    },
    /**
     * @description:切换条数事件
     * @param {String} val 当前条数
     */
    handleSizeChange(val) {
      this.searyQuery.size = val;
      this.initSearch(this.active);
    },
    /**
     * @description:翻页事件
     * @param {String} val 当前页数
     */
    handleCurrentChange(val) {
      this.searyQuery.page = val;
      this.initSearch(this.active);
    }
  }, // 内部方法
  created() {
    this.init();
  }, // 组件创建完成后
  // 结束轮询事件
  beforeDestroy() {
    if (this.importing) {
      clearTimeout(this.timeoutTime);
      this.provisionalId && sqdxApi.deleteImport(this.provisionalId);
    }
  }
};
</script>
<style lang="scss" scoped>
.card-margin {
  .el-col:nth-child(4n + 1) {
    .control-object-card-main {
      margin-left: 0px;
    }
  }

  .el-col {
    .control-object-card-main {
      margin-left: 10px;
    }
  }
}
.scenes-bkdx {
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  // min-height: 440px;
  &__content {
    &__pagination {
      margin-top: 1.5rem;
      text-align: center;
    }
    .tabList {
      position: relative;
      margin: 0 0 16px 0;
      display: flex;
      list-style: none;
      border-bottom: none;
      border-left: 1px solid var(--border-color-base);
      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background: var(--border-color-base);
        position: absolute;
        bottom: 0;
      }
      li {
        cursor: pointer;
        font-size: 16px;
        border-top: 1px solid var(--border-color-base);
        border-right: 1px solid var(--border-color-base);
        padding: 5px 24px;
        list-style: none;
        &.active {
          z-index: 1;
          color: var(--color-primary);
          border-bottom: 1px solid var(--color-white);
        }
        .el-icon-close {
          &:hover {
            color: var(--color-danger);
          }
        }
      }
      .tip {
        font-size: 0.875rem;
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        padding: 5px 0px;
        border-top: none;
        border-right: none;
        .el-progress {
          display: flex;
          align-items: center;
          margin: 0 5px;
          width: 11.25rem !important;
          /deep/ .el-progress__text {
            font-size: 0.875rem !important;
          }
        }
      }
    }
    .relevanceButton {
      margin-bottom: 16px;
    }
    .switch {
      display: inline-block;
      transition: transform 0.5s;
      font-size: 12px;
    }
    .switch_true {
      transform: rotate(-90deg);
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, 19.5rem);
      gap: 1rem;
      grid-gap: 1rem;
    }
  }
  .errButton {
    text-align: right;
    margin-bottom: 16px;
  }
}
.popover_button {
  text-align: center;
}
</style>
