<template>
  <dg-date-picker
    class="qs-date-pick"
    v-bind="$props"
    :type="type"
    :short-btns="shortBtnList"
    v-model="pickerModel"
    @change="change"
  ></dg-date-picker>
</template>

<script>
export default {
  // 名称
  name: 'qs-date-pick',
  props: {
    value: {
      type: String,
      default() {
        return '';
      }
    },
    type: String,
    'range-separator': String,
    'start-placeholder': String,
    'end-placeholder': String,
    format: String,
    'value-format': String
  },
  data() {
    const shortBtnList = [
      {
        text: '不限',
        onClick(picker) {
          picker.$emit('pick', []);
        }
      },
      {
        text: '近一天',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '近三天',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: '近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
      }
    ];
    return { pickerModel: '', shortBtnList };
  },
  methods: {
    change() {
      const val = this.pickerModel;
      this.$emit('input', val ? val.join(',') : '');
    }
  }
};
</script>

<style lang="scss">
.qs-date-pick {
}
</style>
