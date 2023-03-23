<!---->
<template>
  <div style="width: 100%;min-height: 320px;" ref="echarts"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'index',
  props: ['status'],
  data() {
    return {
      xsData: [500, 900, 220, 130, 660, 289],
      xzData: [123, 568, 111, 222, 123, 56]
    };
  },
  methods: {
    /**
     *
     * 初始化
     *
     * */
    init() {
      this.$nextTick(() => {
        let myChart = echarts.init(this.$refs.echarts);
        // 指定图表的配置项和数据
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          title: {
            left: 'left',
            text: '单位：万元',
            textStyle: {
              fontSize: '12',
              color: '#8c8c8c'
            }
          },
          legend: {
            icon: 'circle',
            data: ['形式案件', '行政案件'],
            top: 0,
            right: 0,
            itemGap: 10,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: '#c8c8c8',
              fontFamily: '微软雅黑',
              fontSize: 14
            }
          },
          grid: {
            top: 40,
            left: 0,
            right: 20,
            bottom: 0,
            height: '80%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLine: {
              lineStyle: {
                color: '#e8e8e8'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#BFBFBF'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#BFBFBF'
              }
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#BFBFBF'
              }
            }
          },
          series: [
            {
              name: '形式案件',
              type: 'line',
              data: this.xsData,
              color: '#1890ff',
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(199, 237, 250,0.5)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(199, 237, 250,0.2)'
                      }
                    ],
                    false
                  )
                }
              },
              lineStyle: {
                width: 2,
                color: '#6D87F1',
                shadowColor: 'rgba(245,128,128, 0.5)',
                shadowBlur: 10,
                shadowOffsetY: 7
              },
              itemStyle: {
                color: '#6D87F1'
              },
              smooth: true
            },
            {
              name: '行政案件',
              type: 'line',
              data: this.xzData,
              lineStyle: {
                normal: {
                  width: 2,
                  color: '#5ad4d4',
                  shadowColor: 'rgba(71,216,190, 0.5)',
                  shadowBlur: 10,
                  shadowOffsetY: 7
                }
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(199, 237, 250,0.5)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(199, 237, 250,0.2)'
                    }
                  ],
                  false
                )
              },
              itemStyle: {
                color: '#5ad4d4',
                borderWidth: 1,
                borderColor: '#5ad4d4'
              },
              smooth: true
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      });
    },
    /**
     *
     * 生成随机数
     *
     * */
    randomData() {
      let num = Math.random() * 1000;
      return num;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    status() {
      this.xsData = [];
      this.xzData = [];
      for (let i = 0; i < 6; i++) {
        this.xsData.push(this.randomData());
        this.xzData.push(this.randomData());
      }
      this.init();
    }
  }
};
</script>

<style scoped></style>
