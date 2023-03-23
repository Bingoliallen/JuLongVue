<template>
  <div class="total-card">
    <div class="title">{{ title }}</div>
    <div class="total-card__number">
      <span class="b-number">{{ isNaN(Number(modelData.jrzs)) ? +0 : Number(modelData.jrzs).toLocaleString() }}</span
      >{{ unit }}
    </div>
    <p class="total-card__msg">
      <span class="b-line b-number"
        >今日<em
          class="ft-digital"
          :title="
            `${modelData.jrzs - modelData.zrzs < 0 ? '' : '+'}${
              isNaN(Number(modelData.jrzs - modelData.zrzs))
                ? 0
                : Number(modelData.jrzs - modelData.zrzs).toLocaleString()
            }`
          "
          >{{ modelData.jrzs - modelData.zrzs>=0  ? '+' : ''
          }}{{
            isNaN(Number(modelData.jrzs - modelData.zrzs))
              ? 0
              : Number(modelData.jrzs - modelData.zrzs).toLocaleString()
          }}</em
        ></span
      >
      <span :class="['b-line b-percent', modelData.jrzs - modelData.zrzs >= 0 ? 'is-green' : 'is-red']"
        ><span class="total-card__number">环比 </span
        ><span class="ft-digital">{{ modelData.jrzs - modelData.zrzs>=0  ? '+' : '' }}{{ modelData.hbs }}%</span>
        <template v-if="modelData.jrzs - modelData.zrzs>=0">
          <img class="b-status" src="@icccPath/assets/images/icon/arrow_down_big.png" />
        </template>
        <template v-else>
          <img class="b-status" src="@icccPath/assets/images/icon/arrow_up_big.png" />
        </template>
      </span>
    </p>
    <img class="img-cion" :src="require('@icccPath/assets/images/icon/' + icon + '.png')" />
  </div>
</template>

<script>
export default {
  // 卡片布局
  name: 'total-card',
  props: {
    modelData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    icon: {
      type: String,
      default: function() {
        return '';
      }
    },
    title: {
      type: String,
      default: function() {
        return '布控对象总数';
      }
    },
    unit: {
      type: String,
      default: function() {
        return '个';
      }
    }
  },
  data() {
    return {
      // totla: '1384767',
      // JRZJQK: 1,
      // JRZJS: 1434,
      // HBS: '23.67%',
      // HBSZJQK: '1'
    };
  },
  methods: {
    init() {}
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.total-card {
  flex: 1;
  border-radius: 8px;
  height: 8.5rem;
  background-color: #f1f6ff;
  background: linear-gradient(to bottom, #f5f8ff 0%, #e7efff 100%);
  max-width: 17.625rem;
  font-family: Helvetica-Bold;
  position: relative;
  @include mq($large) {
    margin-right: 2rem;
    padding: 1.375rem 0rem 1.375rem 1.5rem;
  }
  @include mq($medium) {
    margin-right: 2rem;
    padding: 1rem 0rem 1rem 1.15rem;
  }
  @include mq($small) {
    margin-right: 1rem;
    padding: 0.75rem 0rem 0.75rem 0.75rem;
  }

  .title {
    font-family: MicrosoftYaHei;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .img-cion {
    width: 4.225rem;
    height: 4.225rem;
    position: absolute;
    top: 20%;
    right: 0.5rem;
  }
  &__number {
    width: 100%;
    cursor: pointer;
    line-height: 1.5;
    font-size: 0.875em;
    color: var(--color-text-regular);
    .b-number {
      text-align: center;
      font-weight: bold;
      letter-spacing: 1px;
      display: inline-flex;
      max-width: calc(100% - 0.5em);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--color-primary);
      // line-height: 3.375rem;
      font-family: Helvetica-Bold;
      @include mq($large) {
        font-size: 2.25rem;
      }
      @include mq($medium) {
        font-size: 2.05rem;
      }
      @include mq($small) {
        font-size: 1.55rem;
      }
    }
  }
  &__msg {
    width: 100%;
    font-size: 0.875em;
    color: var(--color-text-regular);
    line-height: 1.1875rem;
    img {
      // width: 0.8rem;
      // margin-top: -0.2rem;
    }
    span {
      position: relative;
    }
    .b-line {
      position: relative;
      display: inline-block;
      padding: 0rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      /deep/ em {
        letter-spacing: 2px;
        color: var(--color-primary);
        cursor: pointer;
      }
      &:nth-child(1) {
        text-align: left;
        // width: calc(41% - 1rem);

        @include mq($large) {
          margin-right: 2rem;
        }
        @include mq($medium) {
          margin-right: 0.75rem;
        }
        @include mq($small) {
          margin-right: 0.5rem;
        }
      }
      &:nth-child(2) {
        text-align: left;
        width: auto;
      }
      &:nth-child(3) {
        width: calc(100% - 0.625rem);
        text-align: center;
      }
    }

    .b-percent {
      letter-spacing: 2px;
      &.is-red {
        color: var(--color-success);
      }
      &.is-green {
        color: var(--color-danger);
      }
    }
  }
}
</style>
