<template>
  <el-row :gutter="60">
    <el-col :span="14">
      <ve-histogram
        :columns="chartData.columns"
        :rows="chartData.rows"
        :colors="chartData.colors"
        :settings="chartData.settings"
        legend-position="bottom"
        :extend="chartData.extend"
      ></ve-histogram>
    </el-col>
    <el-col :span="10">
      <div class="word-title">服务数据概览</div>
      <el-row>
        <el-col :span="12" v-for="item in iconWordList" :key="item.title" style="margin-bottom:40px">
          <CardIconWord :item="item" />
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import CardIconWord from './card-icon-wrod';
export default {
  name: 'SingleTab',
  components: {
    CardIconWord
  },
  data() {
    return {
      iconWordList: [
        {
          icon: 'v-icon-source',
          title: '检测资源（类）',
          subTitle: '408',
          iconBackground: '#e7f4ff'
        },
        {
          icon: 'v-icon-data',
          title: '检测数据（万条）',
          subTitle: '94,000,000',
          iconBackground: '#eaf8fc'
        },
        {
          icon: 'v-icon-warning-data',
          title: '问题数据（万条）',
          subTitle: '33,335,000',
          iconBackground: '#e7f9f9'
        },
        {
          icon: 'v-icon-problem-per',
          title: '问题率',
          subTitle: '6.7%',
          iconBackground: '#fffbe9'
        },
        {
          icon: 'v-icon-deal',
          title: '处理数据（万条）',
          subTitle: '2,569,000',
          iconBackground: '#fef7e7'
        },
        {
          icon: 'v-icon-deal-per',
          title: '处理率',
          subTitle: ' 8.7%',
          iconBackground: '#fee8ea'
        }
      ],
      chartData: {
        colors: ['#1890ff', '#fecd25'],
        columns: ['xLabel', '数据总量', '数据问题率'],
        rows: [
          { xLabel: '值域有效性', 数据总量: 1393, 数据问题率: 1132 },
          { xLabel: '数据值逻辑', 数据总量: 3530, 数据问题率: 1126 },
          { xLabel: '归一化原则', 数据总量: 2923, 数据问题率: 176 },
          { xLabel: '必输项为空', 数据总量: 1723, 数据问题率: 1149 },
          { xLabel: '必输项为空', 数据总量: 3792, 数据问题率: 2323 },
          { xLabel: '必输项为空', 数据总量: 4593, 数据问题率: 1178 }
        ],
        settings: {},
        extend: {
          title: {
            text: '问题数据类型及正常率',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16
            }
          },
          legend: {
            itemWidth: 15,
            itemHeight: 15
          },
          series: {
            barGap: 0,
            barWidth: 20
          }
        }
      }
    };
  }
};
</script>
