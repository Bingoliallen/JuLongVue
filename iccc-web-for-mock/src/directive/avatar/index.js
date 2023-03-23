/**
 * 用来绑定头像
 * Created by hecg on 2020/7/20.
 */
import { zpfwShowZp } from '@icccPath/api/common';
import { getSetting } from '@icccPath/utils/request';
import { bkdxHmlxToIcon } from '@icccPath/utils/tool';

const getDefaultIcon = (avatarType, customClass = '') => {
  const className = customClass + ' iconfont avatar-error';
  return avatarType ? `${className}__${avatarType}` : className;
};

const renderImgList = ($el, list, onEmpty, avatarType, className) => {
  list.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = getDefaultIcon(avatarType, className);
    $el.appendChild(img);
  });
};

const handler = (el, value) => {
  // 是否 img 标签
  // 是 img 标签，获取照片然后绑定到 el
  // 非 img 标签，在 el 内部生成多个 img 展示出来
  const isImg = el.nodeName.toUpperCase() === 'IMG';
  let { type = '111', id, scale, onEmpty, className, module } = value || {};
  if (el.dataset.id === id && el.dataset.type === type) {
    // id type 未改变，不触发数据更新
    return;
  }
  el.src = '';
  el.dataset.type = type || '';
  el.dataset.scale = scale || '';
  el.dataset.id = id || '';
  const avatarType = bkdxHmlxToIcon(type);
  el.className = getDefaultIcon(avatarType, className);

  new Promise(async (resolve, reject) => {
    if (!id) {
      return reject('照片参数不存在');
    }
    if (avatarType === 'ry') {
      // 用身份证号码获取照片
      resolve(await zpfwShowZp(id));
    }
    if (avatarType === 'zp') {
      // 用照片ID获取照片
      const baseURL = getSetting(module || 'BASE_API');
      resolve([`${baseURL}/api/file/view/${id}`]);
    }
  })
    .then(imgList => {
      if (!imgList || !imgList.length) {
        throw new Error('服务器照片数据为空！');
      }
      el.dataset.imgLength = imgList.length;
      if (isImg) {
        el.src = imgList[0];
      } else {
        renderImgList(el, imgList, onEmpty, avatarType, className);
      }
    })
    .catch(e => {
      if (onEmpty) {
        onEmpty();
      }
      console.log('获取照片失败 id：' + id, e);
    });
};

/**
 * 1、功能说明：用身份证号码获取头像列表；
 *    如果使用在 img 标签上，绑定第一张照片进行展示；
 *    如果使用在非 img 标签上，在该标签内部生成多个 img 标签进行展示。
 * 2、指令参数以对象形式传入：
 *    v-avatar="{
 *      type: 布控对象号码类型
 *      id: 目前是身份证号码,
 *      scale: 照片计算比例，宽比高
 *      onEmpty: 没有获取到头像时执行的函数
 *    }"
 */
export default {
  inserted(el, { value }) {
    handler(el, value);
  },
  componentUpdated(el, { value }) {
    handler(el, value, true);
  }
};
