<template>
  <div class="warning-layout">
    <div class="warning-layout__left">
      <template>
        <infinite-scroll
          v-if="leftListConfig.url"
          :key="leftListConfig.url"
          class="warning-layout__left-content"
          ref="scroll"
          v-model="scrollModel"
          :url="leftListConfig.url"
          :searchCondition="leftListConfig.searchCondition"
          :sortProps="leftListConfig.sortProps"
          :module="module"
          :dataFilter="dataFilter"
          :lazy="true"
          height="100%"
          :primaryKey="primaryKey"
          :activeFirst="false"
          :noMore="false"
          :nodeFilter="leftListConfig.nodeFilter"
          @change="$emit('changeCard', $event)"
          @load="infiniteLoad"
        >
          <template slot="prepend">
            <slot name="prepend"></slot>
          </template>
          <template slot="empty">
            <slot name="empty"></slot>
          </template>
          <template v-slot:noMore>
            <span></span>
          </template>
          <template v-slot:list="bind">
            <slot name="list" v-bind="bind"></slot>
          </template>
          <template v-slot="row">
            <slot v-bind="row"></slot>
          </template>
        </infinite-scroll>
        <div class="warning-layout__left-content" v-else>
          <slot name="leftContent"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@icccPath/pages/qwbk/group-detail/event-bus';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'warning-layout',
  model: {
    // prop: 'menuActive',
    event: 'input'
  },
  components: {},
  props: {
    // menuActive: String,
    module: String,
    leftListConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    dataFilter: Boolean,
    // 主键
    primaryKey: [Boolean, String]
  },
  computed: {
    ...mapGetters(['searchCallBack'])
  },
  data() {
    return {
      isSlide: false,
      scrollModel: ''
    };
  },
  watch: {
    $route: {
      handler() {
        this.updateScrollModel(this.$route.params.id);
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.search();
    },
    bindEvent() {
      EventBus.$on('update-list', data => {
        this.search();
      });
      window.addEventListener('beforeunload', this.beforeunload);
    },
    unbindEvent() {
      EventBus.$off();
      window.removeEventListener('beforeunload', this.beforeunload);
    },

    search(searchCondition, cb, resetSelected) {
      if (cb) {
        this.SET_SEARCH_CALLBACK(cb);
      }
      if (searchCondition) {
        this.$emit('updateCondition', searchCondition);
      }
      if (resetSelected) {
        this.scrollModel = '';
      }
      this.$nextTick(() => {
        const instance = this.$refs.scroll;
        if (instance) {
          instance.reinit();
        } else {
          this.$emit('search');
        }
      });
    },
    infiniteLoad(result, nodeList) {
      this.$emit('load', result, nodeList);
      if (this.searchCallBack) {
        this.searchCallBack();
      }
    },
    onSlide() {
      this.isSlide = !this.isSlide;
    },
    updateScrollModel(id) {
      this.scrollModel = id;
    },
    beforeunload() {},
    ...mapMutations(['SET_SEARCH_CALLBACK'])
  },
  mounted() {
    this.bindEvent();
  },
  created() {
    this.init();
  },
  activated() {
    this.bindEvent();
  },
  deactivated() {
    this.unbindEvent();
  },
  destroyed() {
    this.unbindEvent();
  }
};
</script>

<style lang="scss" scoped>
.warning-layout {
  width: 100%;
  height: calc(100% - 3.5rem);
  overflow: hidden;

  &__left {
    width: 100%;
    background: var(--color-white);
    height: 100%;
    overflow: hidden;
    &-content {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
