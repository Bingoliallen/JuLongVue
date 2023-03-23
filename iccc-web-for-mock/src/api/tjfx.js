import request from '@icccPath/utils/request';
import { getSetting } from './../common';
let mpnzdr = getSetting('BASE_API');
const mp = '';

let api = {
  /**
   * 布控情况概要
   */
  getBkqkgy: function() {
    return request({
      url: `${mp}/v1/bkqkgy`,
      method: 'get',
      baseURL: mpnzdr
    });
  },

  /**
   * 我的布控
   */
  getWdbk: function() {
    return request({
      url: `${mp}/v1/wdbk`,
      method: 'get',
      baseURL: mpnzdr
    });
  },

  /**
   * 我的审批
   */
  getWdsp: function() {
    return request({
      url: `${mp}/v1/wdsp`,
      method: 'get',
      baseURL: mpnzdr
    });
  },

  /**
   * 我的预警
   */
  getWdyj: function() {
    return request({
      url: `${mp}/v1/wdyj`,
      method: 'get',
      baseURL: mpnzdr
    });
  },

  /**
   * 活跃对象
   */
  getHydx: function() {
    return request({
      url: `${mp}//v1/hydx`,
      method: 'get',
      baseURL: mpnzdr
    });
  }
};
export default api;
