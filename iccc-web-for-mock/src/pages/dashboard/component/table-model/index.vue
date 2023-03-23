<template>
  <el-row class="v-tm">
    <!--左边标签切换表格-->
    <el-col :span="18">
      <!--表格-->
      <layout-Template class="v-tm__left" :isTabs="true" @tabsToggle="handleToggle">
        <template>
          <dg-table
            class="v-tm__left-table"
            :pagination-props="paginationProps"
            :data="data"
            paging-type="client"
            draggable
            :border="false"
            :auto-page="h => h * 0.6"
            row-key="id"
            stripe
          >
            <dg-table-column type="index" width="50" label="#"></dg-table-column>
            <dg-table-column prop="name" width="100" label="名称"></dg-table-column>
            <dg-table-column prop="address" label="地址1"></dg-table-column>
            <dg-table-column width="250" prop="startTime" label="开始时间"></dg-table-column>
            <dg-table-column width="250" prop="endTime" label="截止时间"></dg-table-column>
          </dg-table>
        </template>
      </layout-Template>
    </el-col>
    <!--右边公告栏表格-->
    <el-col :span="6" style="padding-left:15px">
      <layout-Template class="v-tm__right" :titleData="headerData" :isTitle="true">
        <template>
          <div class="v-tm__right-table">
            <dg-table :data="tableData" :pagination="false" stripe align="center">
              <dg-table-column width="95" prop="date" label="按钮">
                <template slot-scope="scope">
                  <dg-button size="mini" :type="scope.row.status === '升级' ? 'warning' : 'primary'">{{
                    scope.row.status
                  }}</dg-button>
                </template>
              </dg-table-column>
              <dg-table-column prop="address" label="姓名"> </dg-table-column>
              <dg-table-column width="70" prop="address" label="操作">
                <template>
                  <dg-button size="text" type="warning">详情</dg-button>
                </template>
              </dg-table-column>
            </dg-table>
          </div>
        </template>
      </layout-Template>
    </el-col>
  </el-row>
</template>

<script>
import layoutTemplate from '@icccPath/components/layout-template/index';
export default {
  name: 'index',
  components: {
    layoutTemplate
  },
  data() {
    let dataSource = [];
    for (let i = 0; i < 5; i++) {
      let obj = {
        id: i,
        rate: i % 4,
        name: '风小谷1',
        address: '福建省厦门集美区软件园三期XX科技信息有限公司',
        status: (i % 3) + '',
        startTime: '2019-12-25 17:12:35',
        endTime: '2019-12-26 14:22:11'
      };
      dataSource.push(obj);
    }
    return {
      headerData: {
        left: '公告栏',
        right: '更多'
      },
      activeName: 'first',
      // 左边数据
      data: dataSource,
      // 分页配置
      paginationProps: {
        currentPage: 1,
        pageSizes: [5, 10, 20],
        pageSize: 5
      },
      // 右侧数据
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '升级'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '升级'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '产品'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '升级'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '产品'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: 'COM/.NET注册局系统维护通知',
          status: '升级'
        }
      ]
    };
  },
  methods: {
    /**
     *
     * 数据模拟
     *
     * */
    handleToggle(val) {
      let dataSource = [];
      let dataSource_ = [];
      let dataSource__ = [];
      for (let i = 0; i < 5; i++) {
        let obj = {
          id: i,
          rate: i % 4,
          name: '风小谷1',
          address: '福建省厦门湖里区湖里街道巨龙大厦',
          status: (i % 3) + '',
          startTime: '2019-12-25 15:13:35',
          endTime: '2020-12-26 11:11:11'
        };
        let obj_ = {
          id: i,
          rate: i % 4,
          name: '风小谷2',
          address: '福建省厦门集美区软件园三期科技信息有限公司',
          status: (i % 3) + '',
          startTime: '2019-12-24 12:13:35',
          endTime: '2023-11-26 14:15:11'
        };

        let obj__ = {
          id: i,
          rate: i % 4,
          name: '风小谷3',
          address: '福建省厦门集美区软件园三期巨龙科技信息有限公司',
          status: (i % 3) + '',
          startTime: '2019-11-24 02:13:35',
          endTime: '2023-11-26 14:25:11'
        };

        dataSource.push(obj);
        dataSource_.push(obj_);
        dataSource__.push(obj__);
      }
      if (val === 'first') {
        this.data = dataSource;
      } else if (val === 'second') {
        this.data = dataSource_;
      } else {
        this.data = dataSource__;
      }
    }
  }
};
</script>

<style lang="scss">
.v-tm__right {
  thead {
    display: none;
  }
  .el-button--mini {
    min-width: 60px;
    /*width: 42px;*/
    height: 20px;
    line-height: 9px;
  }
}
</style>
