/**
 * Created by hecg on 2020/8/28.
 */
const errorImg = require('@icccPath/assets/images/common/img-error.png');

function bindEvents(el, cb) {
  el.addEventListener('error', function(e) {
    if (this.src !== errorImg) {
      // 暂存丢失的图片
      this.dataset['lost'] = this.src;
      // 替换为错误图片
      this.src = errorImg;
      cb(e);
    }
  });
}

export default {
  inserted(el, { value }, vnode) {
    // 是否 img 标签
    const isImg = el.nodeName.toUpperCase() === 'IMG';
    const cb = e => {
      if (!value) {
        return;
      }
      let method = '';
      if (typeof value === 'string') {
        method = value;
      } else {
        method = value.errorCb;
      }
      vnode.context[method](e);
    };
    if (isImg) {
      bindEvents(el, cb);
    } else {
      const imgs = el.querySelectorAll('img');
      for (let i = imgs.length - 1; i >= 0; i--) {
        bindEvents(imgs[i], cb);
      }
    }
  }
};
