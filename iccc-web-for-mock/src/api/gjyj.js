/**
 * 轨迹预警
 */

import request from '@icccPath/utils/request';

// 获取轨迹信息
export function fetchTrackInfo(id, module) {
  return request({
    url: `/v1/gjxx/${id}`,
    method: 'GET',
    // 后端模块
    module,
    // 错误提示，默认提示
    tip: true
  });
}

// 轨迹预警-关注
export async function followWith(data, isFollow, module) {
  const result = request({
    url: `/v1/concern`,
    method: isFollow ? 'POST' : 'DELETE',
    // 后端模块
    module,
    data,
    // 错误提示，默认提示
    tip: true
  });

  return result;
}

// 轨迹预警-关注
export async function updateGroup(data) {
  //   const result = request({
  //     url: `/v1/sqxx/${id}`,
  //     method: 'GET',
  //     // 后端模块
  //     module,
  //     // 错误提示，默认提示
  //     tip: true
  //   });
  const result = data;

  return result;
}
