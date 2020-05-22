<!--
 * @Author: your name
 * @Date: 2019-11-01 15:41:47
 * @LastEditTime: 2019-11-01 15:50:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lwy\README.md
 -->
# lwy

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 配置
#### 后台地址
开发调试时，复制.env.development并新增.env.development.local文件，修改其中的VUE_APP_API_URL值；
对生产环境，修改.env.production里面的VUE_APP_API_URL值
对开发、测试环境，下载代码后进入workspace，复制.env.production并新增.env.production.local文件，修改其中的VUE_APP_API_URL值，或者直接在打包脚本中设置环境变量
```shell script
export VUE_APP_API_URL=xxxxxx
npm run build
```
或者
```shell script
export VUE_APP_API_URL=xxxxxx
yarn build
```

### 技术栈
```
    技术架构：
        基础技术：HTML-CSS-JavaScript-Sass
        js框架：vue+vuex+vue-router+axios+webpack+echarts+cropperjs+crypto-js+js-cookie+lockr+moment
        UI框架：iview
        搭建框架工具：vue-cli 3.0
```

### 项目目录结构