import IcccFzSelect from './../components/iccc-fz-select';
/**
 * 常量
 * Created by hecg on 2020-06-18.
 */
const module = 'BASE_API';
/**
 * 后端接口模块
 * @type {string}
 */
export const MODULE = module;
/**
 * 表码-布控对象(全部)
 * @type {string}
 */
export const BM_QWBK_BKDX = 'BM_BKDX_HMLX';
/**
 * 表码-布控状态
 * @type {string}
 */
export const BM_QWBK_BKZT = 'BM_BKDX_BKZT';
/**
 * 表码-布控类别
 * @type {string}
 */
export const BM_BKSQ_BKLB = 'BM_BKSQ_BKLB';
/**
 * 表码-布控级别
 * @type {string}
 */
export const BM_QWBK_BKJB = 'BM_QWBK_BKJB';

/**
 * 表码-审批状态
 * @type {string}
 */
export const BM_QWBK_SPZT = 'BM_QWBK_SPZT';

/**
 * 表码-关系对象
 * @type {string}
 */
export const BM_QWBK_GXDX = 'BM_QWBK_GXDX';

/**
 * 表码-轨迹来源
 * @type {string}
 */
export const BM_QWBK_GJLY = 'BM_QWBK_GJLY';

/**
 * 表码-单位
 * @type {string}
 */
export const VW_BM_DEPT = 'VW_BM_DEPT';

/**
 * 表码-防控圈类型
 * @type {string}
 */
export const BM_QZFKQ_LX = 'BM_QZFKQ_LX';
/**
 * 表码-防控圈形状
 * @type {string}
 */
export const BM_QZFKQ_XZ = 'BM_QZFKQ_XZ';
/**
 * 表码-防控圈行政区划
 * @type {string}
 */
export const BM_QZFKQ_XZQH = 'BM_QZFKQ_XZQH';
/**
 * 表码-防控圈使用范围
 * @type {string}
 */
export const BM_QZFKQ_SYFW = 'BM_QZFKQ_SYFW';
/**
 * 表码-停控原因
 * @type {string}
 */
export const BM_BKSQ_TKYY = 'BM_BKSQ_TKYY';
/**
 * 表码-停控状态
 * @type {string}
 */
export const BM_BKSQ_TKZT = 'BM_BKSQ_TKZT';

export const TIME_PICK_BTNS = [
  { text: '不限', time: [] },
  { text: '近一天', time: ['0d', '0d'] },
  { text: '近三天', time: ['-2d', '0d'] },
  { text: '近一周', time: ['-6d', '0d'] }
];

/**
 * 搜索条件 - 布控对象
 * @type {*[]}
 */
export const CONDITIONS_BKDX = [
  {
    label: '申请时间',
    name: 'SQSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMdd',
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '布控状态',
    name: 'BKZT',
    value: '20,21',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: BM_QWBK_BKZT,
      module
    }
  },
  {
    label: '布控级别',
    name: 'BKJB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_BKJB',
      module
    }
  },
  {
    label: '布控类别',
    name: 'BKLB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      code: 'BM_BKSQ_BKLB',
      module,
      multiple: true,
      clearable: true,
      filterable: true,
      'lazy-load': false,
      'collapse-tags': true,
      'check-strictly': true,
      props: {
        value: 'value'
      },
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '布控对象',
    name: 'HMLXZH',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      multiple: true,
      filterable: true,
      clearable: true,
      // 'check-leaf': true,
      // 'check-strictly': true,
      'collapse-tags': true,
      'lazy-load': false,
      props: {
        value: 'value'
      },
      is: 'dg-tree-drop',
      class: 'u-lable-btn is-no-border',
      code: BM_QWBK_BKDX,
      module
    }
  },
  {
    label: '所属分组',
    name: 'QZID',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      multiple: true,
      'collapse-tags': true,
      is: IcccFzSelect
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'HMNR,XM',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入布控号码、姓名查询', clearable: true }
  }
];

export const CONDITIONS_FZ_BKDX = (() => {
  return CONDITIONS_BKDX.map(e => {
    if (e.name === 'BKZT') {
      return { ...e, value: '' };
    }
    if (e.name === 'QZID') {
      return false;
    }
    return { ...e };
  }).filter(e => e);
})();

/**
 * 搜索条件 - 分组
 * @type {*[]}
 */
export const CONDITIONS_BKDXFZ = [
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'QZMC',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入群组名称查询', clearable: true }
  }
];

/**
 * 搜索条件 - 任务单
 * @type {Array}
 */
export const CONDITIONS_RWD = [
  {
    label: '申请时间',
    name: 'SQSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '申请状态',
    name: 'SQDZT',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      'is-lace': true,
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_SQDZT_NEW',
      module
    }
  },
  {
    label: '布控级别',
    name: 'BKJB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_BKJB',
      module
    }
  },
  {
    label: '布控类型',
    name: 'BKLX',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_BKLX',
      module
    }
  },
  {
    label: '布控对象',
    name: 'HMLXS',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      multiple: true,
      filterable: true,
      clearable: true,
      // 'check-leaf': true,
      // 'check-strictly': true,
      'collapse-tags': true,
      'lazy-load': false,
      props: {
        value: 'value'
      },
      is: 'dg-tree-drop',
      class: 'u-lable-btn is-no-border',
      code: BM_QWBK_BKDX,
      module
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'SQMC,DXHM',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入申请单名称、布控号码查询' }
  }
];
/**
 * 搜索条件 - 预警
 * @type {Array}
 */
export const CONDITIONS_WARNING = [];
/**
 * 搜索条件 - 成员
 * @type {Array}
 */
export const CONDITIONS_MEMBER = [
  {
    label: '布控时间',
    name: 'BKKSRQ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '布控状态',
    name: 'BKZT',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: BM_QWBK_BKZT,
      module,
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '布控类别',
    name: 'BKLB',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      code: 'BM_BKSQ_BKLB',
      module,
      clearable: true,
      filterable: true,
      'lazy-load': false,
      'collapse-tags': true,
      'check-strictly': true,
      props: {
        value: 'value'
      },
      style: {
        width: '100%'
      }
    }
  },

  {
    label: '布控对象',
    name: 'HMLX',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      filterable: true,
      clearable: true,
      'check-leaf': true,
      'check-strictly': true,
      'lazy-load': false,
      props: {
        value: 'value'
      },
      is: 'dg-tree-drop',
      class: 'u-lable-btn is-no-border',
      code: BM_QWBK_BKDX,
      module
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    value: '',
    op: 'like',
    type: '',
    mergerName: 'HMNR,XM',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入布控号码、姓名查询' }
  }
];

/**
 * 搜索条件 - 审批
 * @type {Array}
 */
export const CONDITIONS_SPBKDX = [
  {
    label: '申请时间',
    name: 'SQSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '审批状态',
    name: 'SQZT',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      'is-lace': true,
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_SQZT'
    }
  },
  {
    label: '布控级别',
    name: 'BKJB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      'is-lace': true,
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_BKJB'
    }
  },
  {
    label: '申请类型',
    name: 'BKLX',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-checkbox-group',
      class: '',
      type: '',
      row: true,
      'check-all': true,
      'check-all-text': '不限',
      code: 'BM_BKSQ_BKLX',
      module
    }
  },
  {
    label: '布控类别',
    name: 'BKLB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      code: 'BM_BKSQ_BKLB',
      module,
      multiple: true,
      clearable: true,
      filterable: true,
      'lazy-load': false,
      'collapse-tags': true,
      'check-strictly': true,
      props: {
        value: 'value'
      },
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '布控对象',
    name: 'HMLXS',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      multiple: true,
      filterable: true,
      clearable: true,
      // 'check-leaf': true,
      // 'check-strictly': true,
      'collapse-tags': true,
      'lazy-load': false,
      props: {
        value: 'value'
      },
      is: 'dg-tree-drop',
      class: 'u-lable-btn is-no-border',
      code: BM_QWBK_BKDX,
      module
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'SQMC',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入任务名称查询' }
  }
];
/**
 * 搜索条件 - 停控审批
 * @type {Array}
 */
export const CONDITIONS_SPTKDX = [
  {
    label: '申请时间',
    name: 'SQSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '申请类型',
    name: 'BKLX',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_BKSQ_BKLX_ZDR',
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '申请单状态',
    name: 'SQDZT',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_BKSQ_SQDZT_NEW',
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'SQRXM',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入申请人姓名查询' }
  }
];
/**
 * 搜索条件 - 重点人员
 * @type {Array}
 */
export const CONDITIONS_ZDRY = [
  {
    label: '变更时间',
    name: 'JLBGSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '状态',
    name: 'YXX',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_ZDRYXX',
      module,
      'custom-data': [{ value: '', label: '不限' }]
    }
  },

  {
    label: '停控状态',
    name: 'TKZT',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_BKSQ_TKZT',
      module,
      'custom-data': [
        {
          value: '',
          label: '不限'
        }
      ]
    }
  },

  {
    label: '民族',
    name: 'MZ',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-select',
      code: 'BM_MZ0000',
      module,
      clearable: true
    }
  },
  {
    label: '人员类型',
    name: 'ZDRYXL',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': false,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'collapse-tags': true,
      clearable: true,
      placeholder: '请选择人员类型',
      props: {
        value: 'value'
      },
      code: 'BM_RY_RYXL',
      module,
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '户籍地',
    name: 'HJDQH',
    value: '',
    op: 'dmsm2',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': true,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'collapse-tags': true,
      clearable: true,
      placeholder: '请选择户籍地',
      props: {
        value: 'value'
      },
      code: 'BM_BZ_XZQH_JC',
      module,
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '居住地',
    name: 'XZDQH',
    value: '',
    op: 'dmsm2',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': true,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'collapse-tags': true,
      clearable: true,
      placeholder: '请选择居住地',
      props: {
        value: 'value'
      },
      code: 'BM_BZ_XZQH_JC',
      module,
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    value: '',
    op: 'like',
    type: '',
    format: '',
    mergerName: 'SFZH,XM,QTZJHM',
    bind: { is: 'el-input', placeholder: '请输入身份证、姓名、关联属性查询', clearable: true }
  }
];
/**
 * 搜索条件 - 预警轨迹
 * @type {Array}
 */
export const CONDITIONS_YJGJ = [
  {
    label: '发生时间',
    name: 'HDFSSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '比中时间',
    name: 'XXBDSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '轨迹来源',
    name: 'GJLY_DWJB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_GJLY_DWJB',
      module,
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '轨迹类型',
    name: 'DTXXLX',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': true,
      'collapse-tags': true,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'check-strictly': true,
      clearable: true,
      placeholder: '请选择轨迹类型',
      props: {
        value: 'value'
      },
      code: 'VW_BM_YWXXLX',
      module,
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '发生地区',
    name: 'FSDQH',
    value: '',
    op: 'dmsm2',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': true,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'collapse-tags': true,
      clearable: true,
      placeholder: '请选择发生地',
      props: {
        value: 'value'
      },
      code: 'BM_BZ_XZQH_JC',
      module,
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    value: '',
    op: 'like',
    type: '',
    format: '',
    mergerName: 'DXHM,XM,FSDQH,FSDXZ',
    bind: { is: 'el-input', placeholder: '请输入对象号码、姓名、发生地点查询', clearable: true }
  }
];

/**
 * 搜索条件 - 申请轨迹对象
 * @type {*[]}
 */
export const CONDITIONS_GJDX = [
  {
    label: '轨迹时间',
    name: 'CJSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '布控时间',
    name: 'BKRQ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '布控状态',
    name: 'BKZT',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_BKDX_BKZT',
      module,
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '布控对象',
    name: 'HMLX',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      filterable: true,
      clearable: true,
      'check-leaf': true,
      'check-strictly': true,
      'lazy-load': false,
      props: {
        value: 'value'
      },
      is: 'dg-tree-drop',
      class: 'u-lable-btn is-no-border',
      code: BM_QWBK_BKDX,
      module
    }
  },
  {
    label: '布控类别',
    name: 'BKLB',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      code: 'BM_BKSQ_BKLB',
      module,
      clearable: true,
      filterable: true,
      'lazy-load': false,
      'collapse-tags': true,
      'check-strictly': true,
      props: {
        value: 'value'
      },
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'HMNR',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入号码内容查询' }
  }
];

/**
 * 搜索条件 - 群组的对象轨迹
 * @type {Array}
 */
export const CONDITIONS_QZ_DXGJ = [
  {
    label: '发生时间',
    name: 'HDFSSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '比中时间',
    name: 'XXBDSJ',
    value: '',
    op: 'date14Range',
    type: '',
    format: '',
    bind: {
      class: 'is-no-border u-lable-btn',
      is: 'dg-date-picker',
      type: 'daterange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '截止日期',
      format: 'yyyy-MM-dd',
      'value-format': 'yyyyMMddHHmmss',
      'default-time': ['00:00:00', '23:59:59'],
      'short-btns': TIME_PICK_BTNS
    }
  },
  {
    label: '轨迹来源',
    name: 'GJLY_DWJB',
    value: '',
    op: 'in',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_GJLY_DWJB',
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '轨迹类别',
    name: 'GJFL',
    value: '',
    op: '=',
    type: '',
    format: '',
    bind: {
      is: 'dg-radio-group',
      class: 'u-lable-btn is-no-border',
      type: 'button',
      'is-lace': true,
      code: 'BM_GJFL',
      'custom-data': [{ value: '', label: '不限' }]
    }
  },
  {
    label: '发生地区',
    name: 'FSDQH',
    value: '',
    op: 'dmsm2',
    type: '',
    format: '',
    bind: {
      is: 'dg-tree-drop',
      multiple: true,
      'lazy-load': true,
      'tree-props': {
        isHighLight: true,
        nodeKey: 'value',
        showCheckbox: true
      },
      filterable: true,
      'value-name': 'value',
      'label-name': 'label',
      'collapse-tags': true,
      clearable: true,
      placeholder: '请选择发生地',
      props: {
        value: 'value'
      },
      code: 'BM_BZ_XZQH_JC',
      style: {
        width: '100%'
      }
    }
  },
  {
    label: '关键字查询',
    name: 'GJZ',
    mergerName: 'DXHM,XM,FSDXZ',
    value: '',
    op: 'like',
    type: '',
    format: '',
    bind: { is: 'el-input', placeholder: '请输入布控号码、姓名、发生地点查询' }
  }
];
