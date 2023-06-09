/**
 * 表码翻译指令
 * @Author: huangjq
 * @Date:   2019-04-08
 * @Project jz
 */
import utils from '@icccPath/common/utils';
import { filterText } from '@icccPath/filters/index';
const { ztData } = utils;
export default {
  bind: handler,
  update: handler,
  componentUpdated: handler
};

function handler(el, binding) {
  let params = {};
  let emptyText;
  let bindParams = binding.value;
  if (binding.value.enum) {
    params['enum'] = bindParams.enum;
  } else if (binding.value.code) {
    params['code'] = bindParams.code;
  }
  params['module'] = bindParams.module;
  emptyText = bindParams.emptyText;

  ztData.fetchData(
    params,
    function(data) {
      el.textContent = filterText(data[el.textContent], emptyText);
    },
    'codeObj'
  );
}
