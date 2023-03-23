<!--
 布控-任务单
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info :isShowPhone="false" :isFollowFlag="false" @page-change="$emit('page-change', $event)">
        <template v-slot:needfollow>
          <el-button v-if="detail.sqdzt == '02'" type="primary" @click="handleEditRWD()">编辑</el-button>
          <el-button
            v-if="detail.sqzt == '0' && detail.sqdzt != '02'"
            :type="detail.sqdzt == '02' ? '' : 'primary'"
            @click="withdraw"
            >撤回</el-button
          >
        </template>
        <template v-slot:title>
          <span class="main-label__slot">
            <span v-if="!isEditGroupName"
              >{{ detail.sqmc | filterText }}（共<a class="font-blue">{{ detail.sqdxgs ? detail.sqdxgs : '0' }}</a
              >个）</span
            >
            <el-input
              v-if="isEditGroupName"
              ref="myInput"
              style="width: auto;"
              v-model="detail.sqmc"
              placeholder="请输入申请单名称"
            ></el-input>
            <i
              style="cursor: pointer;"
              class="iconfont"
              :class="['editGropIcon', isEditGroupName == '' ? 'iconl-edit' : 'iconl-save']"
              @click="editClick()"
            ></i>
          </span>
        </template>
        <template v-slot:content>
          <el-form inline label-width="6em">
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="申请状态：">
                  <span
                    class="icon-splb-spzt"
                    :data-type="detail.sqdzt"
                    v-code="{ code: 'BM_BKSQ_SQDZT', value: detail.sqdzt }"
                  ></span
                ></el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="布控类型：">
                  <span
                    class="tip__warning"
                    :data-type="detail.bklx"
                    v-code="{ code: 'BM_BKSQ_BKLX', value: detail.bklx }"
                  ></span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <!--                {{ detail.sqsj ? detail.sqsj : '-' }}-->
                <el-form-item label="申请时间：">
                  {{
                    detail.sqsj ? $dayjs(detail.sqsj).format('YYYY-MM-DD HH:mm:ss') : detail.sqsj | filterText
                  }}</el-form-item
                >
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <!--                <el-form-item label="任务状态：">-->
                <!--                  <span-->
                <!--                    class="tip__attract"-->
                <!--                    :data-type="detail.sqdzt"-->
                <!--                    v-code="{ code: 'BM_BKSQ_SQDZT', value: detail.sqdzt }"-->
                <!--                  ></span>-->
                <!--                  &lt;!&ndash;                  {{ detail.bkjsrq }}&ndash;&gt;-->
                <!--                  <span-->
                <!--                    >（{{-->
                <!--                      detail.bkjsrq ? $dayjs(detail.bkjsrq).format('YYYY-MM-DD') : detail.bkjsrq | filterText-->
                <!--                    }}-->
                <!--                    布控到期）</span-->
                <!--                  >-->
                <!--                </el-form-item>-->
              </el-col>
            </el-row>
          </el-form>
        </template>
      </base-info>
      <div class="detail-list-container">
        <tab-list :tabItems="tabList" v-model="tabItemShow"></tab-list>
        <div class="detail-list-container__center">
          <keep-alive>
            <trajectory-target :id="tempId" v-if="tabItemShow === 'gjdx'"></trajectory-target>
            <application-information-local v-if="tabItemShow === 'sqxx'" :id="tempId"></application-information-local>
            <control-target class="control-target" v-if="tabItemShow === 'bkdx'" :id="tempId"></control-target>
            <time-line-local ref="lzxxTab" v-if="tabItemShow === 'lzxx'" :id="tempId"></time-line-local>
          </keep-alive>
        </div>
      </div>
    </div>
  </dg-scrollbar>
</template>
<script>
import TabList from '@icccPath/components/tab-list/index';
import BaseInfo from '@icccPath/components/base-info/index';
import ApplicationInformationLocal from '../../application-information/index';
import ControlTarget from './control-target/index';
import timeLineLocal from '../../time-line-local/index';
import TrajectoryTarget from './trajectory-target/index';
import rwdSqxxApi from '@icccPath/api/rwd-sqxx';
import { EventBus } from '../group-detail/event-bus';
export default {
  name: 'monitor-detail-task',
  // 接收父页面传过来的属性
  props: {
    id: String
  },
  // 页面数据绑定
  data() {
    return {
      tempId: '',
      isEditGroupName: false,
      detail: {},
      tabItemShow: 'gjdx',
      tabList: [
        { label: '轨迹对象', value: 'gjdx' },
        { label: '申请信息', value: 'sqxx' },
        { label: '布控对象', value: 'bkdx' },
        { label: '流转信息', value: 'lzxx' }
      ]
    };
  },
  components: {
    TrajectoryTarget,
    ApplicationInformationLocal,
    ControlTarget,
    timeLineLocal,
    TabList,
    BaseInfo
  },
  // 计算属性
  computed: {},
  watch: {
    id: {
      handler(val) {
        val && this.init();
      },
      immediate: true
    }
  },
  // 方法
  methods: {
    init() {
      if (this.tempId === this.id) {
        return;
      }
      this.tempId = this.id;
      this.loadData();
    },
    loadData() {
      let that = this;
      that.detail = {};
      rwdSqxxApi.load(this.tempId).then(res => {
        if (res.data) {
          that.detail = res.data;
        }
      });
    },
    withdraw() {
      let that = this;
      this.$confirm('确认要撤回申请吗？').then(() => {
        rwdSqxxApi.withdraw(that.tempId).then(res => {
          if (res.data) {
            that.$emit('updateSearch');
            if (this.tabItemShow === 'lzxx') {
              this.$refs.lzxxTab.search();
            }
            that.loadData();
            that.$message({ type: 'success', message: '操作成功' });
          } else {
            that.$message({ type: 'error', message: res.data.msg });
          }
        });
      });
    },
    editClick() {
      this.isEditGroupName = !this.isEditGroupName;
      let that = this;
      if (this.isEditGroupName) {
        this.$nextTick(function() {
          this.$refs.myInput.focus();
        });
      } else {
        let sqxx = {
          id: that.tempId,
          sqmc: that.detail.sqmc
        };
        rwdSqxxApi
          .sqxxupdate(this.tempId, sqxx)
          .then(res => {
            if (res.data) {
              that.$emit('updateSearch');
              that.$message({ type: 'success', message: '修改成功' });
              that.init();
            } else {
              // that.$message({ type: 'error', message: res.data.msg });
              that.isEditGroupName = !that.isEditGroupName;
            }
          })
          .catch(err => {
            that.isEditGroupName = !that.isEditGroupName;
          });
      }
    },
    handleEditRWD(val) {
      EventBus.$emit('edit-rwd');
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
      height: calc(100% - 19rem);
      // position: absolute;
      width: 100%;
    }
  }
  /deep/ .tip__attract {
    color: var(--color-danger);
  }
  /deep/ .tip__warning {
    color: var(--color-warning);
  }
}
.editGropIcon {
  font-size: 14px;
}
.iconl-edit {
  &:hover {
    color: var(--button-color-primary);
  }
}
.icon-splb-spzt {
  min-width: 3.75rem;
  text-align: center;
  color: var(--color-text-primary);
  &[data-type='0'] {
    color: var(--color-danger);
    // color: var(--color-warning);
  }
  &[data-type='10'] {
    color: var(--color-danger);
  }
  &[data-type='20'] {
    color: var(--color-danger);
  }
  &[data-type='4'] {
    color: var(--color-danger);
  }
  &[data-type='30'] {
    color: var(--color-success);
  }
  &[data-type='1'] {
    color: var(--color-success);
  }
  &[data-type='11'] {
    color: var(--color-success);
  }
  &[data-type='21'] {
    color: var(--color-success);
  }
  &[data-type='3'] {
    color: var(--color-success);
  }
  &[data-type='2'] {
    color: var(--color-warning);
  }
  &[data-type='12'] {
    color: var(--color-warning);
  }
  &[data-type='22'] {
    color: var(--color-warning);
  }
  &[data-type='32'] {
    color: var(--color-warning);
  }
  &[data-type='02'] {
    color: var(--color-text-regular);
  }
  &[data-type='31'] {
    color: var(--color-text-regular);
  }
}
</style>
