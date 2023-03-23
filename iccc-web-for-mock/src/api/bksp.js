/**
 * 布控审批
 * huangjq
 * 2020/12/10
 */

import request from '@icccPath/utils/request';
import BaseApi from '@srcPath/api/jz-base';

// 布控审批详情
export function queryApplyInfo(id, module) {
  return request({
    url: `/v1/sqxx/${id}`,
    method: 'GET',
    // 后端模块
    module,
    // 错误提示，默认提示
    tip: true
  });
}

// 布控审批->详情->审批
export function spxxApprove(data = { sqIdList: '', spxx: { spjl: '', spyj: '' } }, module) {
  return request({
    url: `v1/spxx-approve`,
    method: 'POST',
    data,
    // 后端模块
    module,
    // 错误提示，默认提示
    tip: true
  });
}

// 布控审批详情->布控对象->对象身份证、人像、关联属性统计
export function querySqdxStatistics(id, searchable, module) {
  return request({
    url: `v1/sqdx-statistics/${id}/sfz-rxbk-glsx`,
    method: 'POST',
    data:searchable,
    // 后端模块
    module,
    // 错误提示，默认提示
    tip: true
  });
}
  // /**
  //  * 新增页面对象身份证、人像、关联属性统计
  //  * @param id String
  //  * 		id
  //  */
  // sfzrxbkglsx: function(id) {
  //   return request({
  //     url: `/v1/sqdx-statistics/${id}/sfz-rxbk-glsx`,
  //     method: 'get',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //       appVersion: '1.0.0',
  //       framework: 'qb'
  //     },
  //     baseURL: mpbkdx
  //   });
  // },

// 布控审批流转列表
export function queryFlowInfo(data, module) {
  return BaseApi.reqTableData(`/v1/lzxx/search`, data, module);
}

