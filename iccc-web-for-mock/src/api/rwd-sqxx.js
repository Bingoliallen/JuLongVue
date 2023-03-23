/**
 * 任务单：申请信息
 * @Author: libb
 * @Date: 2020-12-10
 * @Project iccc-web123
 */

import request from '@icccPath/utils/request';
import qs from 'qs';
import { getSetting } from './../common';
let mp = getSetting('QZ_BKSQ');
let mpbkdx = getSetting('QZ_BKDX');
let mpnzdr = getSetting('BASE_API');
let api = {
  /**
   * 修改申请单(草稿/提交/修改名称)√
   * @param id String
   * 		id
   * @param sqxx SqxxEditTO
   * 		申请信息
   */
  sqxxupdate: function(id, sqxx) {
    return request({
      url: `/v1/sqxx/${id}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: sqxx
    });
  },
  /**
   * 申请单详情√
   * @param id String
   * 		申请ID
   */
  load: function(id) {
    return request({
      url: `/v1/sqxx/${id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp
    });
  },

  /**
   * 获取申请单统计信息X
   * @param id String
   * 		id
   */
  loadStat: function(id) {
    return request({
      url: `/v1/sqxx-stat/${id}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify({})
    });
  },

  /**
   * 新增页面对象可用、异常统计
   * @param id String
   * 		id
   */
  availableException: function(id) {
    return request({
      url: `/v1/sqdx-statistics/${id}/available-exception`,
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp
    });
  },

  /**
   * 新增页面对象身份证、人像、关联属性统计
   * @param id String
   * 		id
   */
  sfzrxbkglsx: function(id, searchable) {
    // let searchCondition={searchCondition:searchable};
    return request({
      url: `/v1/sqdx-statistics/${id}/sfz-rxbk-glsx`,
      method: 'post',
      headers: {
          //  'Content-Type': 'application/json;charset=UTF-8',
      //  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mpnzdr,
      data: searchable
    });
  },

  /**
   * 申请信息（任务单）列表√-
   * @param searchable Searchable
   * 		分页参数
   * @param sqxxQuery SqxxTO
   * 		查询参数
   */
  sqxxpaging: function(searchable, sqxxQuery) {
    return request({
      url: `/v1/sqxx/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: sqxxQuery
    });
  },

  /**
   * 审批信息列表
   */
  spxxpaging: function() {
    return request({
      url: `/v1/spxx/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify({})
    });
  },
  /**
   * 对象布控日志,群组布控日志列表
   */
  bkrzpaging: function() {
    return request({
      url: `/v1/bkrz/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify({})
    });
  },

  /**
   * 申请任务单里的布控对象列表
   */
  sqdxpaging: function() {
    return request({
      url: `/v1/sqdx/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify({})
    });
  },

  /**
   * 流转信息列表
   */
  lzxxpaging: function(data) {
    return request({
      url: `/v1/lzxx/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify(data)
    });
  },

  /**
   * 布控申请轨迹对象列表
   */
  bksqgjdx: function() {
    return request({
      url: `/v1/bksq-gjdx/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: qs.stringify({})
    });
  },

  /**
   * 群组-对象布控日志列表
   */
  bkdxblrz: function(data) {
    return request({
      url: `/v1/bkdx-blrz/search`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mpbkdx,
      data: qs.stringify(data)
    });
  },

  /**
   * 审批√
   * @param sqIdList String
   * 		申请Id，多个用逗号隔开
   * @param spxx SpxxTO
   * 		审批信息
   */
  approve: function(sqIdList, spxx) {
    let submitData = {};
    submitData.sqIdList = sqIdList;
    submitData.spxx = spxx;
    return request({
      url: `/v1/spxx-approve`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: submitData
    });
  },

  /**
   * 撤回申请√
   * @param ids String
   * 		申请ID，多个逗号隔开
   */
  withdraw: function(ids) {
    return request({
      url: `/v1/sqxx-sqzt`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        appVersion: '1.0.0',
        framework: 'qb'
      },
      baseURL: mp,
      data: ids
    });
  }
};
export default api;
