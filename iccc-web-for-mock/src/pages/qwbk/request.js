/**
 * Created by hcg on 2020/12/14.
 */
import request from '@icccPath/utils/request';
import qs from 'qs';

/**
 * 添加关注或者取消关注
 * @param concernType 关注类型
 * @param concernId 业务主键
 * @param sfgz
 */
export function concern({ concernType, concernId, sfgz }) {
  return request({
    url: '/v1/concern',
    method: sfgz ? 'POST' : 'DELETE',
    data: { concernType, concernId }
  });
}

// 查询群组列表
export function qzxxList() {
  return request({
    url: '/v1/qzxx/paging',
    method: 'POST',
    data: qs.stringify({
      page: 0,
      size: 999,
      sort: JSON.stringify({ RKSJ: 'DESC' })
    })
  });
}

export function addFz(data) {
  return request({
    module: 'QZ_BKDX',
    url: '/v1/qzxx',
    method: 'POST',
    data
  });
}

// 添加/移入分组
export function addToFz(qzid, bkdxbhs) {
  return request({
    module: 'QZ_BKDX',
    url: `/v1/qzxx-dx/${qzid}`,
    method: 'POST',
    data: qs.stringify({ bkdxbhs })
  });
}

// 申请 续控或者撤控
export function addXkOrCk(data) {
  return request({
    module: 'QZ_BKSQ',
    url: '/v1/ckxk',
    method: 'POST',
    data
  });
}

// 获取布控对象属性
export function getBkdxsx(id) {
  return request({
    module: 'QZ_BKDX',
    url: `/v1/bkdx-sx/${id}`
  });
}

// 获取分组内的所有布控对象
export function getGroupMemberAll(qzid) {
  // return request({
  //   url: `/v1/bkdx/searchAll`,
  //   method: 'POST',
  //   data: qs.stringify(data)
  // });
  const data = {
    searchCondition: JSON.stringify({ and: [{ name: 'QZID', value: qzid, op: 'in', type: '', format: '' }] }),
    page: 0,
    size: 9999
  };
  return request({
    url: '/v1/bkdx/search',
    method: 'post',
    data: qs.stringify(data)
  });
}

// 编辑分组成员
export function editGroupMember(qzid, bkdxbhs) {
  return request({
    module: 'QZ_BKDX',
    url: `/v1/qzxx-dx-rep/${qzid}`,
    method: 'POST',
    data: qs.stringify({ bkdxbhs })
  });
}

// 更新群组及成员信息； 有群组id，则修改，无则新增
export function qzdxUpdate(data) {
  return request({
    module: 'QZ_BKDX',
    url: '/v1/qzdx',
    method: 'PUT',
    data
  });
}

// 删除群组，同时删除群组对象关联关系
export function jsQz(qzid) {
  return request({
    module: 'QZ_BKDX',
    url: `/v1/qzxx/${qzid}`,
    method: 'DELETE'
  });
}
