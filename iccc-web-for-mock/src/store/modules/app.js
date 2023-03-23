import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
  state: {
    language: Cookies.get('language') || 'en',
    size: Cookies.get('size') || 'medium',
    limitWidth: false,
    loading: false,
    fileUploading: 0,
    keepAliveList: []
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set('language', language);
    },
    SET_SIZE: (state, size) => {
      state.size = size;
      Cookies.set('size', size);
    },
    SET_LIMIT_WIDTH(state, flag) {
      state.limitWidth = flag;
    },
    SET_LOADING(state, value) {
      Vue.nextTick(() => {
        state.loading = value;
      });
    },
    SET_FILE_UP_LOADING(state, value) {
      state.fileUploading = value < 0 ? 0 : value;
    },
    SET_KEEP_ALIVE(state, value) {
      state.keepAliveList = value;
    }
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size);
    },
    changeLimitWidth({ commit }, flag) {
      commit('SET_LIMIT_WIDTH', flag);
    },
    setLoading({ commit }, value) {
      commit('SET_LOADING', value);
    },
    setFileUploading({ commit }, value) {
      commit('SET_FILE_UP_LOADING', value);
    },
    setKeepAlive({ commit }, value) {
      commit('SET_KEEP_ALIVE', value);
    }
  },
  getters: {
    size: state => state.size,
    device: state => state.device,
    limitWidth: state => state.limitWidth,
    loading: state => state.loading,
    fileUploading: state => state.fileUploading > 0,
    keepAliveList: state => state.keepAliveList
  }
};

export default app;
