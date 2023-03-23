/**
 * 引入指令
 * @Author: huangjq
 * @Date:   2019-04-08
 * @Project jz
 */
import translate from './code';
import code from './code/code';
import name from './code/name';
import enumTrans from './code/enum';
import permission from './permission';
import enlarge from './enlarge';
import imgerror from './imgerror';
import trim from './trim';
import avatar from './avatar';

const install = function(Vue) {
  Vue.directive('code', code);
  Vue.directive('name', name);
  Vue.directive('enum', enumTrans);
  Vue.directive('translate', translate);
  Vue.directive('permission', permission);
  Vue.directive('enlarge', enlarge);
  Vue.directive('imgerror', imgerror);
  Vue.directive('trim', trim);
  Vue.directive('avatar', avatar);
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '1.0.0',
  install
};
