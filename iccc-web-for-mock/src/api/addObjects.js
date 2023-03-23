/*
 * @Author: Liugh
 * @Date: 2020-10-28 09:28:47
 * @LastEditTime: 2020-12-11 10:04:58
 * @LastEditors: Do not edit
 * @Description:新增对象API
 */

import request from '@icccPath/utils/request';

export function sceneLoad(id) {
  return request({
    url: `/v1/scene/release/load/${id}`,
    method: 'get'
  });
}
