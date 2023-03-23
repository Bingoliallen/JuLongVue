/**
 * 工具方法
 */
import { MessageBox } from 'ui-component-v4';
import { Message } from 'element-ui';

/**
 * 当前系统时间
 * */
function generateCurrentDate() {
  let nowDate = new Date();
  let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
    week: nowDate.getDay()
  };
  let mon = date.month < 10 ? '0' + date.month : date.month;
  let dat = date.date < 10 ? '0' + date.date : date.date;
  return date.year + '-' + mon + '-' + dat + ' ' + ' ' + weekday[date.week];
}

/**
 * 二次确认弹框
 * @param {Object} option 配置
 */
function confirm(option) {
  const defaultOption = {
    cancelButtonClass: 'btn-custom-cancel',
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  };
  if (typeof option === 'string') {
    option = {
      message: option
    };
  }
  return MessageBox.confirm(option.message || '是否继续？', option.title || '提示', {
    ...defaultOption,
    ...option
  });
}

function alert(option) {
  const defaultOption = {
    confirmButtonText: '确定',
    type: 'info'
  };
  if (typeof option === 'string') {
    option = {
      message: option
    };
  }
  return MessageBox.alert(option.message, option.title || '提示', {
    ...defaultOption,
    ...option
  });
}

/**
 * 生成随机字符串作为key
 * @param len
 * @return {string}
 */
function generateKey(len = 32) {
  const $chars = 'abcdefhijkmnprstwxyz2345678';
  const result = [];
  for (let i = 0; i < len; i++) {
    result.push($chars.charAt((Math.random() * 27) << 0));
  }
  return result.join('');
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @description: 上传文件之前
 * @param {type}
 * @return:
 */
function beforeAvatarUpload(file, type, size) {
  if (type == 'image') {
    const isPNG = file.type === 'image/png';
    const isJPG = file.type === 'image/jpeg';
    const sizeNum = size ? size : 5;
    const isLtSize = file.size / 1024 / 1024 < sizeNum;
    if (!isPNG && !isJPG) {
      Message.error('上传图片只能是 PNG、JPG格式!');
    }
    if (!isLtSize) {
      Message.error(`上传图片大小不能超过 ${sizeNum}MB!`);
    }
    return (isPNG || isJPG) && isLtSize;
  } else if (type == 'file') {
    const isXLSX = file.name.split('.')[1] === 'xlsx';
    if (!isXLSX) {
      Message.error('上传文件只能是 Excel 格式!');
    }
    return isXLSX;
  }
}

/**
 * @func 使用身份证进行计算年龄
 * @param {String} val 需要年龄的身份证号码
 * @returns {String} 返回计算的年龄
 */
function showYear(val) {
  if (!val) return;
  let len = val.length;
  let myDate = new Date();
  let age = 0;
  if (len === 18) {
    age = myDate.getFullYear() - val.substring(6, 10);
    return age;
  } else if (len === 15) {
    age = myDate.getFullYear() - val.substring(6, 8) - 1901;
    return age;
  }
}

const BM_BKDX_HMLX = [
  { value: '111', label: '身份证', icon: 'ry' },
  { value: '414', label: '护照', icon: 'ry' },
  { value: 'GATXZ', label: '港澳通行证', icon: 'ry' },
  { value: 'HXZ', label: '回乡证', icon: 'ry' },
  { value: 'QTZJHM', label: '其他证件', icon: 'ry' },
  { value: 'CJH', label: '车架号', icon: 'cl' },
  { value: 'CPH', label: '车牌号', icon: 'cl' },
  { value: 'FDJH', label: '发动机号', icon: 'cl' },
  { value: 'RLZP', label: '照片', icon: 'zp' },
  { value: 'SJ', label: '手机号', icon: 'sj' },
  { value: 'IMEI', label: 'IMEI', icon: 'sj' },
  { value: 'IMSI', label: 'IMSI', icon: 'sj' },
  { value: 'MAC', label: 'MAC地址', icon: 'sj' },
  { value: 'EMAIL', label: '邮箱', icon: 'yx' },
  { value: 'QQ', label: 'QQ', icon: 'qq' },
  { value: 'WX', label: '微信号', icon: 'wx' },
  { value: 'WB', label: '微博', icon: 'wb' },
  { value: 'QTXNSFHM', label: '其他虚拟身份账号', icon: 'xnsf' },
  { value: 'YHK', label: '银行卡', icon: 'xnsf' },
  { value: 'QTBKHM', label: '其他布控号码', icon: 'qt' }
];
const bkdxHmlxToIcon = hmlx => {
  return (BM_BKDX_HMLX.find(e => e.value === hmlx) || {}).icon;
};

/**
 * 裁剪并压缩图片
 * @param {string} src 原图
 * @param {number} sx 开始剪切的 x 坐标位置
 * @param {number} sy 开始剪切的 y 坐标位置
 * @param {number} sw 被剪切图像的宽度
 * @param {number} sh 被剪切图像的高度
 * @return {Promise<any>} 裁剪并压缩图片后的图片
 */
function cropPicture(src, sx, sy, sw, sh) {
  return new Promise(resolve => {
    // 创建图片对象
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const height = 100;
      canvas.width = canvas.height = height;
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, height, height);
      const img = canvas.toDataURL('image/jpeg');
      resolve(img);
    };
  });
}

// base64转blob
function base64ToBlob(base64Data) {
  const arr = base64Data.split(',');
  const fileType = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let l = bstr.length;
  const u8Arr = new Uint8Array(l);
  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8Arr], {
    type: fileType
  });
}

export {
  generateCurrentDate,
  confirm,
  alert,
  generateKey,
  deepClone,
  beforeAvatarUpload,
  bkdxHmlxToIcon,
  cropPicture,
  base64ToBlob
};
export default {
  generateCurrentDate,
  confirm,
  alert,
  showYear,
  generateKey,
  deepClone,
  beforeAvatarUpload,
  bkdxHmlxToIcon,
  cropPicture,
  base64ToBlob
};
