<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info
        isGroupDetail
        :isFollowFlag="false"
        :info="baseInfo"
        :qzId="id"
        concernId="qzid"
        concernType="BKQZ"
        idKey="qzid"
        @edit-group="handleEditGroup"
        isGroup
        @updateSearch="$emit('updateSearch', $event)"
        @page-change="$emit('page-change', $event)"
        @follow-with="onFollowWith"
      >
        <template v-slot:needfollow>
          <el-button @click="deleteGroup">解散分组</el-button>
        </template>

        <template v-slot:title="{ form }">
          <span class="main-label__slot">
            <span v-if="!isEditGroupName"
              >{{ form.qzmc }}（共<a class="font-blue">{{ baseInfo.zrs || 0 }}</a
              >个）</span
            >
            <el-input
              v-if="isEditGroupName"
              ref="myInput"
              style="width: 230px;"
              v-model="form.qzmc"
              placeholder="请输入分组名称，不超过20个字符"
              maxlength="20"
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
                <el-form-item label="布控对象：">{{ baseInfo.zrs ? baseInfo.zrs : '0' }}个</el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="布控中："
                  ><span class="tip__attract">{{ baseInfo.bkz ? baseInfo.bkz : '0' }}</span
                  >个</el-form-item
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="创建时间：">
                  {{ baseInfo.cjsj ? $dayjs(baseInfo.cjsj).format('YYYY-MM-DD') : '-' }}
                </el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="已到期："
                  ><span class="tip__warning">{{ baseInfo.ydq ? baseInfo.ydq : '0' }}</span
                  >个</el-form-item
                >
              </el-col>
            </el-row>
          </el-form>
        </template>
      </base-info>
      <div class="detail-list-container">
        <tab-list :tabItems="tabList" v-model="tabItemShow"></tab-list>
        <div class="detail-list-container__center">
          <keep-alive>
            <warning-trajectory
              v-if="tabItemShow === 'yjgj'"
              concernId="id"
              concernType="GJ"
              url="/v1/qzdxgjs/search"
              :bzhm="tempId"
              bzhmKey="QZID"
              popoverKey="CONDITIONS_QZ_DXGJ"
              placeholder="请输入布控号码、姓名、发生地点查询"
              :sortProps="[{ XXBDSJ: 'DESC' }, { HDFSSJ: 'ASC' }]"
            ></warning-trajectory>
            <!--<control-log v-if="tabItemShow === 'bkrz'"></control-log>-->
            <member-info v-if="tabItemShow === 'cyxx'" :id="tempId" @member-click="memberClick"></member-info>
          </keep-alive>
        </div>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import TabList from '@icccPath/components/tab-list/index';
import BaseInfo from '@icccPath/components/base-info/index';
import WarningTrajectory from '../../warning-trajectory/index';
// import ControlLog from './control-log/index';
import MemberInfo from './member-info/index';
import bkdxApi from '@icccPath/api/bkdx/bkdx';
import qzxxApi from '@icccPath/api/bkdx/qzxx';
import nzdrApi from '@icccPath/api/nzdr/index';
import { EventBus } from './event-bus';
import { jsQz } from './../request';
import { confirm } from '@icccPath/utils/tool';

export default {
  name: 'monitor-detail-group',
  props: {
    id: String,
    fzmc: String,
    sfgz: [Boolean, String]
  },
  data() {
    return {
      tempId: '',
      baseInfo: {
        qzid: this.tempId,
        sfgz: this.sfgz
      },
      isEditGroupName: false,
      tabItemShow: 'cyxx',
      tabList: [
        { label: '成员信息', value: 'cyxx' },
        { label: '轨迹预警', value: 'yjgj' }
        // { label: '布控日志', value: 'bkrz' }
      ]
    };
  },
  components: {
    WarningTrajectory,
    TabList,
    BaseInfo,
    MemberInfo
  },
  watch: {
    id: {
      handler(val) {
        val && this.init();
      },
      immediate: true
    }
  },
  methods: {
    init() {
      if (this.tempId === this.id) {
        return;
      }
      this.tempId = this.id;
      this.baseInfo = {
        qzid: this.tempId,
        sfgz: this.sfgz
      };
      bkdxApi.load_stat(this.tempId).then(res => {
        this.baseInfo = JSON.parse(JSON.stringify(res.data));
        this.baseInfo.qzid = this.tempId;
        this.baseInfo.sfgz = this.sfgz;
      });
    },
    memberClick(data) {
      this.$router.push({
        name: 'monitor-detail',
        params: {
          id: data.bkdxbh
        },
        query: {
          fzid: this.tempId
        }
      });
    },
    editClick() {
      // 点击保存
      if (this.isEditGroupName) {
        qzxxApi
          .update(this.tempId, { id: this.tempId, qzmc: this.$refs.myInput.value })
          .then(res => {
            const val = this.$refs.myInput.value;
            this.baseInfo.qzmc = val;
            this.isEditGroupName = !this.isEditGroupName;
            this.$message.success('修改成功');
            // 更新左侧列表
            EventBus.$emit('update-list');
          })
          .catch(err => {
            this.isEditGroupName = !this.isEditGroupName;
          });
        return;
      }
      // 点击编辑
      this.isEditGroupName = !this.isEditGroupName;
      this.$nextTick(() => {
        this.$refs.myInput.focus();
      });
    },
    deleteGroup() {
      confirm('要解散分组吗？解散分组，分组成员将被移出分组，但不会被删除。').then(() => {
        jsQz(this.tempId).then(() => {
          this.$message.success('分组解散成功！');
          EventBus.$emit('update-list', [false, false, true]);
        });
      });
    },
    handleEditGroup(data) {
      EventBus.$emit('edit-group', data);
    },
    onFollowWith(isFollow) {
      const param = {
        sfgz: isFollow,
        concernType: isFollow,
        concernId: this.tempId
      };
      nzdrApi.concern(param).then(res => {
        this.$message.success('操作成功');
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
    background: var(--background-color);
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
</style>
