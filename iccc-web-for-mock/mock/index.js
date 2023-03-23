import Mock from 'mockjs';

const response = require('./serverApi.json');
const { getSetting } = window.systemParamsUtils;

export default mockXHR;

export function mockXHR() {
  const baseUrl = getSetting('BASE_API');
  if (response && response.data && response.data.mocks instanceof Array) {
    response.data.mocks.map(item => {
      let reqURI = item.url;
      if (item.url) {
        let keys = reqURI.split('?')[0].split('/');
        keys.map(key => {
          if (key.startsWith(':')) {
            reqURI = reqURI.replace(key, '[a-zA-Z0-9_]*');
          } else if (key.startsWith('{') && key.endsWith('}')) {
            reqURI = reqURI.replace(key, '[a-zA-Z0-9_]*');
          }
        });
      }
      Mock.mock(new RegExp(baseUrl + reqURI), item.method, function(options) {
        let data;
        if (item.mode instanceof Array) {
          data = item.mode;
        } else if (item.mode instanceof Object) {
          data = item.mode;
        } else {
          data = eval('(' + item.mode + ')');
        }
        const { body, url } = options;
        let args = {
          query: param2Obj(url)
        };
        if (typeof body === 'string') {
          try {
            args.body = JSON.parse(body);
          } catch (e) {
            args.body = param2Obj('http://zzz?' + body);
          }
        }
        let regUrl = baseUrl + item.url;
        let reqUrlKeys = options.url.split('/');
        regUrl.split('/').map((key, index) => {
          if (key !== reqUrlKeys[index]) {
            args.query[key.substr(1)] = reqUrlKeys[index];
          }
        });
        transFunc2Data(data, args);
        return Mock.mock(data);
      });
    });
  } else {
    console.error('serverApi.json有问题！~~');
  }
}

/**
 * 将mock中的方法转换成数据
 * @param data
 * @param arg
 */
function transFunc2Data(data, arg) {
  for (let key in data) {
    if (data[key] instanceof Function) {
      let tmpFn = data[key];
      data[key] = tmpFn({ _req: arg, Mock });
    } else if (data[key] instanceof Object) {
      transFunc2Data(data[key], arg);
    }
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}
