/**
 * 入口文件
 *
 */
// 基础文件引入
import Vue from 'vue';
import Cookies from 'js-cookie';

// 引入页面组件
import App from './app';
import '@icccPath/utils/sys-settings';

// 引入路由文件
import router from '@/router';

// 引入数据状态管理
import store from '@/store';

// 引入国际化语言
import i18n from './lang';
import './common/login/Login';

Vue.config.devtools = true;

// 引入路由权限控制
require('@icccdPath/router/permission');
// 全局引入 封装的组件
const BaseUI = require('@srcPath/components').default;
import BaseComponents from '@icccPath/components/base';
import packageUtils from '@qb/qs-icccd/src/utils/packageUtils';
// 引入退出
import logout from '@qb/qs-icccd/src/utils/logout';
// 全局引入工具类
import utils from './utils';
// global filters
import * as filters from './filters';
import echarts from 'echarts';

if (process.env.IS_MOCK + '' === 'true') {
  let mockXHR = require('../mock').default;
  mockXHR();
}

// 全局引入 element-ui 组件
import ElementUI from 'element-ui';

// 全局引入 ui-component-v4 组件
import UiComponentV4 from 'ui-component-v4';
// 全局引入指令
import directives from '@icccPath/directive';
// 日期使用
import dayjs from 'dayjs';
Vue.prototype.$echarts = echarts;
Vue.prototype.$dayjs = dayjs;
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(UiComponentV4, {
  // set ui-components default size
  size: Cookies.get('size') || 'small',
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(BaseUI);
Vue.use(BaseComponents);
Vue.use(utils);
Vue.use(directives);
Vue.use(packageUtils);
Vue.use(logout);

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;

// 实例化
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});
