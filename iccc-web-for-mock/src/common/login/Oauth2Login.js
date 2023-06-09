/**
 * dcuc,dids,dssoac登录
 * @Author: huangjq
 * @Date:   2019-10-16
 * @Project jz
 */
import Login from './abstract/AbsLoginApi';
import store from '@icccPath/store';
import { getSetting } from '../../utils/sys-settings';
import { getToken } from '../../utils/auth';

class Oauth2Login extends Login {
  constructor() {
    super();
  }

  judgeIsLogin() {}

  logout() {
    let logoutUrl = `${window.rootPath}/gateway-oauth/authorize/logout?access_token=${sessionStorage.auth_token}&redirect_uri=${window.location.href}`;
    store.dispatch('LogoutOauth', logoutUrl).then(() => {
      if (!window.sessionStorage['authorizeUrl']) {
        window.location.reload();
      } else {
        window.location.href = logoutUrl;
      }
    });
  }

  beforeRequest(config) {
    if (store.getters.token) {
      // 让每个请求携带authorization-- ['authorization']为自定义key 请根据实际情况自行修改
      config.headers['access_token'] = getToken();
    }
    // config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
  }

  afterResponseSuccess(response) {
    return response;
  }

  afterResponseFailed(error) {
    if (!error || !error.config) {
      // @Modify by hecg on 2021.03.26 未知异常不拦截
      return;
    }
    return new Promise(function(resolve) {
      if (error.config.responseType === 'blob') {
        let data = error.response.data;
        let fileReader = new FileReader();
        fileReader.onload = function() {
          try {
            error.response.data = JSON.parse(this.result);
            resolve();
          } catch (err) {
            resolve();
          }
        };
        fileReader.readAsText(data);
      } else {
        resolve();
      }
    }).then(() => {
      if (error.response.status === 403 && error.response.data.statusCode === '403') {
        let link = error.response.data.link;
        !link && (link = error.response.data.authorizeUrl);
        sessionStorage['authorizeUrl'] = link;

        // Oauth2登录方式
        let paramArr = [];
        paramArr.push(`response_type=code`);
        paramArr.push(`client_id=${getSetting('CLIENT_ID')}`);
        paramArr.push(`is_oauth=1`);
        paramArr.push(`appCode=${getSetting('APP_CODE')}`);
        if (getSetting('LOGIN_PAGE')) paramArr.push(`loginPage=${getSetting('LOGIN_PAGE')}`);
        paramArr.push(
          `redirect_uri=${'http://' + window.location.host + '/' + encodeURIComponent(window.location.hash)}`
        );
        link += `/authorize?${paramArr.join('&')}`;
        link = link.replace('/authorize/authorize', '/authorize');
        window.location.href = link;
        return { status: error.response.status, link };
      }
    });
  }
}

export default Oauth2Login;
