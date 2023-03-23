<!--布控摘要申请-->
<template>
  <dg-scrollbar ref="scrollbar" class="right" v-if="editFlag">
    <div class="title-1">{{ editShow ? '编辑对象关联' : $route.query.id ? '编辑布控对象' : '新增布控对象' }}</div>
    <transition name="el-fade-in">
      <div class="container" v-show="!editShow">
        <el-steps :active="stepActive" align-center finish-status="success">
          <el-step v-for="(item, index) in steps" :key="index" :title="item.name"></el-step>
          <el-step class="el-step-wc" title="添加完成"></el-step>
        </el-steps>
        <el-form
          v-if="!finishFlag"
          class="preview-component"
          :class="{ previewComponentAfter: stepActive == 0 }"
          ref="form"
          :key="stepActive"
          :model="componentModel"
          label-suffix="："
          :label-width="labelWidth"
        >
          <el-form-item
            v-for="(item, index) in list"
            :key="index"
            v-bind="item.formBind"
            :class="{ hidelabel: stepActive == 0 }"
            v-show="item.formBind.prop !== 'sqmc'"
          >
            <component v-bind="item.bind" :is="item.bind.is" v-model="componentModel[item.formBind.prop]"></component>
          </el-form-item>
        </el-form>

        <scenes-complete v-else class="preview-component" ref="scenesComplete" :timerFn="timerFn">
          <template v-slot:text="{ time }"
            >添加完成，请稍等<em>{{ time }}秒</em>进入详情页！</template
          >
          <template v-slot:buttonGroup>
            <dg-button type="text" @click="go(-1)">立即查看</dg-button>
            <!-- <dg-button type="text" @click="console.log(2)">返回上一步</dg-button> -->
            <dg-button type="text" @click="go(0)">继续添加</dg-button>
          </template>
        </scenes-complete>
      </div>
    </transition>
    <transition name="el-fade-in">
      <div class="container" v-if="editShow">
        <edit></edit>
      </div>
    </transition>
    <div class="buttonGroup" v-if="!finishFlag && !editShow">
      <el-button v-if="stepActive != 0" @click="changeStep('back')">上一步</el-button>
      <el-button type="primary" :disabled="nextBtnFlag" v-if="stepActive != 2" @click="changeStep('next')"
        >下一步</el-button
      >
      <el-button type="primary" v-else @click="changeStep('fulfil')">完成</el-button>
      <el-button @click="saveRough" :disabled="nextBtnFlag" v-if="!$route.query.id">存为草稿</el-button>
      <el-button @click="cancel(-1, true)" v-if="!$route.query.id">取消</el-button>
    </div>
  </dg-scrollbar>
</template>

<script>
import edit from '@icccPath/components/scenes-bkdx/modules/edit-objcet/index';
import scenesBkdx from '@icccPath/components/scenes-bkdx/index';
import yjjsrTransfer from '@qb/qs-icccd/src/pages/scenes/components/yjjsr-transfer';
import ScenesComplete from '@qb/qs-icccd/src/pages/scenes/components/scenes-complete';
import QsTranslate from '@qb/qs-icccd/src/components/base/qs-translate';
import WarningRule from '@icccPath/components/warning-rule';
// import QsCyclePick from '@icccPath/components/qs-cycle-pick';
// import NationwideSelection from '@icccPath/components/nationwide-selection';
import QsCyclePick from '@qb/qs-icccd/src/pages/scenes/components/qs-cycle-pick';
import NationwideSelection from '@qb/qs-icccd/src/pages/scenes/components/nationwide-selection';
import QsInput from '@qb/qs-icccd/src/components/base/qs-input';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { sceneLoad } from '@icccPath/api/addObjects';
import scenesValidator from './scenes-validator';
import { longTime2Str } from '@icccPath/filters';
import sqdxApi from '@icccPath/api/sqdx/index.js';

export default {
  name: 'monitor-apply',
  components: {
    scenesBkdx,
    edit,
    yjjsrTransfer,
    ScenesComplete,
    WarningRule,
    QsCyclePick,
    QsTranslate,
    NationwideSelection,
    QsInput
  },
  data() {
    return {
      editFlag: true,
      stepActive: 0,
      publishData: null,
      finishFlag: false,
      steps: [
        { name: '添加布控对象', id: 'bkdx' },
        { name: '填写申请信息', id: 'sqxx' },
        { name: '选择预警方式', id: 'yjfs' }
      ],
      componentModel: { sqmc: '' },
      // 模块的动态执行函数
      dynamicFn: false
    };
  },
  watch: {
    list: {
      handler(val) {
        let _this = this;
        if (val) {
          val.forEach(item => {
            if (_this.$route.query.id) {
              if (!_this.componentModel[item.formBind.prop]) {
                // 设置默认值
                _this.$set(_this.componentModel, item.formBind.prop, item.bind.value);
              }
            } else {
              _this.$set(_this.componentModel, item.formBind.prop, item.bind.value);
            }
          });
          if (_this.componentModelBackUps && !_this.$route.query.id) {
            const obj = Object.assign(_this.componentModel, _this.componentModelBackUps);
            Object.keys(obj).forEach(item => {
              _this.$set(_this.componentModel, item, obj[item]);
            });
          }
        }
      },
      immediate: true
    },
    '$route.query.id': {
      handler(val, oval) {
        if (val) {
          this.detail();
        } else {
          this.$set(this, 'componentModel', { sqmc: '' });
          this.editFlag = false;
          this.$nextTick(() => {
            this.editFlag = true;
            this.cancel();
            this.init();
          });
        }
        if (val != oval) {
          this.stepActive = 0;
          this.SBM_COMPONENT_MODEL_BACKUPS(null);
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['editShow', 'isNext', 'componentModelBackUps', 'userConfig', 'provisionalId']),
    /**
     * @description:呈现组件的list
     */
    list() {
      if (this.finishFlag) {
        return;
      }
      if (
        this.publishData &&
        this.publishData.sceneConfig &&
        this.publishData.sceneConfig[this.stepActive].options.length
      ) {
        return this.publishData.sceneConfig[this.stepActive].options;
      } else {
        return [];
      }
    },
    /**
     * @description:计算Form的label-width;
     */
    labelWidth() {
      if (this.stepActive && this.publishData && this.publishData.sceneConfig[this.stepActive].options.length) {
        let widthList = this.publishData.sceneConfig[this.stepActive].options.map(item => {
          return item.formBind.label.length;
        });
        return Math.max(...widthList) + 3 + 'em';
      } else {
        return 0 + 'em';
      }
    },
    nextBtnFlag() {
      // 先判断至少有一个可布控对象，才能下一步
      // if (true) {
      //   return;
      // }
      if (this.stepActive == 0) {
        return !this.isNext;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SEARCH_CALLBACK']),
    ...mapActions([
      'SBM_STEP_ACTIVE',
      'SBM_PROVISIONAL_ID',
      'SBM_COMPONENT_MODEL_BACKUPS',
      'SBM_ADD_LIST_OBJ',
      'SBM_EDIT_SHOW',
      'SBM_IS_NEXT'
    ]),
    /**
     * @description:初始化
     */
    init() {
      if (!this.$route.query.id) {
        let str = '任务单名称' + longTime2Str(new Date(), 'yyyyMMddHHmmss');
        this.$set(this.componentModel, 'sqmc', str);
      }
      /**
       * @description: 获取添加申请的配置信息
       */
      sceneLoad(this.userConfig.dqcjid).then(res => {
        this.publishData = res.data;
        this.publishData.sceneConfig &&
          this.publishData.sceneConfig.forEach(item => {
            if (item.options.length) {
              item.options = item.options.map(itemOne => {
                const formItemConfig = JSON.parse(itemOne);
                // formItemConfig.formBind.rules[0].selfValidator
                if (formItemConfig && formItemConfig.formBind && formItemConfig.formBind.rules) {
                  formItemConfig.formBind.rules.forEach(rule => {
                    if (rule.selfValidator) {
                      // arg: (rule, value, callback)
                      rule.validator = (...arg) => {
                        return scenesValidator[rule.selfValidator].apply(this, arg);
                      };
                    }
                  });
                }
                return formItemConfig;
              });
            }
          });
      });
      this.$nextTick(() => {
        if (!this.provisionalId) {
          sqdxApi.getTempId(11).then(res => {
            this.SBM_PROVISIONAL_ID(res.data);
          });
        }
      });
    },
    async detail() {
      if (this.$route.query.id) {
        this.init();
        this.SBM_PROVISIONAL_ID(this.$route.query.id);
        const loaddata = await sqdxApi.load(this.$route.query.id);
        loaddata.data.bkqx = loaddata.data.bkjsrq;
        loaddata.data.zfyjxx = JSON.parse(loaddata.data.zfyjxx);
        Object.keys(loaddata.data).forEach(item => {
          this.$set(this.componentModel, item, loaddata.data[item]);
        });
      }
    },
    /**
     * @description:下一步
     * @param {String} val 类型
     */
    changeStep(val) {
      (async val => {
        if (val === 'next') {
          await this.$refs.form.validate();
          this.SBM_STEP_ACTIVE(this.stepActive++);
          if (this.stepActive === this.steps.length) {
            this.finishFlag = true;
          }
          this.save(this.$route.query.id ? '10' : '00');
        } else if (val === 'fulfil') {
          await this.$refs.form.validate();
          this.save('20');
        } else {
          if (this.stepActive !== 0) {
            this.SBM_STEP_ACTIVE(this.stepActive--);
            this.$refs.form && this.$refs.form.clearValidate();
          }
        }
        this.dynamicFn && this.dynamicFn();
        try {
          this.dynamicFn = this.executeCode(this.publishData.sceneConfig[this.stepActive].code);
        } catch (e) {
          console.log(e);
        }
      })(val);
    },
    /**
     * @description:保存草稿
     */
    saveRough() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save('10', true);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /**
     * @description:保存接口
     * @param {String} type 保存的类型
     * @param {Boolean} flag 是否需要草稿保存提示
     */
    save(type, flag) {
      {
        // 代码块
        this.SBM_COMPONENT_MODEL_BACKUPS(JSON.parse(JSON.stringify(this.componentModel)));
        // this.SBM_COMPONENT_MODEL_BACKUPS(this.componentModel);
        let bearObj = JSON.parse(JSON.stringify(this.componentModel));
        bearObj.id = this.provisionalId;
        let date = bearObj.bkqx && bearObj.bkqx.split(',');
        if (date) {
          if (date.length == 2) {
            bearObj.bkksrq = date ? date[0] : '';
            bearObj.bkjsrq = date ? date[1] : '';
          } else {
            bearObj.bkjsrq = date ? date[0] : '';
          }
        }
        delete bearObj.bkqx;
        bearObj.zfyjxx =
          bearObj.zfyjxx &&
          JSON.stringify(
            bearObj.zfyjxx.map(item => {
              return item.response ? item.response : item;
            })
          );
        bearObj.yjfs = bearObj.yjfs ? bearObj.yjfs.join(',') : '';
        bearObj.tjzt = type;
        sqdxApi.sqxxupdate(this.provisionalId, bearObj).then(res => {
          if (type == '20') {
            this.$message.success('提交成功');
            this.stepActive = 4;
            this.finishFlag = true;
          } else if (type == '10') {
            if (flag) {
              this.$message.success('草稿保存成功');
              this.$emit('updateSearch');
            }
            if (!this.$route.query.id) {
              this.cancel(-1);
            } else {
              this.$message.success('草稿保存成功');
            }
          }
        });
      }
    },
    /**
     * @description: 取消添加
     * @param {Boolean} flag 区分是不是成功之后执行还是直接取消
     * @param {Number} num 跳转的值
     */
    cancel(num, flag) {
      this.SBM_ADD_LIST_OBJ({ name: 'addListData', list: [] });
      this.SBM_COMPONENT_MODEL_BACKUPS(null);
      this.SBM_IS_NEXT(false);
      this.SBM_PROVISIONAL_ID('');
      this.stepActive = 0;
      flag && this.$emit('updateSearch');
      num && this.$router.go(num);
    },
    go(num) {
      clearInterval(this.$refs.scenesComplete);
      if (num == 0) {
        this.finishFlag = false;
        this.$set(this, 'componentModel', { sqmc: '' });
        this.cancel();
        if (this.$route.query.id) {
          this.$emit('updateSearch', null, () => {
            this.$router.push({ name: 'monitor-apply' });
            this.SET_SEARCH_CALLBACK(null);
          });
        } else {
          this.init();
        }
      } else {
        if (this.$parent.$parent.$refs.layout.menuActive !== 'rwd') {
          this.$parent.$parent.$refs.layout.changeMenu({ value: 'rwd' });
        }
        this.$emit('updateSearch');
        this.$router.push({ name: 'monitor-detail-task', params: { id: this.provisionalId } });
      }
    },
    /**
     * @description:添加成功五秒延迟效果
     */
    timerFn() {
      if (this.$parent.$parent.$refs.layout.menuActive !== 'rwd') {
        this.$parent.$parent.$refs.layout.changeMenu({ value: 'rwd' });
      }
      this.$emit('updateSearch');
      this.$router.push({ name: 'monitor-detail-task', params: { id: this.provisionalId } });
    },
    executeCode(code, ...arg) {
      return code && new Function(code).apply(this, arg);
    }
  },
  created() {},
  beforeDestroy() {
    this.SBM_ADD_LIST_OBJ({ name: 'addListData', list: [] });
    this.SBM_COMPONENT_MODEL_BACKUPS(null);
    this.SBM_IS_NEXT(false);
    this.SBM_PROVISIONAL_ID('');
    this.stepActive = 0;
  },
  beforeRouteLeave(to, from, next) {
    this.SBM_EDIT_SHOW(false);
    next();
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
};
</script>

<style lang="scss" scoped>
.el-scrollbar {
  /deep/ .el-scrollbar__view {
    height: 100%;
  }
}
.hidelabel /deep/ {
  > label {
    display: none;
  }
}
.right {
  background: var(--color-white);
  .title-1 {
    border-bottom: var(--border-light);
  }
  .container {
    height: calc(100% - 3.5rem);
    // padding: 0 32px;
    .el-steps /deep/ {
      display: flex;
      justify-content: center;
      padding: 1.5rem 2rem;
      .el-step {
        flex-basis: 11.25rem !important;
        cursor: pointer;
        &__line-inner {
          border-bottom: none;
        }
        .el-step__line {
          left: 46%;
        }
        .el-step__head.is-process {
          .el-step__icon {
            background-color: var(--color-primary);
            border: 1px solid var(--color-primary);
          }
        }
      }
      .el-step-wc {
        cursor: default;
        .el-step__head.is-success {
          .el-step__icon {
            background-color: var(--color-primary);
            color: var(--color-white);
          }
        }
      }
    }
    .previewComponentAfter {
      &:after {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }
    .el-form.preview-component {
      height: calc(100% - 6rem - 4.125rem);
      padding: 0 32px;
      overflow: auto;
      .el-form-item.hidelabel {
        width: 100%;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        white-space: normal;
      }
    }
  }
}
.buttonGroup {
  // display: none;
  text-align: center;
  padding: 17px 0;
  text-align: center;
  position: absolute;
  padding: 17px 0;
  bottom: 0;
  left: 50%;
  width: 100%;
  background: white;
  transform: translate(-50%, 0%);
  z-index: 1;
}
.dg-tree-select {
  width: 100% !important;
}
.el-radio-group.dg-radio-group[placeholder='请选择布控级别'] /deep/ {
  .el-radio.dg-radio:nth-child(1) {
    .el-radio__label {
      color: var(--color-danger);
    }
    .el-radio__inner {
      border-color: var(--color-danger);
      &:after {
        background: var(--color-danger);
      }
    }
  }
}
</style>
