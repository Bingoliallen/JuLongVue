import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import permission from './modules/permission';
import tagsView from './modules/tags-view';
import user from '@qb/qs-icccd/src/store/modules/user';
import addObjStatus from './modules/addObjStatus';
// 表码字典
import codeDict from './modules/codeDict';
// 背景状态
import bgState from '@qb/qs-icccd/src/store/modules/backgroundState';
// 布控审批
import bksp from './modules/bksp';
import bjfz from './modules/bjfz';
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    codeDict,
    bgState,
    addObjStatus,
    bksp,
    bjfz
  }
});

export default store;
