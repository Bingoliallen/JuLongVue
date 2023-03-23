<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div class="qs-slider-container">
    <el-slider
      class="qs-slider-main"
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      @change="sliderChange"
    ></el-slider>
    <el-input-number
      controls-position="right"
      v-model="inputValue"
      class="el-slider__input"
      ref="input"
      @change="inputChange"
      :step="step"
      :controls="showInputControls"
      :min="min"
      :max="max"
      :debounce="debounce"
      :size="inputSize"
    >
    </el-input-number>
  </div>
</template>
<script>
const xsdLimitMin = +window.systemParams.XSD_LIMIT_MIN || 0;
export default {
  name: 'qs-slider',
  //接收父页面传过来的属性
  props: {
    min: {
      type: Number,
      default: xsdLimitMin
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 5
    },
    value: {
      type: [Number, Array],
      default: 0
    },
    showInput: {
      type: Boolean,
      default: false
    },
    showInputControls: {
      type: Boolean,
      default: true
    },
    inputSize: {
      type: String,
      default: 'small'
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    formatTooltip: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String
    },
    tooltipClass: String,
    marks: Object
  },
  //页面数据绑定
  data() {
    return {
      sliderValue: null,
      inputValue: null
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val < xsdLimitMin) {
          this.$emit('input', xsdLimitMin);
        }
        if (val > 100) {
          this.$emit('input', 100);
        }
      },
      immediate: true
    }
  },
  //方法
  methods: {
    sliderChange(val) {
      this.inputValue = val;
      this.valueChange(val);
    },
    inputChange(val) {
      this.sliderValue = val;
      this.valueChange(val);
    },
    valueChange(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  //组件创建时调用
  created() {
    this.inputValue = this.sliderValue = this.value;
  }
};
</script>
<style lang="scss" scoped>
.qs-slider-container {
  display: flex;
  align-items: center;
  /deep/.el-slider__input .el-input:before {
    content: '%';
    position: absolute;
    right: 1.8rem;
    z-index: 10;
    margin-top: 1px;
  }
  /deep/[role='button'] {
    border: none;
  }
  /deep/.el-tooltip {
    background: url('../../../assets/images/common/slider-icon.png') center no-repeat;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
  }
  /deep/.el-tooltip:hover {
    background: url('../../../assets/images/common/slider-hover-icon.png') center no-repeat;
  }
  .qs-slider-main {
    width: 7.5rem;
  }
  .el-slider__input {
    width: 6rem;
    min-width: unset;
    margin-left: 1.01rem;
  }
  /deep/.el-slider__runway {
    width: 100%;
    height: 6px;
    margin: 16px 0;
    background-color: var(--color-primary);
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
