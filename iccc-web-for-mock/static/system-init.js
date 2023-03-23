// 网关地址
window.rootPath = 'http://10.201.3.22:8891';
// window.rootPath = 'http://10.254.11.83:8891'; // 备用网关地址
window.systemParams = {
  // 网关地址 + 服务名
  BASE_API: window.rootPath + '/qz-nzdr-liyp',
  // 网关地址 + 诺亚服务名
  NOAH_ARK: window.rootPath + '/noah_ark/dubbo',
  // 轨迹服务
  QZ_GJFW: window.rootPath + '/qz-gjfw',
  // 预警服务
  QZ_YJFW: window.rootPath + '/qz-yjfw',
  // QZ_YJFW: window.rootPath + '/qz-yjfw-tlc',
  // 布控对象服务
  QZ_BKDX: window.rootPath + '/qz-bkdx',
  // 布控申请服务
  QZ_BKSQ: window.rootPath + '/qz-bksq',
  // QZ_BKSQ: window.rootPath + '/qz-bksq-hj',
  // QZ_BKSQ: window.rootPath + '/qz-bksq-sugl',
  // 防控圈服务
  QZ_FKQ: window.rootPath + '/qz-fkq',
  //布控服务
  QZ_BKFW: window.rootPath + '/qz-bkfw',
  // 网关接口请求地址
  GATEWAY: window.rootPath,
  MOUDLE_CONFIG: {
    NOAH_ARK: 'dubbo' //后端请求框架类型
  },
  IS_OAUTH2: 'true',
  NEED_LOGIN: 'true',
  NEED_PERMISSIONS: 'false',
  // CLIENT_ID
  CLIENT_ID: 'apigw91419331',
  // CLIENT_SECRET
  CLIENT_SECRET: 'apigw94003010',
  // APP_CODE
  APP_CODE: '440000000000035',
  // 应用程序的名称
  APP_NAME: '情指云控',
  // 自定义登录页
  LOGIN_PAGE: 'bitaHtLogin.jsp',
  // 配置 gis 静态文件路径
  GIS_STATIC_PATH: 'static/iccc/lib',
  // 防控圈第一级节点
  GIS_FKQ_FIRST_NODE: '440000',
  // 截图等待时间（太小截图时图片没加载会有黑色区域）
  GIS_SCREEN_SHOT_TIME: 200,
  // 人员类别配置根节点编号
  RYLB_ROOT_BH: '001',
  // 是否需要桌面和主题
  IS_THEME: false,
  // 是否需要场景配置
  IS_SCENE: false,
  // 默认场景ID
  SCENE_ID: 'nzdr_gd',
  // 默认回调页面
  REDIRECT_PATH: '/qwbk'
};
