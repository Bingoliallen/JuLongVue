/**
 * dcuc,dids,dssoac登录
 * @Author: huangjq
 * @Date:   2019-10-16
 * @Project jz
 */
import Login from './abstract/AbsLoginApi';
import store from '@icccPath/store';
import { getSetting } from '../../utils/sys-settings';

class DCISLogin extends Login {
  constructor() {
    super();
  }

  judgeIsLogin() {}

  logout(pageObj) {
    pageObj.$store.dispatch('Logout').then(() => {
      pageObj.$router.push(`/login?redirect=${pageObj.$route.fullPath}`);
      location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
    });
  }

  beforeRequest(config) {
    return config;
  }

  /**
   * 获取剩余可尝试登陆的次数
   * @param response
   * @returns {number}
   */
  _getRemainLoginTimes(response) {
    // 尝试登陆的次数
    let tryLoginTimes = sessionStorage.tryLoginTimes || 0;
    // 剩余次数
    let remainTimes = 1;

    if (window.systemParamsUtils) {
      // 如果有限制尝试登陆次数
      let reLoginTimes = window.systemParamsUtils.getSetting('LIMIT_TRY_LOGIN_TIMES');
      if (+reLoginTimes > 0 && response.config.url.endsWith('api/user/info')) {
        remainTimes = +reLoginTimes - tryLoginTimes;
        sessionStorage.tryLoginTimes = +tryLoginTimes + 1;
      }
    }
    return remainTimes;
  }

  afterResponseSuccess(response) {
    const res = response.data;
    if (res.statusCode === '401') {
      window.location.href = res.link;
    }
    if (this.NO_LOGIN_STATUS[res.statusCode]) {
      if (res.link) {
        let remainTimes = this._getRemainLoginTimes(response);
        if (remainTimes <= 0) {
          console.error('尝试登陆超出次数限制');
        } else {
          let link = this._getReplacedLink(res);
          window.location.href = link;
          return Promise.reject({ link });
        }
      } else {
        // dssoac登录方式
        store.dispatch('FedLogout').then(() => {
          if (!response.config.url.endsWith('/api/user/info')) {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          }
        });
      }
    } else {
      // 如果正常获取到用户信息，则将登陆次数清零
      if (response.config.url.endsWith('api/user/info')) {
        sessionStorage.tryLoginTimes = 0;
      }
      return response;
    }
  }

  afterResponseFailed(error) {
    return error;
  }

  /**
   * 获取替换关键字后的字符串
   * @param res
   * @returns {*}
   * @private
   */
  _getReplacedLink(res) {
    if (res.loginType === 'dids') {
      res.link = res.link.replace(
        'forwardUrl=',
        'forwardUrl=' + encodeURIComponent(encodeURIComponent(window.location.href))
      );
      if (getSetting('LOGIN_PAGE')) {
        res.link += `&loginPage=${getSetting('LOGIN_PAGE')}`;
      }
    } else if (res.loginType === 'dcuc') {
      res.link = res.link.replace('forwardUrl=', 'forwardUrl=' + encodeURIComponent(window.location.href));
    }
    return res.link;
  }
}

export default DCISLogin;
