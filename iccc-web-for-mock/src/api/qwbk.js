import request from '@icccPath/utils/request';
import qs from 'qs';
import { fileDownLoad } from '@icccPath/api/common';
import { getSetting } from './../common';
let baseURL = getSetting('QZ_BKDX');
let baseBKSQ = getSetting('QZ_BKSQ');
// const mp = 'qz-bkfw';
const mp = '';

let api = {
  fileDownLoad: function(options, id) {
    return fileDownLoad({
      url: `${id}`,
      method: 'get',
      baseURL: baseBKSQ,
      ...options
    });
  },

  /**
   * 布控对象详情
   * @param {*} id
   */
  getBkdxXq: function(id) {
    return request({
      url: `${mp}/v1/bkdx/${id}`,
      method: 'get',
      baseURL: baseURL
    });
  },
  /**
   * 布控申请信息
   * @param {*} id
   */
  getSqxx(id) {
    return request({
      url: `${mp}/v1/sqxx/${id}`,
      method: 'get',
      baseURL: baseBKSQ
    });
  },
  /**
   * 预警轨迹列表
   * @param searchable 分页参数
   * @param bkdxQuery  查询参数
   */
  getYjgj(searchable, bkdxQuery) {
    return request({
      url: `${mp}/v1/yjgjs/search`,
      method: 'post',
      baseURL: baseURL,
      data: bkdxQuery
    });
  },
  /**
   * 布控日志列表
   * @param searchable 分页参数
   * @param bkdxQuery  查询参数
   */
  getControlLog(searchable, bkrzQuery) {
    return request({
      url: `${mp}/v1/bkdx-blrz/search`,
      method: 'post',
      baseURL: baseURL,
      data: bkrzQuery
    });
  },
  /**
   * 获取布控对象属性
   * @param id
   */
  getBksx(id) {
    return request({
      url: `${mp}/v1/bkdx-sx/${id}`,
      method: 'get',
      baseURL: baseURL
    });
  },
  /**
   * 获取全局对象人员信息
   * @param sfzh
   */
  getqjdxryxx(sfzh) {
    return request({
      url: `${mp}/v1/qjdx-ryxx/${sfzh}`,
      method: 'get',
      baseURL: baseURL
    });
  },

  /**
   * 获取分组名称
   * @param id
   */
  geFzmc(id) {
    return request({
      url: `${mp}/v1/qzxx?bkdxbh=${id}`,
      method: 'get',
      baseURL: baseURL
    });
  },

  /**
   * 修改分组名称
   * @param {*} id
   * @param {*} TQzxxTo
   */
  updateGroupName(id, TQzxxTo) {
    return request({
      url: `${mp}/v1/qzxx/${id}`,
      method: 'put',
      baseURL: baseURL,
      data: TQzxxTo
    });
  },
  /**
   * @description: 添加/移动到分组
   * @param {*} qzid
   * @param {*} bkdxbhs
   */
  addToFz(qzid, bkdxbhs) {
    return request({
      baseURL: baseURL,
      url: `/v1/qzxx-dx/${qzid}`,
      method: 'POST',
      data: qs.stringify({ bkdxbhs })
    });
  },
  /**
   * @description: 创建临时申请单
   */
  addStopControl(data) {
    return request({
      baseURL: baseBKSQ,
      url: `/v1/tksq`,
      method: 'POST',
      data
    });
  },
  /**
   * @description: 撤销停控申请
   */
  cancelStopControl(data) {
    return request({
      baseURL: baseBKSQ,
      url: `/v1/cx-tksq`,
      method: 'POST',
      data
    });
  }
};
export default api;
