import DataOp from '@srcPath/utils/zt-data';
import tools  from '@icccPath/utils/tool';

const codeDict = {
  state: {
    // 是否加载 0：未加载，1：加载完成，2：加载中
    loaded: {},
    // 缓存的表码对象，{表码值：表码文本}
    dictList: {},
    // 缓存的订阅加载对象
    subscribe: []
  },
  mutations: {
    SET_DICT: (state, { list, codeId }) => {
      state.dictList[codeId] = list;
    },
    SET_LOADING: (state, { codeId, status }) => {
      // status 0：加载失败，1：加载完成，2：加载中，其余：未加载
      state.loaded[codeId] = status;
    }
  },
  actions: {
    /**
     * 获取表码列表
     * @param {Object} state 状态值
     * @param {Function} commit 更新 mutations
     * @param {String} codeId 表码ID
     * @return {Promise<any>} 表码列表 [{label: '表码文本', value: '表码值'}...]
     */
    getBmList({ state, commit }, { codeId, module }) {
      return new Promise((resolve, reject) => {
        // 加载状态
        const loadStatus = state.loaded[codeId];
        // 1 表示加载完成，可以直接返回
        if (loadStatus === 1) {
          resolve(tools.deepClone(state.dictList[codeId]));
          return;
        }
        // 添加到订阅事件
        let subscribe = state.subscribe[codeId];
        if (!subscribe) {
          subscribe = state.subscribe[codeId] = [];
        }
        subscribe.push({ resolve, reject });
        // 2 表示正在加载，等待订阅事件处理完成
        if (loadStatus === 2) {
          return;
        }
        commit('SET_LOADING', { codeId, status: 2 });
        DataOp.getCodeArr({
          code:codeId,
          module
        }, (list)=>{
          commit('SET_DICT', { list, codeId });
            commit('SET_LOADING', { codeId, status: 1 });
            subscribe.forEach(({ resolve }) => {
              resolve(tools.deepClone(list));
            });
            // 清空订阅对象
            delete state.subscribe[codeId];
        }, e=>{
          commit('SET_LOADING', { codeId, status: 0 });
            subscribe.forEach(({ reject }) => {
              reject(e);
            });
            delete state.subscribe[codeId];
        });
      });
    },
    async getBm({ dispatch }, codeId, module) {
      const obj = {};
      const list = await dispatch('getBmList', codeId, module);
      list.forEach(({ label, value }) => {
        obj[value] = label;
      });
      return obj;
    },
    async getBmMc({ dispatch }, { codeId, key, module }) {
      // 先从这里面取，可能有优化空间
      const list = await dispatch('getBmList', { codeId, module });
      const data = list.find(e => e.value === key);
      return (data && data.label) || key;
    }
  },
  getters: {
    dictList: state => state.dictList,
    translate: state => {
      // 翻译表码的方法，但是必须先确保表码已经加载过了。
      return (codeId, key) => {
        const data = state.dictList[codeId].find(e => e.value === key);
        return (data && data.label) || key;
      };
    }
  }
};
export default codeDict;
