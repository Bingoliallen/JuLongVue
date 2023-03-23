<!--
 布控任务单-布控对象
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <search-page-grid
    ref="page"
    class="control-target"
    :url="url"
    :scroll="false"
    :condition="searchCondition"
    :toolConfig="toolConfig"
    :gridConfig="gridConfig"
  >
    <template v-slot:tool="{ selectedData }">
      <div class="bksp_target">
        <div class="bulkImport-upload">
          <div class="bulkImport-upload__tip">
            <span
              >布控对象共<span class="object">{{ sfzrxbkglsx.total ? sfzrxbkglsx.total : '0' }}</span
              >个，其中身份证<span class="object">{{ sfzrxbkglsx.sfznum ? sfzrxbkglsx.sfznum : '0' }}</span
              >个，人像布控<span class="error">{{ sfzrxbkglsx.rxbknum ? sfzrxbkglsx.rxbknum : '0' }}</span
              >个，属性关联<span class="success">{{ sfzrxbkglsx.glsxnum ? sfzrxbkglsx.glsxnum : '0' }}</span
              >个。</span
            >
          </div>
        </div>
        <div class="bkdx__head">
          <el-input
            v-model="keyword"
            v-trim
            placeholder="请输入关键字筛选结果"
            suffix-icon="el-icon-search"
            clearable
            @change="search()"
            @input="search()"
          ></el-input>
        </div>
      </div>
    </template>
    <template v-slot="{ data }">
      <controlObjectCard :isDel="false" :item="data"></controlObjectCard>
    </template>
  </search-page-grid>
</template>
<script>
import controlObjectCard from '@icccPath/components/scenes-bkdx/modules/control-object-card/index';
import rwdSqxxApi from '@icccPath/api/rwd-sqxx';
export default {
  name: 'control-target',
  // 接收父页面传过来的属性
  props: {
    id: String
  },
  components: { controlObjectCard }, // 注册局部组件
  // 页面数据绑定
  data() {
    return {
      sfzrxbkglsx: {},
      url: '/v1/sqdx/search',
      keyword: '',
      toolConfig: {
        class: 'control-target__tool',
        checkbox: false
      },
      gridConfig: {
        // 格子宽
        itemWidth: '19.75rem',
        itemHeight: '72px',
        // 间距
        gap: '1rem'
      },
      searchCondition: [{ name: 'SQID', op: '=', value: this.id }],
      // 参数名称及默认值
      relevanceShow: false, // 获取关联弹窗是否显示
      relevanceDis: false, // 获取关联按钮是否禁用
      form: {}, // 获取关联弹窗Form
      attributeList: [
        { label: '手机号', value: 'sjh' },
        { label: 'QQ', value: 'qq' }
      ],
      relationalObjectList: [
        { label: '配偶', value: 'po' },
        { label: '儿子', value: 'ez' }
      ]
    };
  },
  watch: {
    id(val) {
      this.loadData();
      this.search();
    }
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    search() {
      this.searchCondition = [
        { name: 'SQID', op: '=', value: this.id },
        { name: 'GJZ', value: this.keyword, op: 'like', mergerName: 'BKDXHM' }
      ];
      this.$nextTick(() => {
        this.$refs.page.search();
      });
      this.loadData();
    },
    loadData() {
      let that = this;
      let mSearchCondition = {
        bkdxhm: this.keyword
      };
      rwdSqxxApi.sfzrxbkglsx(this.id, mSearchCondition).then((res) => {
        if (res.data) {
          that.sfzrxbkglsx = res.data;
        }
      });
    }
  },
  updated() {},
  // 组件创建时调用
  created() {
    this.loadData();
  }
};
</script>
<style lang="scss" scoped>
.control-target {
  padding: 1.5rem 0rem;
  /deep/ .control-target__tool {
    position: relative;
    margin-bottom: 0rem !important;
  }
  /deep/.search-page-grid__content /deep/.grid {
    margin: 1rem 0 1rem;
    display: grid;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding-left: 0;
  }
}
.bksp_target {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0rem;
  .bulkImport-upload {
    &__tip {
      // padding: 24px 25px 23px 0px;
      background: var(--color-white);
      border-top: none;
      .object {
        color: var(--color-primary);
      }
      .success {
        color: var(--color-success);
      }
      .error {
        color: var(--color-danger);
      }
    }
  }
  .bkdx__head {
    /*float: right;*/
    margin-left: 10px;
    width: 23rem;
  }
}

/deep/.control-object-card {
  padding-left: 16px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  border: 1px solid var(--border-color-base);
  cursor: pointer;
  margin-bottom: 0rem !important;
}
</style>
