/**
 * 身份证获取姓名指令
 * @Author: huangjq
 * @Date:   2019-04-08
 * @Project jz
 */
import { filterText } from '@icccPath/filters/index';
import { getQjdxRyxx } from '@icccPath/api/bkdx/qjdxryxx';
export default {
  bind: handler,
  update: handler,
  componentUpdated: handler
};

function handler(el, binding) {
  let value, type, emptyText;
  let bindParams = binding.value;
  let keys = Object.keys(bindParams);
  if (keys.length === 0) {
    throw '参数为空';
  } else {
    value = bindParams.value;
    type = bindParams.type;
    emptyText = bindParams.emptyText;
  }
  if (type == '111') {
    getQjdxRyxx(value).then(data => {
      let content = data ? data.data.xm : '';
      el.textContent = filterText(content, emptyText);
    }).catch(function () {
      el.textContent = filterText("", emptyText);
    });
  } else {
    el.textContent = filterText(value, emptyText);
  }
}
