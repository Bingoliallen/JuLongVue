/*
 * @Author: Liugh
 * @Date: 2020-10-28 09:28:47
 * @LastEditTime: 2021-03-12 15:40:47
 * @LastEditors: Do not edit
 * @Description:新增对象API
 */

import request from '@icccPath/utils/request';
import { getSetting } from '@icccPath/utils/request';
// import DataOp from '@srcPath/utils/zt-data';
import qs from 'qs';
let QZ_BKSQ = getSetting('QZ_BKSQ');
let QZ_YJFW = getSetting('QZ_YJFW');
let api = {
  // 获取获取添加临时id
  getTempId(bklx) {
    return request({
      url: `/v1/sqxx`,
      method: 'POST',
      data: { bklx: bklx },
      baseURL: QZ_BKSQ
    });
  },
  // 添加单个布控对象
  addBkdx(sqxxDx) {
    return request({
      url: `/v1/sqdx`,
      method: 'POST',
      data: sqxxDx,
      baseURL: QZ_BKSQ,
      tip: false
    });
  },
  /**
   * 列表
   * @param searchable Searchable
   * 		分页参数
   * @param sqxxDxQuery SqxxDxQueryTO
   * 		查询参数
   */
  paging(vo) {
    return request({
      url: '/v1/sqdx/search',
      method: 'post',
      data: qs.stringify(vo)
    });
  },
  /**
   * 修改√
   * @param id String
   * 		id
   * @param sqxxDx SqxxdxEditTo
   * 		申请对象
   */
  sqdxupdate(id, sqxxDx) {
    return request({
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      url: `/v1/sqdx/${id}`,
      method: 'put',
      baseURL: QZ_BKSQ,
      data: sqxxDx
    });
  },

  /**
   * 详情√
   * @param id String
   * 		申请ID
   */
  load(id) {
    return request.get(`/v1/sqxx/${id}`, {
      baseURL: QZ_BKSQ
    });
  },

  /**
   * 修改(草稿/提交/修改名称)√
   * @param id String
   * 		id
   * @param sqxx SqxxEditTO
   * 		申请信息
   */
  sqxxupdate: function(id, sqxx) {
    return request.put(`/v1/sqxx/${id}`, sqxx, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      baseURL: QZ_BKSQ
    });
  },

  /**
   * 删除√
   * @param id String
   * 		主键/申请对象ID
   */
  del(id) {
    return request({
      url: `/v1/sqdx/${id}`,
      method: 'delete',
      baseURL: QZ_BKSQ
    });
  },

  /**
   * 新增预警规则
   * @param yjgzConfigTo YjgzConfigTo
   * 		预警规则配置信息
   */
  yjgzAdd: function(yjgzConfigTo) {
    return request.post(`/v1/yjgz`, yjgzConfigTo, {
      baseURL: QZ_YJFW
    });
  },
  yjgzAddOrUpdate(data) {
    return request({
      url: `/v1/yjgz` + (data.gzid ? '/' + data.gzid : ''),
      method: data.gzid ? 'PUT' : 'POST',
      data,
      baseURL: QZ_YJFW
    });
  },
  yjgzDetail(gzid) {
    return request({
      url: `/v1/yjgz/${gzid}`,
      baseURL: QZ_YJFW
    });
  },
  /**
   * 新增页面对象可用、异常统计
   * @param id String
   */
  availableExceptionStatistics(id) {
    return request.get(`/v1/sqdx-statistics/${id}/available-exception`);
  },
  /**
   * @description: 获取照片
   * @param {*} id
   */
  getImg(id) {
    return request.get(`/api/file/view/${id}`);
  },
  /**
   * 添加
   * @param sqdxInport SqdxImportTO
   * 		申请对象导入To
   */
  importSqdx(sqdxInport) {
    return request.post(`/v1/sqdx-import`, sqdxInport, {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      baseURL: QZ_BKSQ
    });
  },
  /**
   * 下载导入失败对象
   * @param id String
   * 		申请ID
   */
  downloadError(id) {
    return request.get(`/v1/sqdx-import/${id}/error`, {
      baseURL: QZ_BKSQ,
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    });
  },
  /**
   * 停止导入轮询
   * @param sqid String  申请ID
   */
  deleteImport(sqid) {
    return request.delete(`/v1/sqdx-import/${sqid}`, { baseURL: QZ_BKSQ });
  },
  /**
   * @description:预计规则信息
   */
  yjgzInfo(id) {
    return request.get(`/v1/yjgz/${id}`, { baseURL: QZ_YJFW });
  },
  /**
   * 下载导入模板文件(单独标签页)
   */
  downloadTemp() {
    return request.get(`/v1/sqdx-import/temp-download`, {
      baseURL: QZ_BKSQ,
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob'
    });
  },

  /**
   * 导入统计X-移到应用-统计-新增页面对象可用、异常统计
   * @param id String  申请ID
   */
  loadStat(id) {
    return request.get(`/v1/sqdx-import-stat/${id}`, { baseURL: QZ_BKSQ });
  },
  /**
   * @description: 获取布控范围
   * @param {*} bkfwlx
   */
  getBkfw(bkfwlx) {
    return request.get(`/v1/bkfw${bkfwlx ? '/' + bkfwlx : ''}`, {
      baseURL: QZ_BKSQ
    });
  },
  /**
   * @description: 清空导入的异常数据
   * @param id String 申请ID
   */
  deleteImportErr(id) {
    return request.delete(`/v1/sqdx-import/error-data/${id}`, {
      baseURL: QZ_BKSQ
    });
  }
};
export default api;
