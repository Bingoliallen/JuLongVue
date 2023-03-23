/**
 * 统一引用工具类
 * @Author: huangjq
 * @Date:   2019-04-08
 * @Project jz
 */
import dateUtils from 'ui-jz-v4-common/src/utils/date-utils';
let utils = require('@srcPath/common/utils').default;

const { ztService, ztMoment, ztLodash, ztForm, ztWin } = utils;

import $tool from './tool';

const install = function(Vue) {
  Object.defineProperty(Vue.prototype, '$moment', { value: ztMoment });
  Object.defineProperty(Vue.prototype, '$lodash', { value: ztLodash });
  Object.defineProperty(Vue.prototype, '$req', { value: ztService });
  Object.defineProperty(Vue.prototype, '$form', { value: ztForm });
  Object.defineProperty(Vue.prototype, '$win', { value: ztWin });
  Object.defineProperty(Vue.prototype, '$tool', { value: $tool });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.0',
  install
};

export { dateUtils };
