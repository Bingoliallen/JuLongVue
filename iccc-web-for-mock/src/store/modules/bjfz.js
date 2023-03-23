/**
 * 分组编辑 用于处理分组编辑过程中，左右数据临时移动导致的缓存问题
 * @type {{mutations: {}, state: {}, getters: {}, actions: {}}}
 */
const bjfz = {
  state: {
    addList: [],
    removeList: []
  },
  mutations: {
    UPDATE_LIST(state, { addList, removeList }) {
      if (addList) {
        state.addList = addList;
      }
      if (removeList) {
        state.removeList = removeList;
      }
    }
  },
  actions: {
    addBkdx({ state, commit }, list) {
      const { addList, removeList } = state;
      list.forEach(data => {
        // 判断操作的数据是右边移入左边的，还是本属于左边的；
        // 如果是本属于左边的（index === -1），则添加到 addList；
        // 如果是右边移入左边的（index !== -1），则 removeList 去掉该条；
        const index = removeList.findIndex(e => e.bkdxbh === data.bkdxbh);
        if (index === -1) {
          addList.unshift(data);
        } else {
          removeList.splice(index, 1);
        }
      });
      commit('UPDATE_LIST', { addList, removeList });
    },
    removeBkdx({ state, commit }, list) {
      const { addList, removeList } = state;
      list.forEach(data => {
        // 判断操作的数据是左边移入右边的，还是本属于右边的；
        // 如果是本属于右边的（index === -1），则添加到 removeList；
        // 如果是左边移入右边的（index !== -1），则 addList 去掉该条；
        const index = addList.findIndex(e => e.bkdxbh === data.bkdxbh);
        if (index === -1) {
          removeList.push(data);
        } else {
          addList.splice(index, 1);
        }
      });
      commit('UPDATE_LIST', { addList, removeList });
    },
    clearBjfz({ commit }) {
      commit('UPDATE_LIST', { addList: [], removeList: [] });
    }
  },
  getters: {
    addList: state => state.addList,
    removeList: state => state.removeList
  }
};

export default bjfz;
