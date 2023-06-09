/**
 * 此处填写文件描述
 * @Author: huangjq
 * @Date:   2019-10-16
 * @Project jz
 */
class AbsLoginApi {
  NO_LOGIN_STATUS = {
    '9': '登出成功',
    '10': '未登录',
    '11': '登录超时',
    '13': '登出'
  };

  constructor() {}

  /**
   * 判断是否登录
   */
  judgeIsLogin() {
    throw new Error('未实现...');
  }

  /**
   * 登出
   */
  logout() {
    throw new Error('未实现...');
  }

  /**
   * 发起请求之前执行
   */
  beforeRequest() {
    throw new Error('未实现...');
  }

  /**
   * 请求成功之后的回调
   */
  afterResponseSuccess() {
    throw new Error('未实现...');
  }

  /**
   * 请求失败的回调
   */
  afterResponseFailed() {
    throw new Error('未实现...');
  }
}

export default AbsLoginApi;
