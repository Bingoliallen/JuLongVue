/**
 * Created by hcg on 2021/3/12.
 */

import request from '@icccPath/utils/request';

class Listens {
  listens = {};
  on(type, fn) {
    const list = this.listens[type] || [];
    list.push(fn);
    this.listens[type] = list;
    return this;
  }
  off(type, fn) {
    if (fn) {
      const list = this.listens[type];
      const index = list.indexOf(fn);
      if (index !== -1) {
        list.splice(index, 1);
      }
    } else {
      delete this.listens[type];
    }
    return this;
  }
  trigger(type, ...arg) {
    const list = this.listens[type];
    list &&
      list.forEach(fn => {
        fn(...arg);
      });
    return this;
  }
}

export class Zpfw {
  dataCache = {};
  listens = new Listens();
  tempIdNoList = [];
  loading = false;
  time;
  // 按次序获取，不并发
  inOrder;
  wait;
  batchSize;
  // 默认每满10个身份证发一次请求，或者 1s 内至少发送一次请求
  constructor(wait = 1000, batchSize = 10, inOrder = true) {
    this.wait = wait;
    this.batchSize = batchSize;
    this.inOrder = inOrder;
  }
  async get(idNo) {
    // 如果已经缓存的，直接返回
    let result = this.dataCache[idNo];
    if (result) {
      return result;
    }
    result = await this.getByIdNo(idNo);
    return result;
  }
  async getByIdNo(idNo) {
    return await new Promise(async (resolve, reject) => {
      // 添加事件
      this.listens.on(idNo, result => {
        if (result) {
          resolve(result);
        } else {
          reject();
        }
        this.listens.off(idNo);
      });
      // 已添加到待获取列表，跳过
      if (this.tempIdNoList.includes(idNo)) {
        return;
      }
      this.tempIdNoList.push(idNo);
      // 正在加载中，跳过
      if (this.inOrder && this.loading) {
        return;
      }
      this.debounce();
    });
  }
  debounce() {
    clearTimeout(this.time);
    // 判断是否达到指定条数，如果没有达到就启用计时器
    if (this.tempIdNoList.length < this.batchSize) {
      this.time = setTimeout(() => {
        clearTimeout(this.time);
        this.getFromServer();
      }, this.wait);
    } else {
      // 达到指定条数，调用接口获取数据
      this.getFromServer();
    }
  }
  async getFromServer() {
    const list = this.tempIdNoList.splice(0, this.batchSize);
    if (list.length <= 0) {
      // 表示已经全部获取完成
      return;
    }
    this.loading = true;
    const objIds = list.join(',');
    const res = await request({
      url: `/zpfw/showZpBatch?objId=${objIds}`,
      module: 'NOAH_ARK',
      passWrap: true
    });
    this.loading = false;
    if (res.data) {
      Object.entries(res.data).forEach(([idNo, result]) => {
        // 缓存
        this.dataCache[idNo] = result;
        // 触发事件
        this.listens.trigger(idNo, result);
      });
    }
    // 下面这个 return 用于释放递归调用
    return this.debounce();
  }
}

// 导出固定的一个，全部走这个对象
export default new Zpfw();
