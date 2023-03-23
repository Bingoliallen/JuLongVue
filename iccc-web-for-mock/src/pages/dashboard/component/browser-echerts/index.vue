<template>
  <div style="width: 100%;height: 320px" ref="echarts"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'index',
  mounted() {
    this.$nextTick(() => {
      let myChart = echarts.init(this.$refs.echarts);
      let option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,250,0.2)'
        },
        visualMap: {
          itemWidth: 15, // 图形的宽度，即长条的宽度。
          itemHeight: 80,
          bottom: 30,
          right: 0,
          color: ['#80e1d9', '#6485f2', '#7ac4fb'],
          calculable: true
        },
        radar: {
          indicator: [
            { text: '资源一', max: 400 },
            { text: '资源二', max: 400 },
            { text: '资源三', max: 400 },
            { text: '资源四', max: 400 },
            { text: '资源五', max: 400 }
          ]
        },
        series: (function() {
          let series = [];
          for (let i = 1; i <= 28; i++) {
            series.push({
              name: '浏览器（数据纯属虚构）',
              type: 'radar',
              symbol: 'none',
              lineStyle: {
                width: 1
              },
              emphasis: {
                areaStyle: {
                  color: 'rgba(0,250,0,0.3)'
                }
              },
              data: [
                {
                  value: [(40 - i) * 10, (38 - i) * 4 + 60, i * 5 + 10, i * 9, (i * i) / 2],
                  name: i + 2000 + ''
                }
              ]
            });
          }
          return series;
        })()
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    });
  }
};
</script>

<style scoped></style>
