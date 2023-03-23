/**
 * 群组
 * create by 方鸿强 on 2020-12-15 16:11:01
 */
import request from "@/utils/request";
import qs from 'qs';
import { getSetting } from '../../common';
let mp = getSetting('QZ_BKDX');

let api = {
  /**
   * 添加
   * @param qzxxTo TQzxxTo
   * 		群组信息
   */
  add: function (qzxxTo) {
    return request.post(`/v1/qzxx`, qzxxTo, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'appVersion':'1.0.0',
        'framework':'qb'
      }
    });
  },
  /**
   * 修改
   * @param id String
   * 		id
   * @param qzxx TQzxxTo
   * 		null
   */
  update: function (id, qzxx) {
    return request({
      url: `/v1/qzxx/${id}`,
      method: 'put',
      data: qzxx,
      baseURL: mp
    });
  },
  /**
   * 删除
   * @param id String
   * 		id
   */
  delete: function (id) {
    return request({
      url: `/v1/qzxx/${id}`,
      method: 'delete',
      baseURL: mp
    });
  },
  /**
   * 详情
   * @param id String
   * 		id
   */
  load: function (id) {
    return request.get(`${mp}/v1/qzxx/${id}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'appVersion':'1.0.0',
        'framework':'qb'
      }
    });
  },
  /**
   * 群组列表
   */
  paging: function () {
    return request.post(`${mp}/v1/qzxx/paging`, qs.stringify({}), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'appVersion':'1.0.0',
        'framework':'qb'
      }
    });
  },
  /**
   * 查询群组
   * @param bkdxbh String
   * 		布控对象编号
   */
  query: function (bkdxbh) {
    // 组装请求参数，并返回请求实例
    let submitData = {};
    submitData.bkdxbh = bkdxbh;
    return request.get(`${mp}/v1/qzxx`, {params: submitData}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'appVersion':'1.0.0',
        'framework':'qb'
      }
    });
  }
};
export default api;