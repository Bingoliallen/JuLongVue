/**
 * 此处填写文件描述
 * @Author: huangjq
 * @Date:   2019-12-27
 * @Project jz
 */

const fs = require('fs');
const request = require('request');

// easy-mock的url
const serverUrl = 'http://192.168.10.14:7300';
// 项目ID
const projectId = '5ca5ea72ab5bcfad10cf1607';
// easy-mock的具有该项目权限的用户名密码
const username = 'huangjq';
const password = '123456';

// 登录请求token
request(
  {
    url: `${serverUrl}/api/u/login`,
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: { name: username, password: password }
  },
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // 请求项目信息
      request(
        {
          url: `${serverUrl}/api/mock?project_id=${projectId}&page_size=2000&page_index=1&keywords=`,
          headers: {
            Authorization: `Bearer ${body.data.token}`
          }
        },
        function(error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log('请求成功');
            let filePath = './mock/serverApi.json';
            fs.writeFileSync(filePath, body);
            console.log('文件写入结束', filePath);
          } else {
            console.error('请求失败，请检查用户名或密码是否有误', error);
          }
        }
      );
    }
  }
);
