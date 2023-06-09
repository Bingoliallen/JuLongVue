module.exports = {
  //此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  //此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  //此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    browser: true,
    node: true,
    jquery: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  // required to lint *.vue files
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  //"error" -> 2 开启错误规则
  // 了解了上面这些，下面这些代码相信也看的明白了
  rules: {
    'require-jsdoc': 0,
    'valid-jsdoc': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 0 : 0,
    // js语句结尾必须使用分号
    semi: ['off', 'always'],
    // 三等号
    eqeqeq: 0,
    // 强制在注释中 // 或 /* 使用一致的空格
    'spaced-comment': 1,
    // 关键字后面使用一致的空格
    'keyword-spacing': 1,
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': 0,
    // 禁止出现未使用过的变量
    'no-unused-vars': 1,
    // 要求或禁止末尾逗号
    'comma-dangle': 0
  }
};
