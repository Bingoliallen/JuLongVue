const tagsView = {
  state: {
    deleteTag: false,
    visitedViews: [],
    cachedViews: [],
    historyViews: [],
    keepAliveNames: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state, view) => {
      const viewName = view.meta && view.meta.viewName;
      const item = state.visitedViews.find(
        v => (viewName && v.meta && v.meta.viewName === viewName) || v.fullPath === view.fullPath
      );
      if (item) {
        // 已存在的替换掉，然后跳过
        Object.assign(item, view, {
          title: view.tagName || view.meta.title || 'no-name'
        });
        return;
      }
      if (state.visitedViews.some(v => v.fullPath === view.fullPath)) return;
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.tagName || view.meta.title || 'no-name'
        })
      );
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return;
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name);
      }
    },

    DEL_VISITED_VIEW: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
    },
    DEL_CACHED_VIEW: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews.splice(index, 1);
          break;
        }
      }
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.fullPath === view.fullPath) {
          state.visitedViews = state.visitedViews.slice(i, i + 1);
          break;
        }
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews = state.cachedViews.slice(index, index + 1);
          break;
        }
      }
    },
    DEL_RIGHT_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.fullPath === view.fullPath) {
          state.visitedViews = state.visitedViews.slice(0, i + 1);
          break;
        }
      }
    },
    DEL_RIGHT_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i);
          state.cachedViews = state.cachedViews.slice(0, index + 1);
          break;
        }
      }
    },

    DEL_ALL_VISITED_VIEWS: state => {
      state.visitedViews = [];
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = [];
    },

    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.fullPath === view.fullPath) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
    ADD_HISTORY_VIEW: (state, view) => {
      state.historyViews.map((v, p) => {
        if (v.fullPath === view.fullPath) {
          state.historyViews.splice(p, 1);
        }
      });
      state.historyViews.unshift(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      );
    },
    DELETE_TAG_STATUS: (state, value) => {
      state.deleteTag = value;
    },

    // 计算使用 KeepAlive 缓存的路由
    COMPUTE_KEEP_ALIVE_NAMES(state) {
      const cachedViews = new Set();
      state.visitedViews.forEach(view => {
        view.matched.forEach(router => {
          if (router.name) {
            cachedViews.add(router.name);
          }
        });
      });
      state.keepAliveNames = Array.from(cachedViews);
    }
  },
  actions: {
    addHistoryView({ commit }, view) {
      commit('ADD_HISTORY_VIEW', view);
    },
    addView({ dispatch }, view) {
      dispatch('addVisitedView', view);
      dispatch('addCachedView', view);
    },
    addVisitedView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view);
      commit('COMPUTE_KEEP_ALIVE_NAMES');
    },
    addCachedView({ commit }, view) {
      commit('ADD_CACHED_VIEW', view);
    },
    delRightViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delRightVisitedViews', view);
        dispatch('delRightCachedViews', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delRightVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_RIGHT_VISITED_VIEWS', view);
        commit('COMPUTE_KEEP_ALIVE_NAMES');
        resolve([...state.visitedViews]);
      });
    },
    delRightCachedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_RIGHT_CACHED_VIEWS', view);
        resolve([...state.cachedViews]);
      });
    },

    delView({ dispatch, state }, view) {
      return new Promise(resolve => {
        Promise.all([dispatch('delVisitedView', view), dispatch('delCachedView', view)]).then(() => {
          resolve({
            visitedViews: [...state.visitedViews],
            cachedViews: [...state.cachedViews]
          });
        });
      });
    },
    delVisitedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view);
        commit('COMPUTE_KEEP_ALIVE_NAMES');
        resolve([...state.visitedViews]);
      });
    },
    delCachedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', view);
        resolve([...state.cachedViews]);
      });
    },

    delOthersViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view);
        dispatch('delOthersCachedViews', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delOthersVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view);
        commit('COMPUTE_KEEP_ALIVE_NAMES');
        resolve([...state.visitedViews]);
      });
    },
    delOthersCachedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view);
        resolve([...state.cachedViews]);
      });
    },

    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view);
        dispatch('delAllCachedViews', view);
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        });
      });
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS');
        commit('COMPUTE_KEEP_ALIVE_NAMES');
        resolve([...state.visitedViews]);
      });
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS');
        resolve([...state.cachedViews]);
      });
    },

    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view);
    },
    updateDeleteTag({ commit }, value) {
      commit('DELETE_TAG_STATUS', value);
    }
  },
  getters: {
    visitedViews: state => state.visitedViews,
    cachedViews: state => state.cachedViews,
    historyViews: state => state.historyViews,
    deleteTag: state => state.deleteTag,
    keepAliveNames: state => state.keepAliveNames
  }
};

export default tagsView;
