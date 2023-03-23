const addObjStatus = {
  state: {
    stepActive: 0,
    editShow: false, // 是否为新增编辑的状态(添加对象的编辑)
    editObject: {}, // 正在编辑的对象
    isNext: false, // 是否可以进行下一步
    provisionalId: '', // 添加对象的临时id
    // stepOneFlag: false,
    // stepTwoFlag: false,
    // stepThreeFlag: false,
    addListObj: {
      totalList: [],
      objPassList: [],
      objErrList: []
    },
    componentModelBackUps: null, // 存储表单的数据
    searchCallBack: null
  },
  mutations: {
    SET_STEP_ACTIVE: (state, val) => {
      state.stepActive = val;
    },
    SET_EDIT_SHOW: (state, flag) => {
      state.editShow = flag;
    },
    SET_EDIT_OBJECT: (state, val) => {
      state.editObject = val;
    },
    SET_IS_NEXT: (state, flag) => {
      state.isNext = flag;
    },
    SET_PROVISIONAL_ID: (state, val) => {
      state.provisionalId = val;
    },
    // SET_STEP_ONE_FLAG: (state, flag) => {
    //   state.stepOneFlag = flag;
    // },
    // SET_STEP_TWO_FLAG: (state, flag) => {
    //   state.stepTwoFlag = flag;
    // },
    // SET_STEP_THREE_FLAG: (state, flag) => {
    //   state.stepThreeFlag = flag;
    // },
    SET_ADD_LIST_OBJ: (state, { name, list }) => {
      state.addListObj[name] = list;
    },
    SET_COMPONENT_MODEL_BACKUPS: (state, val) => {
      state.componentModelBackUps = val;
    },
    SET_SEARCH_CALLBACK: (state, val) => {
      state.searchCallBack = val;
    }
  },
  actions: {
    SBM_STEP_ACTIVE: (state, val) => {
      state.commit('SET_STEP_ACTIVE', val);
    },
    SBM_EDIT_SHOW: (state, flag) => {
      state.commit('SET_EDIT_SHOW', flag);
    },
    SBM_EDIT_OBJECT: (state, val) => {
      state.commit('SET_EDIT_OBJECT', val);
    },
    SBM_IS_NEXT: (state, flag) => {
      state.commit('SET_IS_NEXT', flag);
    },
    SBM_PROVISIONAL_ID: (state, val) => {
      state.commit('SET_PROVISIONAL_ID', val);
    },
    // SBM_STEP_ONE_FLAG: (state, flag) => {
    //   state.commit('SET_STEP_ONE_FLAG', flag);
    // },
    // SBM_STEP_TWO_FLAG: (state, flag) => {
    //   state.commit('SET_STEP_TWO_FLAG', flag);
    // },
    // SBM_STEP_THREE_FLAG: (state, flag) => {
    //   state.commit('SET_STEP_THREE_FLAG', flag);
    // },
    SBM_ADD_LIST_OBJ: (state, { name, list }) => {
      state.commit('SET_ADD_LIST_OBJ', { name, list });
    },
    SBM_COMPONENT_MODEL_BACKUPS: (state, val) => {
      state.commit('SET_COMPONENT_MODEL_BACKUPS', val);
    }
  },
  getters: {
    stepActive: state => state.stepActive,
    editShow: state => state.editShow,
    editObject: state => state.editObject,
    isNext: state => state.isNext,
    provisionalId: state => state.provisionalId,
    // stepOneFlag: state => state.stepOneFlag,
    // stepTwoFlag: state => state.stepTwoFlag,
    // stepThreeFlag: state => state.stepThreeFlag,
    addListObj: state => state.addListObj,
    componentModelBackUps: state => state.componentModelBackUps,
    searchCallBack: state => state.searchCallBack,
  }
};

export default addObjStatus;
