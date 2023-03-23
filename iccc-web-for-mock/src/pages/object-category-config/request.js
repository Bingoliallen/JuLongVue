import request from '@icccPath/utils/request';
const module = 'QZ_BKDX';

export async function getTreeData(ph = '') {
  const res = await request({
    url: `/v1/rylb`,
    module,
    params: { ph }
  });
  if (res && res.data) {
    return res.data.map(e => ({ id: 'id-' + e.bh, ...e }));
  }
  return [];
}

// 获取所有的父节点
export function getAllParent(bh) {
  return request({
    url: `/v1/rylb_ph/${bh}`,
    module
  });
}

// 获取详情
export function getDetail(bh = '') {
  return request({
    url: `/v1/rylb/?bh=${bh}`,
    module
  });
}

// 修改
export function updateDetail(bh = '', rylbTO) {
  return request({
    url: `/v1/rylb/${bh}`,
    method: 'put',
    data: rylbTO,
    module
  });
}

// 新增人员类别

export function addCategory(rylbTo) {
  return request({
    url: `/v1/rylb`,
    method: 'POST',
    data: rylbTo,
    module
  });
}

// 修改启用状态

export function modifyEnabled(bh, qyzt) {
  return request({
    url: `/v1/rylb_qyzt/${bh}`,
    method: 'put',
    params: { qyzt },
    module
  });
}

// 关键词查询人员类别
export function queryKeywordCategory(key) {
  return request({
    url: `/v1/rylb_key`,
    params: { key },
    module
  });
}

// 获取新的子节点编号
export function getNewNodeNumber(ph) {
  return request({
    url: `/v1/rylb_bh/${ph}`,
    module
  });
}
