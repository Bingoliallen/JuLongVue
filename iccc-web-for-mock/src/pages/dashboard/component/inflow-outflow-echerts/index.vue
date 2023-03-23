<!--
    Exception 流入流出图
    @Author: zouwf
    @Date: 2019-12-12
-->
<template>
  <div class="v-inflow-outflow-echerts">
    <span>区域流入流出数据</span>
    <div style="width: 100%;height: 280px;" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'index',
  props: ['data'],
  methods: {
    init() {
      this.$nextTick(() => {
        /**
         * 生成 lower-upper 的随机整数构成的长度为 len 的数组
         * */
        function getRandomRangeData(lower, upper, len) {
          if (!len) {
            return;
          }
          let arr = [];
          for (let i = 0; i < len; i++) {
            arr.push(randomNumber(lower, upper));
          }
          return arr;
        }
        /**
         * 生成 lower-upper之间 的随机整数
         * */
        function randomNumber(lower, upper) {
          return Math.floor(Math.random() * (upper - lower + 1)) + lower;
        }
        let myChart = echarts.init(this.$refs.echarts);
        // 指定图表的配置项和数据
        // getRandomRangeData(n, m, l),生成 n-m 的随机整数构成的长度为 l 的数组
        let barData = {
          yellowData: getRandomRangeData(2000, 3500, 8),
          redData: getRandomRangeData(2000, 3500, 8),
          blueData: getRandomRangeData(2000, 3500, 8),
          label: ['福建省', '江西省', '云南省', '新疆省', '西藏省', '内蒙古']
        };
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            borderWidth: 0,
            top: 40,
            x: 0,
            y: 0,
            x2: 20,
            y2: 0,
            containLabel: true
          },
          legend: {
            show: true,
            icon: 'rect',
            itemGap: 10,
            itemWidth: 10,
            itemHeight: 10,
            data: ['流入', '流出', '滞留'],
            right: '1%',
            top: '-1%',
            textStyle: {
              color: '#c8c8c8',
              fontFamily: '微软雅黑',
              fontSize: 14
            }
          },
          color: ['#1890ff', '#5db1ff', '#5ad4d4'],
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: barData.label,
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#e8e8e8',
                  type: 'dashed',
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#c8c8c8',
                  fontSize: 12
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '',
              nameTextStyle: {
                // color: '#666'
              },
              splitLine: {
                lineStyle: {
                  color: '#e8e8e8',
                  width: 1,
                  type: 'dashed'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#e8e8e8',
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#c8c8c8'
                }
              }
            }
          ],
          series: [
            {
              name: '流入',
              type: 'bar',
              barGap: 0.5,
              barWidth: 10,
              barCateGoryGap: 20,
              data: barData.redData
            },
            {
              name: '流出',
              type: 'bar',
              barGap: 0.5,
              barWidth: 10,
              barCateGoryGap: 20,
              data: barData.yellowData
            },
            {
              name: '滞留',
              type: 'bar',
              barGap: 0.5,
              barWidth: 10,
              barCateGoryGap: 20,
              data: barData.blueData
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      });
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    data(a) {
      this.init();
    }
  }
};
</script>
