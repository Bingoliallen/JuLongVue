/**
 * 防控圈 接口
 * Created by hcg on 2020/12/10.
 */
import request from '@icccPath/utils/request';
import { base64ToBlob } from '@icccPath/utils/tool';

const module = 'QZ_FKQ';
// 缓存防控圈预览图, {key: zpid, value: base64Data}
const FKQ_PREVIEW_CACHE = {};

// 新增/编辑 防控圈
export function addOrEditControlCircle(data) {
  return request({
    url: `/v1/fkq${data.id ? '/' + data.id : ''}`,
    method: data.id ? 'PUT' : 'POST',
    data,
    // 后端模块
    module
  });
}

// 删除 防控圈
export function deleteControlCircle(id) {
  return request({
    url: `/v1/fkq/${id}`,
    method: 'DELETE',
    // 后端模块
    module
  });
}

// 获取防控圈详情
export function getControlCircleDetail(id) {
  return request({
    url: `/v1/fkq/${id}`,
    // 后端模块
    module
  });
}

// 获取防控圈行政区划
export function getFkqXzqh(xzqhbm) {
  return request({
    url: `/v1/fkq-xzqh/${xzqhbm}`,
    module
  });
}

/**
 * 保存预览图
 * @param base64Data
 * @return {Promise<*>} zpid
 */
export async function saveImg(base64Data) {
  const file = new File([base64ToBlob(base64Data)], '防控圈预览图.jpg');
  const data = new FormData();
  data.append('file', file);
  const res = await request({
    module,
    url: '/api/file/upload',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  });
  const zpid = res.data.id;
  // 保存到缓存里面
  FKQ_PREVIEW_CACHE[zpid] = base64Data;
  return zpid;
}

/**
 * 获取预览图，返回 base64
 * @param zpid
 * @return {Promise<any>} base64Data
 */
export function getImg(zpid) {
  return new Promise(async resolve => {
    // 先从缓存取
    const cache = FKQ_PREVIEW_CACHE[zpid];
    if (cache) {
      resolve(cache);
      return;
    }
    const arrayBuffer = await request({
      module,
      url: `/api/file/view/${zpid}`,
      responseType: 'arraybuffer'
    });
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      function() {
        const cache = this.result;
        resolve(cache);
        // 保存到缓存里面
        FKQ_PREVIEW_CACHE[zpid] = cache;
      },
      false
    );
    reader.readAsDataURL(blob);
  });
}
