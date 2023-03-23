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
  let value, emptyText;
  let bindParams = binding.value;
  let keys = Object.keys(bindParams);
  if (keys.length === 0) {
    throw '表码名称不存在';
  } else {
    params['enum'] = bindParams.enum;
    params['module'] = bindParams.module;
    value = bindParams.value;
    emptyText = bindParams.emptyText;
  }
  ztData.fetchData(
    params,
    function(data) {
      el.textContent = filterText(data[value], emptyText);
    },
    'codeObj'
  );
}
