<!--
 * @Author: Liugh
 * @Date: 2020-06-17 13:42:05
 * @LastEditTime: 2020-11-11 15:32:24
 * @LastEditors: Please set LastEditors
 * @Description:
-->
<template>
  <div :class="['card-list', type]">
    <carousel
      v-if="type !== 'add'"
      :isChange="false"
      :idCard="info.cardid"
      :messageNum="info.messagenum"
      :isCardId="true"
      :isChangeNum="false"
      isEnlarge="none"
      :imgStyleObject="{ width: '78px', height: '78px', margin: '0' }"
    ></carousel>
    <ul class="card-info" v-if="type !== 'add'">
      <li>
        {{ info.sfzh }}
        <dg-tag class="tag">{{ info.relation }}</dg-tag>
      </li>
      <li>
        {{ info.name }}
      </li>
      <li class="attr-info">
        <span>{{ info.sex }}</span>
        <span>{{ info.age }}</span>
        <span>{{ info.nation }}</span>
      </li>
    </ul>
    <ul class="card-info" v-if="type === 'add'">
      <el-form class="" size="small" label-suffix="：" :model="featForm" :rules="rules" ref="aproveForm">
        <dg-row>
          <dg-col :span="12">
            <el-form-item label-width="60px" label="姓名">
              <el-input v-model="featForm.name"></el-input>
            </el-form-item>
          </dg-col>
          <dg-col :span="12">
            <el-form-item label-width="60px" label="关系">
              <el-input v-model="featForm.relation"></el-input>
            </el-form-item>
          </dg-col>
          <dg-col :span="24">
            <el-form-item label="身份证号" label-width="90px">
              <el-input v-model="featForm.sfzh"></el-input>
            </el-form-item>
          </dg-col>
        </dg-row>
      </el-form>
    </ul>

    <div class="card-del-cell" v-if="type === 'delete'">删除</div>
  </div>
</template>

<script>
import Carousel from '../carousel';
export default {
  name: 'card-info', // 组件名称
  props: {
    // 接收父组件的数据
    info: {
      type: Object,
      default() {
        return {};
      },
      required: true
    },
    // 页面类型 delete，detail，add
    type: String
  },
  data() {
    // 组件内部参数
    return {
      featForm: this.info,
      rules: {},
      fileList: []
    };
  },
  components: {
    Carousel
  } // 注册局部组件
};
</script>

<style lang="scss" scoped>
$detail-color: var(--color-primary);
$delete-color: var(--color-danger);
$height: 100px;
.card-list {
  display: flex;
  border: 1px solid var(--border-color-extra-light);
  &.detail:hover {
    border: 1px solid $detail-color;
    box-shadow: 0 3px 10px 0 rgba($detail-color, 0.3);
  }
  &.delete:hover {
    border: 1px solid $delete-color;
    box-shadow: 0 3px 10px 0 rgba($delete-color, 0.3);
  }
  .head-portrait {
    height: $height;
    width: $height * 0.8;
  }
  .card-info {
    margin-left: 8px;
    flex: 1;
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1;
    > li {
      padding: 4px 0;
    }
    .tag {
      margin-left: 8px;
    }
    .attr-info {
      color: var(--color-text-secondary);
      > span + span {
        margin-left: 1em;
      }
    }
  }
  .card-del-cell {
    cursor: pointer;
    width: 40px;
    background: var(--card-info_card-del-cell_background);
    border: 1px solid var(--card-info_card-del-cell_border_color);
    color: $delete-color;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      border-color: $delete-color;
    }
  }
}
.carousel {
  margin: 0;
}
</style>
