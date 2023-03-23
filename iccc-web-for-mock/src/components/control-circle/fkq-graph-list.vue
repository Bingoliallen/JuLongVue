<!-- Created by hcg on 2020/11/17. -->
<template>
  <div class="fkq-graph-list" :class="{ line: type === 'line' }">
    <template v-if="fkqList.length">
      <div v-if="type === 'edit'" class="btn-clear">
        <dg-button type="text" @click="$emit('delete')">清空</dg-button>
      </div>
      <div
        v-for="(item, index) in fkqList"
        :key="index"
        :class="{
          'fkq-graph-list-item': true,
          edit: type === 'edit'
        }"
        :style="item | filterBackgroundImage"
        @click="graphClick(item, startIndex - 1 + index)"
      >
        <i v-if="type === 'edit'" class="iconfont iconf-circle-close" @click.stop="$emit('delete', item)"></i>
        <el-tooltip placement="top">
          <template slot="content">
            <div class="graph-type" v-if="item.type === 'AREA'">
              <!--行政区划：--><span v-code="{ code: 'BM_QZFKQ_XZQH', value: item.areaCode }"></span>
            </div>
            <div class="graph-type" v-else>
              <!--自定义：--><span>{{ item.type === 'POLYGON' ? '多边形' : '圆' }}</span>
            </div>
          </template>
          <div class="location">{{ startIndex + index }}</div>
        </el-tooltip>
      </div>
      <el-popover v-if="fkqLength > 4" placement="right" popperClass="fkq-graph-popper" trigger="click">
        <fkq-graph-list :values="values.slice(3)" :start-index="4" @view-fkq="graphClick"></fkq-graph-list>
        <div class="fkq-graph-list-item-line" slot="reference">+{{ fkqLength - 3 }}</div>
      </el-popover>
    </template>
    <template v-else>暂无</template>
  </div>
</template>

<script>
import { getImg } from './request';
export default {
  name: 'fkq-graph-list',
  props: {
    values: {
      type: Array,
      default() {
        return [];
      }
    },
    // edit 编辑；line 单行最多4个，多出省略；默认情况下展示多行；
    // 单行时本组件推荐宽度为 17.25rem （3.75rem * 4 + 0.75rem * 3）
    type: String,
    startIndex: {
      type: Number,
      default: 1
    }
  },
  filters: {
    filterBackgroundImage(data) {
      const preview = data.preview;
      return preview ? `background-image: url(${preview})` : '';
    }
  },
  data() {
    return {
      activeKey: '',
      fkqList: [],
      fkqLength: 0
    };
  },
  watch: {
    values: {
      handler: async function(val) {
        let fkqList = val || [];
        if (this.type === 'line') {
          const length = fkqList.length;
          this.fkqLength = length;
          fkqList = fkqList.slice(0, length === 4 ? 4 : 3);
        }
        this.fkqList = await Promise.all(
          fkqList.map(async e => {
            if (e.zpid && !e.preview) {
              try {
                e.preview = await getImg(e.zpid);
              } catch (e) {
                console.log('通过照片ID获取防控圈图片失败！', e);
              }
            }
            return e;
          })
        );
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    graphClick(item, index) {
      this.activeKey = item.key;
      this.$emit('view-fkq', item, index);
    }
  }
};
</script>

<style lang="scss" scoped>
.fkq-graph-list {
  display: flex;
  flex-wrap: wrap;
  .btn-clear {
    width: 100%;
    margin-bottom: 12px;
  }
  $itemWidth: 3.75rem;
  $itemSplit: 0.75rem;
  &-item {
    position: relative;
    cursor: pointer;
    width: $itemWidth;
    height: $itemWidth;
    background-image: url(./../../assets/images/icon/fkq-qy-icon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: $itemSplit;
    margin-right: $itemSplit;
    text-align: center;
    font-size: $itemWidth * 0.6;
    line-height: $itemWidth;
    &.edit {
      border: var(--border);
      border-radius: 2px;
    }
    .location {
      color: var(--color-primary);
    }
    .iconf-circle-close {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      color: rgba(0, 0, 0, 0.5);
      line-height: 1;
    }
    &.active {
      .location {
        color: var(--color-danger);
      }
    }
  }
  &.line {
    .fkq-graph-list-item {
      margin-bottom: 0;
      &:nth-child(4) {
        margin-right: 0;
      }
    }
    .fkq-graph-list-item-line {
      cursor: pointer;
      width: 3.75rem;
      height: 3.75rem;
      line-height: 3.75rem;
      text-align: center;
      background: var(--color-gray);
      border: 1px dashed var(--border-color-base);
    }
  }
}
</style>
<style lang="scss">
$graphNumber: 5;
$itemWidth: 3.75rem;
$itemSplit: 0.75rem;
$outPadding: 1rem;
.fkq-graph-popper {
  padding: $outPadding;
  $maxWidth: $outPadding * 2 + $graphNumber * ($itemWidth + $itemSplit) - $itemSplit;
  max-width: calc(#{$maxWidth} + 2px);
  border: 1px solid var(--border);
  box-shadow: 0 4px 16px 0 var(--border-color-base);
  border-radius: 2px;
  .fkq-graph-list {
    margin-right: -$itemSplit;
    margin-bottom: -$itemSplit;
  }
}
</style>
