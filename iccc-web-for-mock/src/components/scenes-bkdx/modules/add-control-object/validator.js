const array = [
  { name: '111', value: 'isIdCard' },
  { name: '414', value: 'isPassport' },
  { name: 'GATXZ', value: 'isHongKongLaissezPasser' },
  { name: 'HXZ', value: 'isReentryPermit' },
  { name: 'QTZJHM', value: 'isEmpty' },
  { name: 'CPH', value: 'isVehicleNumber' },
  { name: 'CJH', value: 'isVIN' },
  { name: 'FDJH', value: 'isMotor' },
  { name: 'SJ', value: 'isMobile' },
  { name: 'IMEI', value: 'isEmpty' },
  { name: 'IMSI', value: 'isEmpty' },
  { name: 'MAC', value: 'isEmpty' },
  { name: 'WX', value: 'isWx' },
  { name: 'QQ', value: 'isQQ' },
  { name: 'WB', value: 'isEmpty' },
  { name: 'EMAIL', value: 'isEmpty' },
  { name: 'QTXNSFHM', value: 'isEmpty' },
  { name: 'YHK', value: 'isEmpty' },
  { name: 'QTBKHM', value: 'isEmpty' }
];

/**
 * @description:校验身份证
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isIdCard(rule, value, callback) {
  // let regularStr = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  let regularStr = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的身份证!'));
  } else {
    callback();
  }
}
/**
 * @description:校验护照号码
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isPassport(rule, value, callback) {
  let regularStr = /(^[EeKkGgDdSsPpHh]\d{8}$)|bai(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的护照号!'));
  } else {
    callback();
  }
}
/**
 * @description:校验港澳通行证号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isHongKongLaissezPasser(rule, value, callback) {
  let regularStr = /^([HM]{1}([0-9]{10}|[0-9]{8})|([CL][0-9]{8})|([W]{1}[0-9]{7,10}))$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的港澳通行证号!'));
  } else {
    callback();
  }
}
/**
 * @description:校验回乡证号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isReentryPermit(rule, value, callback) {
  let regularStr = /^[a-zA-Z]\d{8}$|^\d{15}$|^\d{17}(\d|x|X)$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的回乡证号!'));
  } else {
    callback();
  }
}
/**
 * @description:校验车架号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isVIN(rule, value, callback) {
  let regularStr = /^[A-HJ-NPR-Z\d]{17}$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的车架号!'));
  } else {
    callback();
  }
}
/**
 * @description:校验发动机号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isMotor(rule, value, callback) {
  let regularStr = /^[a-zA-z]\w{8}$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的发动机号!'));
  } else {
    callback();
  }
}

/**
 * @description:校验车牌号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isVehicleNumber(rule, value, callback) {
  if (value) {
    value = value.toUpperCase();
  }
  let regularStr = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z](([DF]((?![IO])[A-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳领]{1}|[1-3]{1}[0-9]{2}[A-HJ-NP-Z0-9]{3}[使]{1})|[使]{1}[1-3]{1}[0-9]{2}[A-HJ-NP-Z0-9]{3}|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[1-3]{1}[0-9]{2}[A-HJ-NP-Z0-9]{2}[领]{1}$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  }
  //  else if (value.length != 7) {
  //   callback(new Error('车牌号长度错误!'));
  else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的车牌号!'));
  } else {
    callback();
  }
}
/**
 * @description:校验手机号码
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isMobile(rule, value, callback) {
  let regularStr = /^1[3-9]\d{9}$/;
  // let regularStr = /^1[3-8][0-9]{9}(,1[3-8][0-9]{9})*$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的手机号码!'));
  } else {
    callback();
  }
}
/**
 * @description:校验微信号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isWx(rule, value, callback) {
  let regularStr = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(
      new Error('请输入正确的微信号!（6-20个子母、数字、下划线和减号,必须以字母开头（字母不区分大小写）,不能为中文）')
    );
  } else {
    callback();
  }
}
/**
 * @description:校验QQ号
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isQQ(rule, value, callback) {
  let regularStr = /^[1-9][0-9]{4,9}$/;
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else if (!circleIscheck(value, regularStr)) {
    callback(new Error('请输入正确的QQ号!'));
  } else {
    callback();
  }
}
/**
 * @description:检验不能为空
 * @param {Object} rule 需要检验的表单信息，包含自定义规则
 * @param {String} value 传入校验值
 * @param {Function} callback 检验通过未通过回调
 */
function isEmpty(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入对应内容'));
  } else {
    callback();
  }
}

/**
 * @description:
 * @param {String} value 需要判断的值
 * @param {RegExp} rule 正则表达式
 * @return {*}
 */
function circleIscheck(value, rule) {
  let list = value.replace(/[\uff0c]/g, ',').split(',');
  if (value[value.length - 1] == ',') return false;
  if (list.length > 1) {
    list.forEach((item, i) => {
      list[i] = item.trim();
      if (!item) {
        list.splice(i, 1);
      }
    });
    let falg = list.every(item => {
      return rule.test(item);
    });
    return falg;
  } else {
    return rule.test(value);
  }
}

export {
  array,
  isEmpty,
  isIdCard,
  isVehicleNumber,
  isMobile,
  isWx,
  isQQ,
  isPassport,
  isHongKongLaissezPasser,
  isReentryPermit,
  isVIN,
  isMotor
};
export default {
  array,
  isEmpty,
  isIdCard,
  isVehicleNumber,
  isMobile,
  isWx,
  isQQ,
  isPassport,
  isHongKongLaissezPasser,
  isReentryPermit,
  isVIN,
  isMotor
};
