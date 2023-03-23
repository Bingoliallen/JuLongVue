<!--
 重点人员-对象信息
 @Author: lbb
 @Date: 2020-11-24
-->
<template>
  <div>
    <div class="control-title">
      <span>地址信息</span>
    </div>
    <div class="cv-detail-page__box">
      <!--地址表单-->
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in infos" :key="index" :label="item.title + '：'">
          <span>{{ item.value }}</span>
        </el-form-item>
      </el-form>
    </div>

    <div class="control-title">
      <span>其他证件信息</span>
    </div>

    <div class="cv-detail-page__box">
      <!--其他证件表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in lxfss" :key="index" :label="item.title + '：'">
          <span v-if="!isEditFeat">{{ item.value }}</span>
          <el-input v-else v-model="item.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="control-title">
      <span>联系方式</span>
    </div>
    <div class="cv-detail-page__box">
      <!--联系方式表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in controls" :key="index" :label="item.title + '：'">
          <span v-if="!isEditFeat">{{ item.value }}</span>
          <el-input v-else v-model="item.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="control-title">
      <span>交通工具</span>
    </div>
    <div class="cv-detail-page__box">
      <!--联系方式表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in jtgjs" :key="index" :label="item.title + '：'">
          <span v-if="!isEditFeat">{{ item.value }}</span>
          <el-input v-else v-model="item.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlAttribute',
  // 接收父页面传过来的属性
  props: {},
  // 页面数据绑定
  data() {
    return {
      // 目标数据
      tableData: [
        {
          cardid: '327377336372727171',
          sfzh: '327377336372727171',
          name: '张王（别名绰号）',
          relation: '父亲',
          messagenum: '',
          sex: '女',
          age: '18',
          nation: '汉族'
        },
        {
          cardid: '327377336372727171',
          sfzh: '327377336372727171',
          name: '李三（别名绰号）',
          relation: '父亲',
          messagenum: '',
          sex: '女',
          age: '18',
          nation: '汉族'
        },
        {
          cardid: '327377336372727171',
          sfzh: '327377336372727171',
          name: '万青（别名绰号）',
          relation: '父亲',
          messagenum: '',
          sex: '女',
          age: '18',
          nation: '汉族'
        },
        {
          cardid: '327377336372727171',
          sfzh: '327377336372727171',
          name: '方特（别名绰号）',
          relation: '父亲',
          messagenum: '',
          sex: '女',
          age: '18',
          nation: '汉族'
        },
        {
          cardid: '327377336372727171',
          sfzh: '327377336372727171',
          name: '武侯（别名绰号）',
          relation: '父亲',
          messagenum: '',
          sex: '女',
          age: '18',
          nation: '汉族'
        }
      ],
      infos: [
        { title: '户籍地址', value: '福建省厦门市湖里区56号' },
        { title: '户籍地派出所', value: '厦门市湖里金山派出所' },
        { title: '居住地址', value: '福建省厦门市湖里区56号' },
        { title: '居住地派出所', value: '厦门市湖里金山派出所' }
      ],
      controls: [
        { title: '手机号码', value: '18220203222' },
        { title: '电子邮箱', value: '182202@qq.com' },
        { title: 'QQ号码', value: '15564551' },
        { title: '微信号码', value: 'Z15564551' }
      ],
      lxfss: [
        { title: '护照号码', value: 'SW27236512541259125' },
        { title: '港澳通号码', value: 'JSWW15564551' }
      ],
      jtgjs: [{ title: '车牌号码', value: '闽F155651' }],
      photo: {
        title: '人脸照片：',
        urls: [{ cardid: '220124196110274016' }]
      },
      isEditObject: false,
      isEditFeat: false
    };
  },
  components: {},
  // 计算属性
  computed: {},
  // 方法
  methods: {
    editFeat() {},
    editObject() {}
  },
  // 组件创建时调用
  created() {}
};
</script>

<style lang="scss" scoped>
.sub-title {
  box-sizing: border-box;
  padding: 20px 32px;
  font-size: 1.3em;
  font-weight: bold;

  &-right {
    float: right;
  }
}

.u-card-layout {
  padding: 0 2.6rem;
  &-item {
    padding: 8px;
    max-width: 370px;
  }
}

.property-card-layout {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  //justify-content: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 0px;

  box-sizing: border-box;

  &-item {
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    padding-left: 0px;
  }

  &-half {
    width: 50%;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    padding-left: 40px;
  }
}

.control-title {
  box-sizing: border-box;
  /*padding: 1rem 0rem;*/
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 0px solid var(--border-color-extra-light);

  > span {
    font-size: 1.3rem;
    font-weight: bold;
  }
}

/* 详情页 -- 高级
  -------------------------- */
.cv-detail-page {
  &__box {
    margin-bottom: 0px;

    &-tittle {
      margin-bottom: 0px;
    }

    &-row {
      padding: 0px 0 0px 10px;
      border-bottom: solid 1px var(--control-informaction_cv-detail-page__box-row_border);

      .text-title {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }

    p {
      line-height: 16px;
    }

    .el-col {
      padding: 5px 0;
    }

    &-no {
      color: var(--color-danger);
    }
  }

  &__table {
    .el-form--inline .el-form-item {
      display: block;
      margin-bottom: 0;
    }

    .el-table__body td {
      background: transparent;
    }
  }
  &__form {
    .el-form-item {
      width: 50%;
      margin: 0px;
      padding: 0.17rem 0px;
      color: var(--color-text-secondary);
      /deep/ .el-form-item__label {
        padding: 0px;
      }
      /deep/ .el-form-item__content {
        color: var(--color-text-primary);
        width: 60%;
      }
    }
    &--photo {
      width: 100% !important;
      display: flex;
      /deep/ .el-form-item__label {
        flex: 0 0 7.2rem;
      }
      /deep/ .el-form-item__content {
        width: 100% !important;
      }
    }
  }
}
</style>
