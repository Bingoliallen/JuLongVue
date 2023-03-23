/**
 * Created by hcg on 2020/12/23.
 */

import request from '@/utils/request';
import { deepClone } from '@icccPath/utils/tool';

const CACHE_QJDX = {};

// 获取全局对象人员信息
export function getQjdxRyxx(sfzh) {
  return new Promise((resolve, reject) => {
    if (CACHE_QJDX[sfzh]) {
      return resolve(deepClone(CACHE_QJDX[sfzh]));
    }
    request({
      module: 'QZ_BKDX',
      url: `/v1/qjdx-ryxx/${sfzh}`
    })
      .then(res => {
        CACHE_QJDX[sfzh] = res;
        resolve(deepClone(res));
      })
      .catch((...arg) => {
        reject(...arg);
      });
  });
}

// 获取全局对象人员 姓名
export async function getRyxmBySfzh(sfzh) {
  const res = await getQjdxRyxx(sfzh);
  return (res && res.data && res.data.xm) || '';
}
