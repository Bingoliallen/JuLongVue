'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');
module.exports = {
  NODE_ENV: '"development"',
  // 以上配置一般不需要修改

  // 布局结构配置，可选项包含 `layout-menu-top`, `layout`
  LAYOUT: '"layout"',

  // 使用easymock时，请将BASE_API设置为'"/easy-mock"'
  BASE_API: '"/easy-mock"',
  // 如果对接多个系统，可在下方继续配置
  // MODULE2: '"/easy-mock2"',

  // 是否需要登录验证
  NEED_LOGIN: 'true',

  // 需要依赖的系统名称
  // INSTALLED_PROJECT: "'zfba,demo2,cross-env'",

  // 当使用Oauth2方式登录时需要配置CLIENT_ID和CLIENT_SECRET
  IS_OAUTH2: 'false',
  CLIENT_ID: '"apigw91419331"',
  CLIENT_SECRET: '"apigw94003010"',
  APP_CODE: '"apigw10000003"',

  // 是否起用本地mock
  IS_MOCK: '"false"',

  PROXY_TABLE: JSON.stringify({
    '/nzdr_mock': {
      target: 'http://192.168.10.14:7300/mock/5fc4a6a2761ab76e2458efe1/qz-nzdr',
      pathRewrite: {
        '^/nzdr_mock': ''
      }
    },
    '/scenes_mock': {
      target: 'http://192.168.10.14:7300/mock/5dc05df68b1915be74d20988/bjsc-imitate_tpl',
      pathRewrite: {
        '^/scenes_mock': ''
      }
    },
    '/easy-mock': {
      target: 'http://192.168.10.14:7300/mock/5ca5ea72ab5bcfad10cf1607/mock',
      pathRewrite: {
        '^/easy-mock': ''
      }
    },
    '/setting-center': {
      target: 'http://192.168.10.9:8070/openapi/v1/envs/dev/apps/test-190701-1700/clusters/default/namespaces',
      pathRewrite: {
        '^/setting-center': ''
      }
    },
    // 地图 url 代理
    '/ezmap_sl': {
      target: 'http://10.10.10.123',
      pathRewrite: {
        '^/ezmap_sl': ''
      }
    }
  })
};
