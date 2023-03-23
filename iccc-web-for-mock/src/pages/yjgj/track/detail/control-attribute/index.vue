<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div>
    <div class="control-title">
      <span>布控信息</span>
    </div>
    <div class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in infos" :key="index" :label="item.title + '：'">
          <span>{{ item.value }}</span>
        </el-form-item>
      </el-form>
    </div>

    <div class="control-title">
      <span>关联属性</span>
      <!-- <dg-button class="sub-title-right" @click="editFeat()" :type="isEditFeat ? 'primary' : ''" :plain="isEditFeat"
        >{{ isEditFeat ? '保存' : '编辑属性' }}
      </dg-button> -->
    </div>

    <div class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in controls" :key="index" :label="item.title + '：'">
          <span v-if="!isEditFeat">{{ item.value }}</span>
          <el-input v-else v-model="item.value" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="人脸照片：" class="cv-detail-page__form--photo">
          <head-list v-if="!isEditFeat" :info="photo"></head-list>
          <dg-upload
            style="padding-left: 5px;"
            v-if="isEditFeat"
            v-model="fileList"
            list-type="viewer"
            action="#"
            label-name="label"
            value-name="value"
          ></dg-upload>
        </el-form-item>
      </el-form>
    </div>

    <div class="control-title">
      <span>关系对象</span>
      <!-- <dg-button class="sub-title-right" @click="editObject()">编辑对象</dg-button> -->
    </div>
    <dg-row class="u-card-layout">
      <!--卡片-->
      <dg-col :span="12" v-for="(item, index) in tableData" :key="index">
        <div class="u-card-layout-item">
          <card-info :info="item" type="detail"></card-info>
        </div>
      </dg-col>
    </dg-row>
  </div>
</template>

<script>
import CardInfo from '@icccPath/components/card-info/index';
import HeadList from '@icccPath/components/head-list/index';
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
        { title: '布控类别', value: '涉稳/环京7省' },
        { title: '布控级别', value: '三级' },
        { title: '布控范围', value: '全国' },
        { title: '布控事由', value: '两会期间重点涉稳人员批量布控' },
        { title: '申请人', value: '黄霞山' },
        { title: '申请单位', value: '福建省公安厅' },
        { title: '申请时间', value: '2020-06-11  17:23:44' }
      ],
      controls: [
        { title: '车牌号码', value: '闽F155651' },
        { title: '电子邮箱', value: '182202@qq.com' },
        { title: '手机号码', value: '18220203222' },
        { title: '银行账号', value: '6227236512541259125' },
        { title: 'QQ号码', value: '15564551' },
        { title: '微信号码', value: 'JSWW15564551' }
      ],
      photo: {
        title: '人脸照片：',
        urls: [{ cardid: '220124196110274016' }]
      },
      isEditObject: false,
      isEditFeat: false
    };
  },
  components: {
    CardInfo,
    HeadList
  },
  // 计算属性
  computed: {},
  // 方法
  methods: {
    editFeat() {
      /* this.isEditFeat = !this.isEditFeat;*/
      // const wHeight = window.innerHeight;
      // const options = {};
      // const layer = (options.layer = this.$dgLayer({
      //   title: '编辑关联属性',
      //   component: import('../../apply/edit-bkdx/glsxbk'),
      //   btn: ['确定', '取消'],
      //   btnAlign: 'c',
      //   skin: 'layer-no-padding',
      //   maxmin: false,
      //   resize: false,
      //   area: ['1000px', '460px'],
      //   props: { options },
      //   yes: (index, dom) => {
      //     console.log('options', options);
      //     layer.$children[0].submit().then(() => {
      //       this.$message.success('保存关联属性布控！');
      //       layer.close(index);
      //     });
      //   }
      // }));
    },
    editObject() {
      // TODO：数据来源还没有做模拟
      const value = [];
      const bkdxid = 'bkdxid';
      const options = { value, bkdxid, module: 'MOCK_API' };
      const layer = this.$dgLayer({
        title: '编辑关系对象',
        component: import('./edit-gxdxbk'),
        btn: ['确定', '取消'],
        btnAlign: 'c',
        skin: 'layer-no-padding',
        maxmin: false,
        resize: false,
        area: ['1000px', window.innerHeight * 0.8 + 'px'],
        props: { options },
        yes: index => {
          layer.$children[0].submit().then(() => {
            this.$message.success('保存关系对象布控成功！');
            layer.close(index);
          });
        }
      });
    }
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
