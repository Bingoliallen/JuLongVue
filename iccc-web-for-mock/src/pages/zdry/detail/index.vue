<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <dg-scrollbar ref="scrollbar">
    <div class="monitor-list-detail">
      <base-info
        :info="dataSouce"
        module="NOAH_ARK"
        :idCard="dataSouce.sfzh"
        concernType="ZDR"
        concernId="bjzdrybh"
        idKey="bjzdrybh"
        @updateSearch="$emit('updateSearch', $event)"
        @page-change="$emit('page-change', $event)"
      >
        <template v-slot:title="{ form }">
          <span class="main-label__slot">
            <span style="margin-right: 1rem">{{ form.sfzh | filterText }}</span>
            <span style="margin-right: 1rem">
              {{ form.xm | filterText }}
              （<em v-code="{ code: 'BM_XB0000', value: form.xb }"></em>）
            </span>
          </span>
        </template>
        <template v-slot:content="{ form }">
          <el-form inline class="zdr-form" label-width="8em">
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="对象类别：">
                  <em :data="form.rylb" v-code="{ code: 'BM_RY_RYXL', value: form.zdryxl }"></em>
                </el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="民族：">
                  <em v-code="{ code: 'BM_MZ0000', value: form.mz }"></em>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="出生日期：">
                  {{ form.csrq ? $dayjs(form.csrq).format('YYYY-MM-DD') : '-' }}
                </el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="状态：">
                  <em v-code="{ code: 'BM_ZDRYXX', value: form.yxx }"></em>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="户籍地址：">{{ form.hjdxz | filterText }}</el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="户籍地派出所：">
                  <span>{{ form.hjdpcs | filterText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="12">
                <el-form-item label="居住地址：">{{ form.xzdxz | filterText }}</el-form-item>
              </el-col>
              <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
                <el-form-item label="居住地派出所：">
                  <span>{{ form.xzdpcs | filterText }}</span>
                </el-form-item>
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
              concernId="id"
              concernType="GJ"
              url="/v1/gjxx/search"
              :bzhm="bzhm"
              v-if="tabItemShow === 'yjgj'"
              :sortProps="{ HDFSSJ: 'DESC' }"
            ></warning-trajectory>
            <apply-info v-if="tabItemShow === 'apply-info'" :info="dataSouce"></apply-info>
            <!--            <target-informaction v-if="tabItemShow === 'dxxx'"></target-informaction>-->
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
import ApplyInfo from './apply-info';
import nzdrApi from '@icccPath/api/nzdr/index';
export default {
  name: 'zdry-detail',
  props: {
    id: String
  },
  data() {
    return {
      tempId: '',
      tabItemShow: 'yjgj',
      tabList: [
        { label: '预警轨迹', value: 'yjgj' },
        { label: '申请信息', value: 'apply-info' }
      ],
      dataSouce: {},
      bzhm: ''
    };
  },
  components: {
    WarningTrajectory,
    TabList,
    BaseInfo,
    ApplyInfo
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
    /**
     * 获取重点人对象详情
     */
    init() {
      if (this.tempId === this.id) {
        return;
      }
      this.tempId = this.id;
      this.getDetail();
    },
    getDetail() {
      this.dataSouce = {};
      this.bzhm = '';
      nzdrApi.loadZdrDetail(this.tempId).then(({ data }) => {
        this.dataSouce = data;
        this.bzhm = `111@${data.sfzh}`;
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
  /deep/ .tip__attract {
    color: var(--color-danger);
  }
  /deep/ .tip__warning {
    color: var(--color-warning);
  }
  .zdr-form /deep/ .el-form-item__content {
    display: inline-block;
    max-width: calc(100% - 8rem);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
</style>
