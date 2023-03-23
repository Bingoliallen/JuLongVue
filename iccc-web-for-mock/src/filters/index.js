import dateUtils from 'ui-jz-v4-common/src/utils/date-utils';

export const longTime2Str = (t, fmt) => {
  return dateUtils.format(new Date(t), fmt || 'yyyy-MM-dd');
};

export const longTime2StrFull = t => {
  return longTime2Str(t, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * 后端返回的字符串时间转Date
 * @param {String} str 后端返回的字符串
 * @param {String} inFmt 字符串输入格式 默认 yyyyMMddHHmmss
 * @param {String} outFmt 输出格式 默认 yyyy-MM-dd
 * @param {Boolean} isDate 是否输出Date 默认 是
 * @return {String|Date} 返回字符串或者日期
 */
export const strToDate = (str, inFmt, outFmt, isDate = true) => {
  return dateUtils.strToDate(str, inFmt, outFmt, isDate);
};

export const filterText = (str, r = '-') => {
  return str || r;
};

export const filterDate = (str, fmt) => {
  if (!str) {
    return '-';
  }
  if (!fmt) {
    if (str.length === 8) {
      fmt = 'yyyy-MM-dd';
    }
    if (str.length === 14) {
      fmt = 'yyyy-MM-dd HH:mm:ss';
    }
  }
  return str ? longTime2Str(strToDate(str), fmt) : '-';
};

export const filterDateTime = (str, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  return str ? longTime2Str(strToDate(str), fmt) : '-';
};

export const filterPercent = (str, replaceText = '暂无') => {
  const num = Number(str);
  if (!num) {
    return replaceText || '-%';
  } else {
    return (num * 100).toFixed(2) + '%';
  }
};

export function filterCphDxhm(dxhm) {
  let str = dxhm;
  if (dxhm.indexOf('_') !== -1) {
    str = dxhm.split('_')[1];
  }
  return str || '-';
}
