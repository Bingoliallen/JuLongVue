/**
 * 此处填写文件描述
 * @Author: huangjq
 * @Date:   2019-10-14
 * @Project jz
 */
import AbsLoginApi from './abstract/AbsLoginApi';
import DCISLoginApi from './DCISLogin';
import Oauth2Login from './Oauth2Login.js';
const { getSettingBool } = window.systemParamsUtils;

class LoginApi extends AbsLoginApi {
  NO_LOGIN_STATUS = {
    '9': '登出成功',
    '10': '未登录',
    '11': '登录超时',
    '13': '登出'
  };

  api = null;

  constructor() {
    super();
    if (getSettingBool('IS_OAUTH2')) {
      this.api = new Oauth2Login();
    } else {
      this.api = new DCISLoginApi();
    }
  }

  /**
   * 判断是否登录
   */
  judgeIsLogin(response) {
    return this.api.judgeIsLogin(response);
  }

  /**
   * 登出
   */
  logout(pageObj) {
    return this.api.logout(pageObj);
  }

  /**
   * 发起请求之前执行
   */
  beforeRequest(config) {
    return this.api.beforeRequest(config);
  }

  /**
   * 请求成功之后的回调
   */
  afterResponseSuccess(response) {
    return this.api.afterResponseSuccess(response);
  }

  /**
   * 请求失败的回调
   */
  afterResponseFailed(error) {
    return this.api.afterResponseFailed(error);
  }
}

window.loginUtil = new LoginApi();
// export default LoginApi;
