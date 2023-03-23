<!--
 审批申请信息-详情
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info
        :info="info"
        :isShowPhone="false"
        :isFollowFlag="false"
        @updateSearch="$emit('updateSearch', $event)"
        @page-change="$emit('page-change', $event)"
      >
        <template v-slot:needfollow>
          <el-button
            v-if="shortSecurityOrg === info.dqspdw || securityOrg === info.dqspdw"
            type="primary"
            @click="bkspAgree(1)"
            >同意</el-button
          >
          <el-button v-if="shortSecurityOrg === info.dqspdw || securityOrg === info.dqspdw" @click="bkspAgree(0)"
            >退回</el-button
          >
        </template>
        <template v-slot:title="{ form }">
          <span class="main-label__slot">
            <span
              >{{ form.sqmc }}
              <!-- （共<a class="font-blue">{{ form.bkdx ? form.bkdx : '0' }}</a>个） -->
            </span>
          </span>
        </template>
        <template v-slot:content="{ form }">
          <el-form inline label-width="6em">
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="申请人员：">{{ form.sqrxm ? form.sqrxm : '-' }}</el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="申请类别：">
                  <span v-code="{ code: 'BM_BKSQ_BKLB', value: form.bklb }"></span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="布控单位：">
                  <span :data-type="form.sqdwdm" v-code="{ code: 'BM_DEPT', value: form.sqdwdm }"></span>
                </el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="申请时间：">{{ form.sqsj ? form.sqsj : '-' | filterDate }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </base-info>
      <div class="detail-list-container">
        <tab-list :tabItems="tabList" v-model="tabItemShow"></tab-list>
        <div class="detail-list-container__center">
          <keep-alive>
            <application-information-local :id="tempId" v-if="tabItemShow === 'sqxx'"></application-information-local>
            <control-target class="control-target" :id="tempId" v-if="tabItemShow === 'bkdx'"></control-target>
            <time-line-local ref="lzxxTab" :id="tempId" v-if="tabItemShow === 'lzxx'"></time-line-local>
          </keep-alive>
        </div>
      </div>
    </div>
  </dg-scrollbar>
</template>
<script>
import TabList from '@icccPath/components/tab-list/index';
import BaseInfo from '@icccPath/components/base-info/index';
import { queryApplyInfo } from '@icccPath/api/bksp';
import ApplicationInformationLocal from '../../application-information/index';
import ControlTarget from './control-target/index';
import timeLineLocal from '../../time-line-local/index';
import store from '@icccPath/store';
export default {
  name: 'bksp-detail',
  // 接收父页面传过来的属性
  props: {
    id: String
  },
  // 页面数据绑定
  data() {
    return {
      securityOrg: store.getters && store.getters.user && store.getters.user.securityOrg,
      shortSecurityOrg: store.getters && store.getters.user && store.getters.user.shortSecurityOrg,
      tempId: '',
      tabItemShow: 'sqxx',
      tabList: [
        { label: '申请信息', value: 'sqxx' },
        { label: '布控对象', value: 'bkdx' },
        { label: '流转信息', value: 'lzxx' }
      ],
      info: {}
    };
  },
  components: {
    ApplicationInformationLocal,
    ControlTarget,
    timeLineLocal,
    TabList,
    BaseInfo
  },
  watch: {
    id: {
      handler(val) {
        if (this.tempId === val) {
          return;
        }
        val && this.init();
      },
      immediate: true
    }
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    async init() {
      this.tempId = this.id;
      this.info = {};
      const { data } = await queryApplyInfo(this.tempId, 'QZ_BKSQ');
      this.info = data;
    },
    /**
     * @description:审批方法
     * @param {Number} type 判断是同意还是拒绝
     */
    bkspAgree(type) {
      const _this = this;
      this.$dialog({
        title: '布控审批',
        component: import('@icccPath/components/bksp-form/index'),
        maxmin: false,
        resize: false,
        skin: 'layer-no-padding',
        btnAlign: 'c',
        props: {
          typeNum: type,
          id: this.tempId
        },
        on: {
          success: function() {
            _this.$message({
              type: 'success',
              message: '操作成功!'
            });
            _this.init();
            if (_this.tabItemShow === 'lzxx') {
              _this.$refs.lzxxTab.search();
            }
            _this.$parent.search();
          }
        },
        area: ['700px', '406px']
      });
    },
    pageChange(type) {
      this.$emit('page-change', {
        /**
         * 条数改变 -1: 上一条, 1: 下一条
         */
        type,
        /**
         * 回调函数
         * @param params.data
         * @param params.node
         */
        callback: params => {
          if (params) {
            // const { data, node } = params;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.monitor-list-detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  flex: 1;
  .detail-list-container {
    flex: 1;
    background: var(--color-white);
    &__center {
      padding: 0rem 2rem;
    }
  }
}
</style>
