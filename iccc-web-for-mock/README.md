#

> UI-DESIGN-V4

# 搭建和运行前端开发环境

# 从 svn 下载前端工程目录

# 下载安装 node

[下载地址](http://nodejs.org/)

# 配置本地 npm 私服地址跟网络代理

npm config set registry=http://192.168.6.13:8082/repository/npm_all/

npm config set proxy=http://192.168.6.13:8082

或者在用户根目录建立.npmrc 文本文件`C:\Users\用户名\.npmrc`，加入下面配置

`registry=http://172.16.104.52:8081/repository/npm_all/`

# 从 npm 安装项目依赖

`cmd命令 > cd 项目目录`

# 安装依赖

npm install

# 启动服务 端口号 8080

npm run dev

# 打包生产环境

npm run build

# 打包组件上传到 npm

npm run upload

# 构建用于生产和查看 bundle analyzer 报告。

npm run build --report

### 前端技术路线

#### vue

[vue 官网](https://cn.vuejs.org/v2/guide/)

#### element ui

[element ui 官网](http://element.eleme.io/#/)

#### vue-router

[vue-router 官网](https://router.vuejs.org/zh-cn/)

#### axios

[axios 文档](https://www.kancloud.cn/yunye/axios/234845)

#### webpack dev-server 配置说明

[dev-server 官网](https://webpack.js.org/configuration/dev-server/)

### 打包遇到的问题

font 路径错误-->修改配置文件-->build--utils 里面的 ExtractTextPlugin.extract 下添加 publicPath:'../../'
css 加载顺序错误-->调整 main.js 的 element 的 css 顺序必须在 router 跟 app 之前
静态文件加载错误-->修改配置文件-->config--index 里面的 assetsPublicPath 改为./
组件复用路由监听错误-->采用 prop 降低组件与路由的高耦合

## 二次修改点

1. src/common/index.js 获取配置方法简化；
2. src/api/login.js 数据请求需要添加 baseURL, passWrap 配置；
3. src/assets/style/\*.scss 只报留默认主题；
4. build/utils.js 将 common.scss 注册为全局变量；
5. src/utils/request.js 请求封装；
6.

## 路径问题

1. 页面，组件，图片等资源使用 @icccPath 设置路径；
2. 公共方法，route，store 使用 @ 设置路径；

## 开发知识点

### 分页排序（infinite-scroll, qs-table, search-page-grid）

1. 使用配置 `sortProps: {"sqsj":"DESC","bksj":"ASC"}` ；
2. 或者 `sortProps: [{ sqsj: 'DESC' }, { bksj: 'ASC' }]` ；

### 搜索条件（infinite-scroll, qs-table, search-page-grid）

1. 搜索条件只允许使用数组；
2. 数组每一项的格式为：`{ name, value, op, type, format, mergerName }`；
3. `mergerName`把多个`name`合并一起查询（英文逗号隔开，并且本项的 `name` 必须配置为 `GJZ`；
4. 如果搜索条件是时间，`op` 需要配置为`rangeDate`，`date8Range`，`date14Range` 3 者之一；
5. 目前搜索条件的 `name` 必须为大写字母组合；

```javascript
// 示例：
searchCondition = [
  { name: 'hmlx', value: '01' },
  { name: 'bkzt', value: '01' },
  { name: 'bkksrq', value: ['20201218000000', '20201218235959'], op: 'rangeDate' },
  { name: 'GJZ', value: '张三', mergerName: 'bkdxmc,bkdxlx' }
];
```

### 上一页下一页切换（qwbk-layout 里面的 router-view）

`router-view`对应的页面可以抛一个事件出来，触发`page-change` ；

```javascript
// 示例：
this.$emit('page-change', {
  // 条数改变 -1: 上一条, 1: 下一条；
  type: 1,
  // 回调函数，页面切换返回参数，回传参数格式为 { data, node, last, next } = params，如果回传参数为空表示找不到对应数据
  callback: params => {
    if (params) {
      const { data, node, last, next } = params;
    }
  },
  // 列表数据的主键（会作为路由 params.id 使用），默认为 id
  idKey: 'id',
  // 当前页面的主键，默认为 $route.params.id
  id: 'aaaaa',
  // 页面滚动到选中项，默认滚动
  scrollIntoView: true
});
```
