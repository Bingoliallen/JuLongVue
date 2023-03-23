export default {
  yjsj(rule, value, callback) {
    if (!value) {
      return callback();
    }
    const phoneList = value.replace(/[\uff0c]/g, ',').split(',');
    const reg = /^1[3-9]\d{9}$/;
    if (phoneList.every(phone => reg.test(phone))) {
      callback();
    } else {
      callback(rule.message);
    }
  }
};
