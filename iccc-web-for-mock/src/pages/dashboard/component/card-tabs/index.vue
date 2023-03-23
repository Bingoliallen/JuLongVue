<template>
  <dg-card class="cardBox">
    <el-button-group class="rightBtn">
      <dg-button
        v-for="(item, index) in btnOptions"
        :key="index"
        :type="selected === index ? 'primary' : ''"
        @click="handleSelect(index)"
        >{{ item.label }}</dg-button
      >
    </el-button-group>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabsList" :key="item.label"></el-tab-pane>
      <SingleTab />
    </el-tabs>
  </dg-card>
</template>

<style lang="scss" scoped>
.cardBox {
  position: relative;
  & .rightBtn {
    position: absolute;
    right: 16px;
    top: 15px;
    z-index: 10;
  }
}
</style>

<script>
import SingleTab from './single-tab';
export default {
  name: 'CardTabs',
  components: {
    SingleTab
  },
  data() {
    return {
      activeName: 'first',
      tabsList: [
        {
          label: '数据质量',
          name: 'first'
        },
        {
          label: '数据资源服务',
          name: 'second'
        },
        {
          label: '数据治理',
          name: 'third'
        }
      ],
      selected: 0,
      btnOptions: [
        {
          label: '近3天'
        },
        {
          label: '近7天'
        },
        {
          label: '近一个月'
        }
      ]
    };
  },
  methods: {
    handleClick(tab) {
      console.log(tab);
    },
    handleSelect(index) {
      this.selected = index;
    }
  }
};
</script>
