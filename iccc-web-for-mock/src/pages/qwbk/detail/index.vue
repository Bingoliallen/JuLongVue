<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info
        ref="baseInfo"
        :info="baseInfo"
        :idCard="baseInfo.hmnr"
        :avatarType="baseInfo.hmlx"
        module="QZ_BKSQ"
        concernId="bkdxbh"
        concernType="BKDX"
        idKey="bkdxbh"
        @updateSearch="$emit('updateSearch', $event)"
        @page-change="$emit('page-change', $event)"
      >
        <template v-slot:needfollow v-if="$route.query.fzid">
          <el-button @click="backGroup">返回分组</el-button>
        </template>

        <template v-slot:title="{ form }">
          <span class="main-label__slot">
            <span style="margin-right: 1rem">
              <span v-if="baseInfo.hmlx === 'RLZP'">人像照片</span>
              <template v-else>
                <span>{{ baseInfo.hmnr }}</span>
                <span v-if="baseInfo.hmlx === '111'">&nbsp;{{ baseInfo.xm || '' }}</span>
                <span
                  class="hmlxzh"
                  v-else-if="baseInfo.hmlx === 'CPH'"
                  v-code="{ code: 'BM_BKDX_HMLX', value: baseInfo.hmlxzh, emptyText: ' ', showTitle: true }"
                ></span>
              </template>
            </span>
          </span>
        </template>
        <template v-slot:content="{ form }">
          <el-form inline label-width="6em">
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="所在分组："
                  ><span v-show="!isEditName">{{ fzmc && fzmc.qzmc ? fzmc.qzmc : '无' }}</span>
                  <IcccFzSelect
                    ref="icccFzSelect"
                    v-show="isEditName"
                    v-model="fzmc.qzid"
                    style="width: 115px; display: inline-block;"
                  ></IcccFzSelect>
                  <!-- <el-input
                    v-if="isEditName"
                    ref="myInput"
                    style="width: 100px;"
                    v-model="fzmc.qzmc"
                    placeholder="请输入分组名称"
                  ></el-input> -->
                  <i
                    style="cursor: pointer;font-size:15px;"
                    class="iconfont"
                    :class="['editGropIcon', isEditName == '' ? 'iconl-edit' : 'iconl-save']"
                    @click="editClick()"
                  ></i>
                </el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="布控状态：">
                  <span
                    class="icon-bkzt"
                    :data-type="baseInfo.bkzt"
                    v-code="{ code: 'BM_BKDX_BKZT', value: baseInfo.bkzt }"
                  ></span>
                  <span>
                    （{{
                      baseInfo.bkjsrq ? $dayjs(baseInfo.bkjsrq).format('YYYY-MM-DD') : baseInfo.bkjsrq | filterText
                    }}
                    布控到期）</span
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="申请时间：">{{
                  baseInfo.sqsj ? $dayjs(baseInfo.sqsj).format('YYYY-MM-DD HH:mm:ss') : baseInfo.sqsj | filterText
                }}</el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <!--                <el-form-item label="申请状态：">-->
                <!--                  <span-->
                <!--                    class="tip__warning"-->
                <!--                    :data-type="baseInfo.dxsqzt"-->
                <!--                    v-code="{ code: 'BM_BKDX_SQZT', value: baseInfo.dxsqzt }"-->
                <!--                  ></span>-->
                <!--                  <span-->
                <!--                    >（{{-->
                <!--                      baseInfo.bkksrq ? $dayjs(baseInfo.bkksrq).format('YYYY-MM-DD') : baseInfo.bkksrq | filterText-->
                <!--                    }}-->
                <!--                    申请布控）</span-->
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
            <control-attribute v-if="tabItemShow === 'bksx'" :bkdxbh="tempId" :baseInfo="baseInfo"></control-attribute>
            <warning-trajectory
              v-if="tabItemShow === 'yjgj'"
              concernId="id"
              concernType="GJ"
              url="/v1/bkdxgjs/search"
              :bzhm="tempId"
              bzhmKey="BKDXBH"
              popoverKey="CONDITIONS_QZ_DXGJ"
              placeholder="请输入布控号码、姓名、发生地点查询"
              :sortProps="[{ XXBDSJ: 'DESC' }, { HDFSSJ: 'ASC' }]"
            ></warning-trajectory>
            <application-information-local
              v-if="tabItemShow === 'sqxx'"
              :id="sqid"
              :bkdxbh="tempId"
            ></application-information-local>
            <control-log v-if="tabItemShow === 'bkrz'" :id="tempId"></control-log>
          </keep-alive>
        </div>
      </div>
    </div>
  </dg-scrollbar>
</template>

<script>
import TabList from '@icccPath/components/tab-list/index';
import BaseInfo from '@icccPath/components/base-info/index';
import ControlAttribute from './control-attribute/index';
import ApplicationInformationLocal from '../../application-information/index';
import WarningTrajectory from '../../warning-trajectory/index';
import ControlLog from './control-log/index';
import bkxxApi from '@icccPath/api/qwbk';
import IcccFzSelect from '@icccPath/components/iccc-fz-select';

export default {
  name: 'monitor-detail',
  props: {
    id: String,
    sfgz: [Boolean, Number]
  },
  data() {
    return {
      testval: '020000000000',
      tempId: '',
      fzmc: {},
      sqid: '',
      isEditName: false,
      tabItemShow: 'bksx',
      tabList: [
        {
          label: '布控属性',
          value: 'bksx',
          littlered: false
        },
        {
          label: '轨迹预警',
          value: 'yjgj',
          littlered: false
        },
        {
          label: '申请信息',
          value: 'sqxx',
          littlered: false
        },
        {
          label: '布控日志',
          value: 'bkrz',
          littlered: false
        }
      ],
      baseInfo: {}
    };
  },
  components: {
    ControlAttribute,
    WarningTrajectory,
    ApplicationInformationLocal,
    ControlLog,
    TabList,
    BaseInfo,
    IcccFzSelect
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
      // 数据重置
      this.tempId = this.id;
      this.fzmc = {};
      this.sqid = '';
      this.isEditName = false;
      this.baseInfo = { sfgz: this.sfgz };
      this.getBaseInfo();
      this.geFzmc();
    },
    editClick() {
      let that = this;
      this.isEditName = !this.isEditName;

      if (this.isEditName) {
        // this.$nextTick(function() {
        //   this.$refs.myInput.focus();
        // });
        // 设置默认值
        this.fzmc = {
          id: this.fzmc.id,
          qzid: this.fzmc.id,
          qzmc: this.fzmc.qzmc
        };
      } else {
        this.$refs.icccFzSelect &&
          this.$refs.icccFzSelect.fzList.map(v => {
            if (v.value === that.fzmc.qzid) {
              that.fzmc.qzmc = v.label;
            }
          });
        let tqzxxTo = {
          id: that.fzmc.id,
          qzmc: that.fzmc.qzmc
        };
        // 在布控对象详情修改分组
        if (!that.fzmc.qzid) {
          that.fzmc = {};
        }
        if (!that.fzmc.id || that.$route.name === 'monitor-detail') {
          bkxxApi.addToFz(that.fzmc.qzid, this.baseInfo.bkdxbh).then(() => {
            that.fzmc.id = that.fzmc.qzid;
            that.$message({ type: 'success', message: '分组成功' });
          });
          return;
        }

        bkxxApi
          .updateGroupName(that.fzmc.id, tqzxxTo)
          .then(res => {
            that.fzmc.id = that.fzmc.qzid;
            that.$message({ type: 'success', message: '修改成功' });
          })
          .catch(err => {
            that.isEditName = !that.isEditName;
          });
      }
    },
    // 返回分组
    backGroup() {
      let name = 'monitor-detail-group';
      this.$router.push({
        name,
        params: {
          id: this.$route.query.fzid
        }
      });
    },
    // 获取基本信息
    getBaseInfo() {
      this.baseInfo = {
        sfgz: this.sfgz,
        xm: '',
        ryxx: null
      };
      bkxxApi.getBkdxXq(this.tempId).then(res => {
        this.sqid = res.data.sqid;
        this.baseInfo = res.data;
        this.baseInfo.sfgz = this.sfgz;
        if (!this.sfgz && this.$route.query.sfgz) {
          this.baseInfo.sfgz = JSON.parse(this.$route.query.sfgz);
        }
        this.baseInfo.xm = '';
        this.baseInfo.ryxx = {};
        if (this.baseInfo.hmlx == '111') {
          this.baseInfo.ryxx = { sfzh: this.baseInfo.hmnr };
          this.getqjdxryxx(this.baseInfo.hmnr);
        }
      });
    },
    // 获取所在分组名称
    geFzmc() {
      let the = this;
      the.fzmc = {};
      bkxxApi.geFzmc(this.tempId).then(res => {
        if (res.data && res.data.length) {
          let fzList = res.data;
          if (fzList.length > 0) {
            the.fzmc = fzList[0];
          }
        }
      });
    },
    getqjdxryxx(sfzh) {
      let that = this;
      bkxxApi.getqjdxryxx(sfzh).then(res => {
        if (res && res.data) {
          this.$set(that.baseInfo, 'xm', res.data.xm);
          this.$set(that.baseInfo, 'ryxx', res.data);
          console.log(that.baseInfo);
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
      height: calc(100% - 19rem);
      // position: absolute;
      width: 100%;
    }
  }
}

.editGropIcon {
  /*font-size: 14px;*/
}

.iconl-edit {
  &:hover {
    color: var(--button-color-primary);
  }
}

.tip__attract {
  color: var(--color-danger);
}

.tip__warning {
  color: var(--color-warning);
}
.icon-bkzt {
  color: var(--color-text-primary);
  &[data-type='20'] {
    color: var(--color-warning);
  }
  &[data-type='10'] {
    color: var(--color-danger);
  }
  &[data-type='21'] {
    color: var(--card-info_card-del-cell_border_color);
  }
  &[data-type='01'] {
    color: var(--color-success);
  }
  &[data-type='02'] {
    color: var(--color-text-regular);
  }
}
</style>
