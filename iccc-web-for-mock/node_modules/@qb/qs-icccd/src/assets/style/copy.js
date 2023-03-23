const through = require('through2'),
  fs = require('fs'),
  Path = require('path');

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(Path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
/**
 * Take a stream and resolve all the scss imports based on its own path
 *
 * @param {string} [projects] - Name of the projects
 *
 * @return {stream} Stream with all the @imports resolved
 */
function copyResources(projects) {
  const copy = function(src, dst) {
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

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    // console.log(projects);
    projects = projects.replace(/'/g, '');
    if (projects) {
      projects = projects.split(',');
      projects.map(project => {
        let srcDir = `../../node_modules/${project}/src/assets/images`;
        let relSrcPath = Path.resolve(srcDir);
        let rootPath = Path.resolve(`../../static/${project}/themes/images/`);
        fs.exists(relSrcPath, function(exists) {
          if (exists) {
            checkDirectory(relSrcPath, rootPath, copy);
          } else {
            console.log(`【${project}】项目不正确或者未安装，请先执行【npm install ${project}】`);
          }
        });
      });
    } else {
      console.error('【config/dev.env.js】文件中缺少【INSTALLED_PROJECT】配置');
    }

    cb(null, file);
  });
}

module.exports = copyResources;
