/**
 * 数据请求方法 这个解释一下，封装完成之后：
 * 1. then 里面表示业务请求成功，后端返回了数据；
 * 2. catch里面表示业务失败，包括404，,403，500等错误，
 *    也包括数据请求成功，但是后端返回业务错误（如进行删除操作，后端不允许删除，删除失败也会进入catch）；
 * 3. 也就是说then里面只有一种情况，就是成功，返回数据可以直接用；
 *    而catch里面是失败，失败原因有很多，但是前端只需要提示就行，
 *    而提示会做统一处理，大部分使用场景就只需要写then就行，如果有需要可以加上catch。
 */
import axios from 'axios';
import _ from 'lodash';
import { Loading, Message } from 'element-ui';
import { getToken } from '@icccPath/utils/auth';
import { getSetting } from './../common';

export const baseURL = getSetting('BASE_API');
export { getToken, getSetting };

const loadingMap = {};

const loadingShow = function(config) {
  if (!config['loading']) {
    return;
  }
  let loading = Loading.service({
    lock: true,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.8)',
    text: '数据加载中...'
  });
  config.uuid = new Date().getTime() + '=' + config.url;
  loadingMap[config.uuid] = loading;
};

const loadingHide = function(config) {
  if (!config['loading']) {
    return;
  }
  loadingMap[config.uuid] && loadingMap[config.uuid].close();
  delete loadingMap[config.uuid];
};

const exception = _.throttle(message => {
  Message.error({ showClose: true, message });
}, 3000);

const tip = (data, tip) => {
  if (tip !== undefined && !tip) {
    return;
  }
  let msg;
  // data.status 旧框架
  if (data.status !== undefined && data.errCode + '' === '999') {
    msg = data.errMessage;
  }
  if (data.statusCode !== undefined) {
    msg = data.message;
  }
  exception(msg || '接口异常！');
};

/**
 * An axios instance
 * @config: {
 *     passWrap: 是否跳过封装，默认否
 *     tip: 是否进行错误提示，默认是
 * }
 */
const service = axios.create({
  baseURL: baseURL,
  // 连接超时时间，暂定1分钟
  timeout: getSetting('REQ_TIMEOUT') || 2 * 60 * 1000
});

// request interceptor
service.interceptors.request.use(
  config => {
    config = window.loginUtil.beforeRequest(config);
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    if (sessionStorage.getItem('userConfig')) {
      let userConfig = JSON.parse(sessionStorage.getItem('userConfig'));
      config.headers['ICCC-SCENEID'] =
        userConfig && userConfig.dqcjid ? userConfig.dqcjid : window.systemParams.SCENE_ID;
    }
    loadingShow(config);
    if (config.module) {
      config.baseURL = getSetting(config.module);
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const config = response.config;
    loadingHide(config);
    response = window.loginUtil.afterResponseSuccess(response);

    let data = response.data;
    if (!data) {
      // 没有返回值，直接跳过
      return;
    }
    // 下载文件
    if (config.responseType === 'blob' || config.responseType === 'arraybuffer') {
      // TODO：待完善
      return data;
    }
    // 非下载文件
    if (config.responseType !== 'blob' && !config.passWrap) {
      // status 1 旧框架
      // statusCode 新框架或者网关报错
      if ((data.status !== undefined && +data.status !== 1) || data.statusCode !== undefined) {
        // 这里做错误提示，默认提示
        tip(data, config.tip);
        return Promise.reject(response);
      }
    }

    if (getSetting('IS_MOCK')) {
      if (data.result) {
        // 模拟数据固定格式： { result: 旧数据, status: 1 }
        // 多一层把后端接口的数据放在 result 里面
        return { data: data.result };
      }
    }
    return response;
  },
  error => {
    if (error && error.config) {
      if (!error.config.passWrap && error.response && error.response.data && error.response.status !== 403) {
        tip(error.response.data, error.config.tip);
      }
      loadingHide(error.config);
    }
    window.loginUtil.afterResponseFailed(error);
    return Promise.reject(error);
    // return error;
  }
);

export default service;
export { service as request };
