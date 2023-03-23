/**
 * 表码翻译指令
 * @Author: huangjq
 * @Date:   2019-04-08
 * @Project jz
 */
import ztData from '@srcPath/utils/zt-data';

function handler(el, binding) {
  const { code, module, value, emptyText, showTitle, joinText } = binding.value;
  if (!value) {
    el.textContent = emptyText || '-';
    return;
  }
  if (!code) {
    console.error('表码名称不存在！');
    return;
  }
  ztData.fetchData(
    { code, module },
    function(data) {
      let endResult = value;
      if (data) {
        endResult = value
          .split(',')
          .map(key => data[key] || emptyText || key)
          .join(joinText || ',');
      }
      showTitle && (el.title = endResult);
      el.textContent = endResult;
    },
    'codeObj'
  );
}

export default {
  bind: handler,
  update: handler,
  componentUpdated: handler
};
