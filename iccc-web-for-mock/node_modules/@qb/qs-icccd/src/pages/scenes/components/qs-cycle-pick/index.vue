<!--
 * @Descripttion: 周期选择组件
 * @Author: Panll
 * @Date: 2020-12-16 15:42:26
 * @Project: ${PROJECT_NAME}
 -->
<template>
  <div class="qs-cycle-pick">
    <dg-radio-group
      ref="radioGroup"
      v-if="isShowQuick && !isData"
      :code="code"
      class="u-lable-btn is-no-border"
      v-model="radioValue"
      is-lace
      type="button"
      :call-off="callOff"
      @change="radioChange"
    ></dg-radio-group>
    <dg-radio-group
      ref="radioGroup"
      v-if="isShowQuick && isData"
      :data="data"
      class="u-lable-btn is-no-border"
      v-model="radioValue"
      is-lace
      type="button"
      :call-off="callOff"
      @change="radioChange"
    ></dg-radio-group>
    <el-date-picker
      v-if="isDatePicker"
      :class="{ 'is-active': pickerActive }"
      v-model="date"
      :type="type"
      placeholder="截至日期"
      :default-time="defaultTime"
      :picker-options="{ disabledDate }"
      @change="dateChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'qs-cycle-pick',
  props: {
    value: {
      type: String,
      default() {
        return '';
      }
    },
    type: {
      type: String,
      default: 'date'
    },
    module: {
      type: String,
      default: 'QZ_NZDR'
    },
    code: {
      type: String,
      default: 'BM_BKSQ_BKQX'
    },
    // 默认值
    activeValue: [String, Number],
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否显示快捷选项
    isShowQuick: {
      type: Boolean,
      default: true
    },
    // 是否显示时间筛选器
    isDatePicker: {
      type: Boolean,
      default: true
    },
    // 是否关闭再次点击取消选中
    callOff: {
      type: Boolean,
      default: true
    },
    // 自定义添加数据，dg-radio-group
    // customData: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    // 默认起始时间
    defaultTime: {
      type: String,
      default: '00:00:00'
    }
  },
  data() {
    return {
      // 截至日期
      date: '',
      radioValue: '',
      // 自定义选中
      pickerActive: false,
      disabledDate: time => {
        return (
          time.getTime() <
          this.$moment()
            .endOf('day')
            .valueOf()
        );
      }
    };
  },
  computed: {
    format() {
      return this.type === 'datetime' ? 'YYYYMMDDHHmmss' : 'YYYYMMDD';
    },
    isData() {
      if (this.data && this.data.length > 0) {
        return true;
      }
      return false;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.init(val);
      },
      immediate: true
    },
    type: {
      handler() {
        if (!this.value) {
          this.init(this.activeValue);
        }
      }
    },
    activeValue: {
      handler(val) {
        if (!this.value) {
          this.init(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    init(val) {
      if (!val) return;
      if (this.value) {
        this.$nextTick(() => {
          const dates = val.split(',');
          if (dates.length > 1) {
            this.date = this.$moment(dates[dates.length - 1]).toDate();
          } else {
            this.date = this.$moment(dates[0]).toDate();
          }
        });
      } else {
        if (this.type == 'datetime') {
          this.$nextTick(() => {
            const data = this.$refs.radioGroup.dataSource;
            const item = data.find(v => v.value === this.activeValue + '');
            this.radioChange(item && item.value);
          });
          return;
        }
        this.radioValue = val;
        this.radioChange(val);
      }
    },
    radioChange(value) {
      let val = '';
      if (Number(value)) {
        // 获取到指定天数的截至日期
        this.date = this.$moment(this.$moment())
          .add(parseInt(value), 'd')
          .toDate();
        // 拼接当前日期和截至日期
        val = `${this.$moment(this.$moment()).format(this.format)},${this.$moment(this.$moment())
          .add(parseInt(value), 'd')
          .format(this.format)}`;
        this.radioValue = value;
      } else {
        this.date = '';
      }
      this.$emit('input', val);
      this.$emit('change', val);
    },
    dateChange(time) {
      this.radioValue = '';
      this.pickerActive = true;
      let val = '';
      console.log(time);
      if (time) {
        val = `${this.$moment(this.$moment()).format(this.format)},${this.$moment(time).format(this.format)}`;
      }
      this.$emit('input', val);
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="scss" scoped></style>
