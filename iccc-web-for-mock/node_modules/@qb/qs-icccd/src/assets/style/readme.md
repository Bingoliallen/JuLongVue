##文件说明

1. 公共变量 `common.scss`；这里放通用的，不受主题影响的样式变量
1. 主题变量 `variable-theme-${name}.scss`；这里放主题特有的样式变量
1. 公共样式 `main.scss`；这里导入各页面或者组件的样式

##主题样式编译
主要入口是主题变量 `variable-theme-${name}.scss`，根据不同变量名称，编译成不同主题文件

##公共变量引用
可以直接引用`common.scss`和`variable-theme-${name}.scss`里面的样式变量。
