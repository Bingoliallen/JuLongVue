/**
 * 用户关注
 * @Author: cyp
 * @Date: 2020-12-10
 */
import request from '@icccPath/utils/request';
import { getSetting } from '@icccPath/utils/request';
import { fileDownLoad } from '@icccPath/api/common';
import qs from 'qs';
let mp = getSetting('BASE_API');

let api = {
  _getSort: function(sortProps) {
    let sort = {};
    if (sortProps instanceof Array) {
      sortProps.forEach(e => {
        sort = { ...sort, ...e };
      });
    } else {
      sort = sortProps;
    }
    Object.entries(sort).forEach(([key, val]) => {
      if (val) {
        sort[key] = val.toUpperCase();
      }
    });
    return sort;
  },
  _getConditions: function(condition) {
    const and = [];
    // const condition = this.condition;
    condition.forEach(({ name, value, op = '=', type = '', format = '', mergerName }) => {
      // 添加有值的条件
      if (value || value === 0) {
        if (name === 'GJZ' && mergerName) {
          and.push({ or: mergerName.split(',').map(key => ({ name: key, value, op, type, format })) });
          return;
        }
        if (op === 'rangeDate' || op === 'date8Range' || op === 'date14Range') {
          const [t1, t2] = value instanceof Array ? value : value.split(',');
          if (t1) {
            and.push({ name, value: t1, op: '>=', type, format });
          }
          if (t2) {
            and.push({ name, value: t2, op: '<=', type, format });
          }
          return;
        }

        and.push({ name, value, op, type, format });
      }
    });

    return and.length > 0 ? { and } : {};
  },

  toResultExport: function(url, sort, metadata, searchCondition, total, options) {
    const data =
      total > 0
        ? {
            sort: JSON.stringify(this._getSort(sort)),
            metadata: JSON.stringify(metadata),
            searchCondition: JSON.stringify(this._getConditions(searchCondition)),
            size: total
          }
        : {
            sort: JSON.stringify(sort),
            metadata: JSON.stringify(metadata),
            searchCondition: JSON.stringify(searchCondition)
          };
    return fileDownLoad({
      url: url,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      baseURL: mp,
      data: qs.stringify(data),
      ...options
    });
  },
  /**
   * 添加关注或者取消关注
   * @param data
   * @param module
   */
  concern: function(data) {
    return request({
      url: '/v1/concern',
      method: data.sfgz ? 'POST' : 'DELETE',
      data: {
        concernType: data.concernType,
        concernId: data.concernId
      },
      baseURL: mp
    });
  },
  /**
   * 获取对应关注类型的业务主键
   * @param concernType String
   * concernType
   * @param senceId String
   * 场景id
   */
  load: function(concernType, senceId) {
    return request({
      url: `/v1/concern/${concernType}/${senceId}`,
      method: 'get',
      baseURL: mp,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  },
  /**
   * 重点人详情
   * @param id String
   * 		id
   */
  loadZdrDetail: function(id) {
    return request({
      url: `/v1/zdry/${id}`,
      method: 'get',
      baseURL: mp,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  }
};
export default api;
