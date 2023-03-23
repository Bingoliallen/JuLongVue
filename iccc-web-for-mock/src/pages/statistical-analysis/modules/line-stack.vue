<!--
 此处填写文件描述:趋势分析
 @Author: libb
 @Date: 2021/03/09 09:59
-->
<template>
  <div class="line-two" style="height: 100%; position: relative">
    <div ref="line" v-if="echartShow" style="height: 100%; width: 100%"></div>
  </div>
</template>
<script>
export default {
  name: 'line-stack',
  props: {
    type: String
  },
  data() {
    return {
      echartShow: true,
      currentState: false,
      lineData: {},
      mapData: {},
      mapIndex: 0,
      oneTime: true,
      nowTime: null
    };
  },
  watch: {
    type: {
      handler() {
        this.queryData(true);
      },
      immediate: true
    }
  },
  created() {
    this.queryData();
  },
  methods: {
    async queryData(flag) {
      if (flag) {
        this.echartShow = false;
      }
      // const data = await LHLK_LKRYJJJHJQSQS('{}');
      this.echartShow = true;
        let xAxisData = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日'];
        let jj = [150, 230, 224, 218, 135, 147, 260,120, 132, 101, 134, 90, 230, 210, 330];
        const nowData = this.dateFormat(new Date());
       
        this.lineData = {
          xAxisData: xAxisData,
          jj: jj
        };
        this.lineData.xAxisData.map((p, index) => {
          if (p == nowData) {
            this.mapIndex = index;
            this.nowTime = p;
          }
        });
        this.$nextTick(() => {
          this.init();
        });
    },
    init() {
      const the = this;
      const line = this.$echarts.init(this.$refs.line);
      line.setOption(this.returnLineOption(this.lineData));
      line.off('showTip'); // 这里是为了防止多次注册事件
      line.on('showTip', function (param) {
        let nowDataIndex = param.dataIndex;
        the.mapIndex = nowDataIndex;
      });
      line.off('finished');
      line.on('finished', function () {
        setTimeout(function () {
          line.dispatchAction({
            type: 'showTip',
            seriesIndex: 0, // 显示第几个series
            dataIndex: the.mapIndex // 显示第几个数据
          });
        }, 200);
      });
      line.off('click');
     
      window.removeEventListener('resize', this.resize(line));
      window.addEventListener('resize', this.resize(line));
    },
    resize(line) {
      if (line) {
        line.resize();
      }
    },
    dateFormat(Date) {
      let M = Date.getMonth() + 1;
      M = M < 10 ? '0' + M : M; // 不够两位补充0
      let D = Date.getDate();
      D = D < 10 ? '0' + D : D;
      return M + '/' + D;
    },
    returnLineOption(data) {
      let legendData = ['预警趋势'];
      let series = [
        {
          name: '预警趋势',
          type: 'line',
          showAllSymbol: false,
          lineStyle: {
            normal: {
              color: '#1890FF',
              width: 1
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 4,
              color: '#1890FF'
            }
          },
          data: data.jj
        }
      ];
      return {
        color: ['#5470c6'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              type:'dashed',
              color: '#1890FF'
            }
          },
          // backgroundColor: 'rgba(0, 74, 132, 0.5)',
          formatter(params) {
            let $html = [];
            let axisValue = '';
            params.map((p) => {
              axisValue = p.axisValue;
              $html.push(
                `<p>${p.seriesName}：<span class="tooltip-yellow">${p.value}</span> </p>`
              );
            });
            return `<div class="tooltip-resources" style="padding: 10px 15px;">
                                    <p>${axisValue}</p>${$html.join('')}
                             </div>`;
          }
        },
        legend: {
          show: true,
          data: legendData,
          top: 'bottom',
          itemHeight: 1,
          itemWidth: 12,
          textStyle: {
            color: 'rgba(0,0,0,0.85)',
            fontSize: 14,
            fontFamily: '微软雅黑'
          }
        },
        grid: {
          x: 10,
          y: 50,
          x2: 20,
          y2: 50,
          // borderColor:'rgba(0,0,0,0.85)',
          borderWidth: 0,
          containLabel: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(0,0,0,0.65)',
                fontSize: 14
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              length: 5,
              lineStyle: {
                color: 'rgba(76, 160, 211, .1)'
              }
            },
            data: data.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: 'rgba(0,0,0,0.19)'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              color: 'rgba(0,0,0,0.65)',
              fontSize: 14,
              letterSpacing: 20
            }
          }
        ],
        series: series
      };
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
