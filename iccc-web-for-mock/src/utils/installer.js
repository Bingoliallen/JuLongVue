/**
 * 此处填写文件描述
 * @Author: huangjq
 * @Date:   2019-11-06
 * @Project demo1
 */

const exec = require('child_process').exec;
const fs = require('fs');
const Path = require('path');

const copy = function(src, dst, callback) {
  console.log(src);
  let paths = fs.readdirSync(src); // 同步读取当前目录
  paths.forEach(function(path) {
    let _src = src + '/' + path;
    let _dst = dst + '/' + path;
    fs.stat(_src, function(err, stats) {
      // stats  该对象 包含文件属性
      if (err) throw err;
      if (stats.isFile()) {
        // 如果是个文件则拷贝
        fs.exists(_dst, function(exists) {
          if (exists) {
            console.log('文件已存在，跳过复制', _dst);
          } else {
            let readable = fs.createReadStream(_src); // 创建读取流
            let writable = fs.createWriteStream(_dst); // 创建写入流
            readable.pipe(writable);
          }
        });
      } else if (stats.isDirectory()) {
        // 是目录则 递归
        checkDirectory(_src, _dst, copy);
      }
    });
  });
  callback && callback();
};

const deleteAll = function(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteAll(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
const checkDirectory = function(src, dst, callback) {
  fs.access(dst, fs.constants.F_OK, err => {
    if (err) {
      mkdirsSync(dst);
      callback(src, dst);
    } else {
      callback(src, dst);
    }
  });
};

const mkdirsSync = function(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(Path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

const installUeditor = function() {
  let srcDir = `./ueditor-resources/Ueditor/`;
  let relSrcPath = Path.resolve(srcDir);
  let rootPath = Path.resolve(`./static/Ueditor`);
  exec('download-npm-package ueditor-resources', function(err, stdout, stderr) {
    if (!stderr && !err) {
      console.log(stdout);
      fs.rename(relSrcPath, rootPath, function() {
        deleteAll('./ueditor-resources');
      });
    } else {
      console.log(stderr);
    }
  });
};
installUeditor();
