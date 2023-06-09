// import axios from "axios";

/**
 * 此处填写文件描述
 * @Author: huangjq
 * @Date:   2019-07-02
 * @Project jz
 */
export function setSettings(settings) {
  sessionStorage['settings'] = JSON.stringify(settings);
}
function _getSettings() {
  return sessionStorage['settings'] ? JSON.parse(sessionStorage['settings']) : JSON.parse('{}');
}
export function getSettings() {
  return _getSettings();
}
export function setSetting(key, value) {
  let settings = JSON.parse(sessionStorage.settings);
  settings[key] = value;
  sessionStorage.settings = JSON.stringify(settings);
}
export function getSetting(key) {
  return _getSettings()[key] || '';
}
export function getSettingBool(key) {
  let val = _getSettings()[key];
  return val + '' === 'true';
}
export function initSettings() {
  let tmp = JSON.parse(JSON.stringify(process.env));
  window.systemParams && Object.assign(tmp, window.systemParams);
  setSettings(tmp);
  return Promise.resolve('初始化配置完成');
  // return axios
  //     .get(`/setting-center`, {
  //         headers: {
  //             // Authorization: "f26ebeaada0760e88e781bdd5c0b1f194f0130c1"
  //         },
  //         params: {}
  //     })
  //     .then(res => {
  //         console.log("连接到配置中心成功");
  //         window.systemParams && Object.assign(tmp, window.systemParams);
  //         if (res.data.length > 0) {
  //             let settings = res.data[0].items;
  //             settings.map(item => {
  //                 tmp[item.key] = item.value;
  //             });
  //         }
  //         setSettings(tmp);
  //     })
  //     .catch(e => {
  //         // console.error("通过配置中心获取配置失败，请见查配置中心地址是否配置正确");
  //         // console.error(e);
  //         console.log("无法连接到配置中心", e)
  //         window.systemParams && Object.assign(tmp, window.systemParams);
  //         setSettings(tmp);
  //     });
}

const methods = {
  initSettings,
  setSettings,
  getSettings,
  getSettingBool,
  setSetting,
  getSetting
};

window.systemParamsUtils = methods;
export default methods;
