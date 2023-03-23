<!--
 此处填写文件描述
 @Author: lbb
 @Date: 2019-04-03
-->
<template>
  <div>
    <div v-if="baseInfo && baseInfo.hmlx === '111'" class="control-title">
      <span>基本信息</span>
    </div>
    <div v-if="baseInfo && baseInfo.hmlx === '111'" class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in generalInfos" :key="index" :label="item.title + '：'">
          <span v-if="item.code" :data-type="item.value" v-code="{ code: item.code, value: item.value }"></span>
          <div v-else style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="item.value">
            {{ item.value | filterText }}
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="infos && infos.length > 0" class="control-title">
      <span>主控对象</span>
    </div>
    <div v-if="infos && infos.length > 0" class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="relevanceForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in infos" :key="index" :label="item.title + '：'">
          <carousel
            style="justify-content: left"
            v-if="item.cardid"
            module="QZ_BKSQ"
            :idCard="item.cardid"
            :avatarType="item.type"
            :isChange="false"
            :isChangeNum="false"
            :isSuspend="true"
            :isPopoverCenter="true"
            isEnlarge="none"
            :imgStyleObject="{ width: '60px', height: '76px', margin: '0' }"
          ></carousel>
          <template v-else>
            <span v-if="item.code" v-code="item"></span>
            <span v-else>{{ item.value | filterText }}</span>
          </template>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="(controls && controls.length > 0) || (photo.urls && photo.urls.length > 0)" class="control-title">
      <span>关联属性</span>
    </div>

    <div v-if="(controls && controls.length > 0) || (photo.urls && photo.urls.length > 0)" class="cv-detail-page__box">
      <!--关联布控表单-->
      <el-form ref="monitorForm" class="cv-detail-page__form" :inline="true" :model="{}" label-width="7.2rem">
        <el-form-item v-for="(item, index) in controls" :key="index" :label="item.title + '：'">
          <span>{{ item.value | filterText }}</span>
        </el-form-item>
        <el-form-item v-if="photo.urls && photo.urls.length > 0" label="人脸照片：" class="cv-detail-page__form--photo">
          <head-list v-if="photo.urls && photo.urls.length > 0" :info="photo"></head-list>
          <span v-else>{{ '' | filterText }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import HeadList from '@icccPath/components/head-list/index';
import bkxxApi from '@icccPath/api/qwbk';
import Carousel from '@icccPath/components/carousel/index';
import { mapActions } from 'vuex';
export default {
  name: 'ControlAttribute',
  // 接收父页面传过来的属性
  props: {
    bkdxbh: String,
    baseInfo: Object
  },
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
      generalInfos: [],
      infos: [],
      controls: [
        // {
        //   title: '车牌号码',
        //   value: ''
        // },
        // {
        //   title: '身份证号码',
        //   value: ''
        // },
        // {
        //   title: '手机号码',
        //   value: ''
        // },
        // // {
        // //   title: '银行账号',
        // //   value: '6227236512541259125'
        // // },
        // {
        //   title: 'QQ号码',
        //   value: ''
        // },
        // {
        //   title: '微信号码',
        //   value: ''
        // }
      ],
      photo: {
        title: '人脸照片：',
        urls: []
      }
    };
  },
  components: {
    Carousel,
    // CardInfo,
    HeadList
  },
  // 计算属性
  computed: {},
  watch: {
    bkdxbh(val) {
      this.getBksx();
    },
    baseInfo() {
      this.getZkdx();
    }
  },
  // 方法
  methods: {
    ...mapActions(['getBm', 'getBmList']),
    _isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == 'object' && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          console.log('error：' + str + '!!!' + e);
          return false;
        }
      }
      console.log('It is not a string!');
    },
    /**
     *字符串转json
     *
     */
    stringToJson(data) {
      if (this._isJSON(data)) {
        return JSON.parse(data);
      } else {
        return '';
      }
    },
    // 主控对象
    async getZkdx() {
      let that = this;
      this.infos = [];
      this.generalInfos = [];
      const list = await this.getBmList({ codeId: 'BM_BKDX_HMLX' });
      const data = list.find(e => e.value === that.baseInfo.hmlx);

      if (this.baseInfo.hmlx == 'ZP' || this.baseInfo.hmlx == 'RLZP') {
        this.infos.push({
          title: '照片',
          cardid: this.baseInfo.hmnr,
          type: this.baseInfo.hmlx
        });
      } else {
        if (data !== undefined && data !== null && data.label) {
          this.infos.push({
            title: data && data.label,
            value: this.baseInfo.hmnr
          });
        }
      }

      if (this.baseInfo.hmlx == 'CPH') {
        this.infos.push({
          title: '车辆类型',
          code: 'BM_BKDX_HMLX',
          value: this.baseInfo.hmbs,
          emptyText: ' '
        });
        // if (this.baseInfo.kzzd) {
        //   this.baseInfo.kzzd = this.stringToJson(this.baseInfo.kzzd);
        // }
        // if (this.baseInfo.kzzd !== undefined && this.baseInfo.kzzd !== null && this.baseInfo.kzzd) {
        //   this.infos.push({
        //     title: '号牌颜色',
        //     value: this.baseInfo.kzzd.hpys
        //   });
        //   this.infos.push({
        //     title: '号牌颜色',
        //     value: this.baseInfo.kzzd.clys
        //   });
        // }
      } else if (this.baseInfo.hmlx == '111') {
        this.getqjdxryxx(this.baseInfo.hmnr);
      }
    },
    // 布控属性
    async getBksx() {
      let that = this;
      let res = await bkxxApi.getBksx(this.bkdxbh);
      if (res.data) {
        const list = await this.getBmList({ codeId: 'BM_BKDX_HMLX' });
        let glsxList = res.data;
        this.photo.urls = [];
        this.controls = [];
        let nameList = [];
        let glsxShowList = [];
        glsxList.forEach(item => {
          if (item.hmlx != 'RLZP' && item.hmlx != 'ZP') {
            nameList.push(item.hmlx);
          } else {
            if (item.hmnr) {
              this.photo.urls.push({
                cardid: item.hmnr,
                type: item.hmlx
              });
            }
          }
        });
        nameList = Array.from(new Set(nameList));
        nameList.forEach(item => {
          const data = list.find(e => e.value === item);
          if (data !== undefined && data !== null && data.label) {
            glsxShowList.push({
              hmlx: item,
              title: data && data.label,
              value: []
            });
          }
        });
        glsxList.forEach(item => {
          let data = glsxShowList.find(e => e.hmlx === item.hmlx);
          if (data && item.hmnr) {
            data.value && data.value.push(item.hmnr);
          }
        });
        glsxShowList.forEach(item => {
          if (item.value instanceof Array) {
            item.value = item.value.join(',');
          }
        });
        that.controls = glsxShowList;
      }
    },
    getqjdxryxx(sfzh) {
      let that = this;
      // this.infos.push({
      //   title: '姓名',
      //   value: ''
      // });
      // bkxxApi.getqjdxryxx(sfzh).then(res => {
      //   if (res && res.data) {
      //     // that.infos[1].value = res.data.bmch ? res.data.xm + '（' + res.data.bmch + '）' : res.data.xm;
      //
      //   }
      // });
      that.generalInfos = [];
      if (this.baseInfo.ryxx !== undefined && this.baseInfo.ryxx !== null && this.baseInfo.ryxx) {
        that.generalInfos.push({
          title: '身份证号',
          code: '',
          value: this.baseInfo.ryxx.sfzh
        });
        that.generalInfos.push({
          title: '年龄',
          code: '',
          value: this.baseInfo.ryxx.sfzh ? that.getAge(this.baseInfo.ryxx.sfzh) : ''
        });
        if (this.baseInfo.kzzd) {
          this.baseInfo.kzzd = this.stringToJson(this.baseInfo.kzzd);
        }
        let xm = '',
          rybh = '';
        if (this.baseInfo.kzzd !== undefined && this.baseInfo.kzzd !== null && this.baseInfo.kzzd) {
          xm = this.baseInfo.ryxx.xm ? this.baseInfo.ryxx.xm : this.baseInfo.kzzd.ryxm;
          rybh = this.baseInfo.kzzd.rybh;
        } else {
          xm = this.baseInfo.ryxx.xm;
          rybh = undefined;
        }
        that.generalInfos.push({
          title: '姓名',
          code: '',
          value: this.baseInfo.ryxx.bmch ? xm + '（' + this.baseInfo.ryxx.bmch + '）' : xm
        });
        that.generalInfos.push({
          title: '性别',
          code: 'BM_XB0000',
          value: this.baseInfo.ryxx.xb
        });
        that.generalInfos.push({
          title: '民族',
          code: 'BM_MZ0000',
          value: this.baseInfo.ryxx.mz
        });
        that.generalInfos.push({
          title: '籍贯',
          code: 'BM_BZ_XZQH',
          value: this.baseInfo.ryxx.jg
        });
        that.generalInfos.push({
          title: '户籍地区划',
          code: 'BM_BZ_XZQH',
          value: this.baseInfo.ryxx.hjdqh
        });
        that.generalInfos.push({
          title: '地址',
          code: '',
          value: this.baseInfo.ryxx.jzdxz
        });
      }
    },
    /**
     * 获取生日，性别，年龄
     * @return {sex, age, birth}
     */
    getAge(sfzh) {
      let iden = sfzh;
      let sex = null;
      let birth = null;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if (sfzh.length === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;
        sex = iden.substring(16, 17);
        birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14);
        if (iden.substring(10, 12) < month || (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)) age++;
      }
      if (sfzh.length === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
        sex = iden.substring(13, 14);
        birth = '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12);
        if (iden.substring(8, 10) < month || (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)) age++;
      }

      if (sex % 2 === 0) {
        sex = '0';
      } else {
        sex = '1';
      }
      return age;
    }
  },
  // 组件创建时调用
  created() {
    this.getBksx();
  }
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
  padding: 0 2.6rem 2rem;

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
