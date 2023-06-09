'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
var webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const vueLoaderConfig = require('./vue-loader.conf');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 包含编译，demo的时候使用
      '@': resolve('src'),
      '@@': resolve('src/components/base'),
      '@srcPath': resolve('node_modules/ui-jz-v4-common/src'),
      '@icccPath': resolve('src'),
      '@icccdPath': resolve('node_modules/@qb/qs-icccd/src'),
      main: resolve('node_modules/ui-component-v4/src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // exclude: /node_modules/
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/ui-jz-v4-common'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(txt|htm)$/,
        loader: 'raw-loader'
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: [resolve('src/components/qb-base'), resolve('src/api/qb-base')],
        include: [resolve('src'), resolve('node_modules/ui-jz-v4-common')]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // 抽离自己写的公共代码
          chunks: 'async', // async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk。
          name: 'common', // 打包后的文件名，任意命名
          minChunks: 2, // 最小引用2次
          minSize: 10000 // 只要超出30000字节就生成一个新包
        },
        vendor: {
          // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    }
    // runtimeChunk: true     // 持久缓存moduleID,ChunkID需要HashedModuleIdsPlugin等插件解决
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new AntdDayjsWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../node_modules/@qb/qs-icccd/static/icccd'),
        to: config.dev.assetsSubDirectory + '/icccd',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
    // 是否启用代码依赖分析
    // new BundleAnalyzerPlugin()
  ]
};
