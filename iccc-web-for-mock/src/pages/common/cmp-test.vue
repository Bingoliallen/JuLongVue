<!--
 * @Descripttion: 用于开发阶段测试组件等功能
 * @Author: Panll
 * @Date: 2020-12-15 17:25:35
 * @Project: ${PROJECT_NAME}
 -->
<template>
  <div class="cmp-test">
    <el-form :model="form" label-suffix="：">
      <el-form-item label="布控周期"
        ><qs-cycle-pick
          module="QZ_ZDR"
          :type="activeType"
          v-model="form.cycle"
        ></qs-cycle-pick>
        {{ activeValue }}
        <el-button type="primary" @click="addActiveValue">+</el-button>
        <el-button type="primary" @click="addActiveType">type</el-button>
      </el-form-item>
      <el-form-item label="布控范围"
        ><nationwide-selection module="QZ_ZDR" v-model="form.wide"></nationwide-selection
      ></el-form-item>
    </el-form>
  </div>
</template>

<script>
import QsCyclePick from '@icccPath/components/qs-cycle-pick';
import NationwideSelection from '@icccPath/components/nationwide-selection';
export default {
  name: 'cmp-test',
  components: {
    QsCyclePick,
    NationwideSelection
  },
  data() {
    return {
      form: {
        dwjgdm: '',
        cycle: '',
        // 350100,350200,350300,350400,350500,350600,350700,350800,350900,010000,110000,120000,130000,140000,150000,210000,220000,230000,310000,320000,330000,340000,350000,360000,370000,410000,420000,430000,440000,450000,460000,500000,510000,520000,530000,540000,610000,620000,630000,640000,650000,660000,710000,810000
        wide: ''
      },
      activeValue: 15,
      activeType: 'date',
      // 默认选中的范围
      defaultdwjgdmCategoryCheck: []
    };
  },
  methods: {
    addActiveValue() {
      this.activeValue += 15;
    },
    addActiveType() {
      if (this.activeType === 'date') {
        this.activeType = 'datetime';
      } else {
        this.activeType = 'date';
      }
    }
  },
  created() {
    setTimeout(() => {
      this.form.cycle = '20201228,20210328';
    }, 3000);
  },
};
</script>

<style lang="scss" scoped>
.cmp-test {
  padding: 1.5rem 2rem;
  background-color: #fff;
}
</style>
