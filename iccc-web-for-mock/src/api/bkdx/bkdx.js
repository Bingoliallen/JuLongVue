/**
 * 群组对象
 * create by 方鸿强 on 2020-12-15 16:11:01
 */
import request from "@/utils/request";
import { getSetting } from '../../common';
let mp = getSetting('QZ_BKDX');

let api = {
  /**
   * 获取对象群组统计信息X
   * @param id String
   * 		id
   */
  load_stat: function (id) {
    return request({
      url: `v1/qzxx-dxs-stat/${id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'appVersion': '1.0.0',
        'framework': 'qb'
      },
      baseURL: mp
    });
  },
  /**
   * 获取对象群组信息X
   * @param id String
   * 		id
   */
  load: function (id) {
    return request({
      url: `/v1/qzxx-dx/${id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'appVersion': '1.0.0',
        'framework': 'qb'
      },
      baseURL: mp
    });
  }
};
export default api;