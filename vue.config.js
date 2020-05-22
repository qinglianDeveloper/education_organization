/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-17 21:35:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-07 15:47:21
 */
const path = require('path')

let url = "http://8.129.183.72:6020/" //开发环境
//let url = "http://172.16.30.46:6020/" //陈宇仁
// let url = "http://120.24.215.57:6020" //测试环境

module.exports = {
    // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
    integrity: false,
    // webpack相关配置
    chainWebpack: (config) => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', path.resolve(__dirname, './src'))
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 生产环境
            config.mode = 'production'
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
        } else {
            // 开发环境
            config.mode = 'development'
        }
    },
    // css相关配置
    css: {
        // 是否分离css（插件ExtractTextPlugin）
        extract: true,
        // 是否开启 CSS source maps
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 是否启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // 是否使用 thread-loader
    parallel: require('os').cpus().length > 1,
    // PWA 插件相关配置
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: true,
        host: '127.0.0.1', //真机测试，使用这个IP
        port: 8085,
        // https: false,
        hotOnly: true,
        disableHostCheck: true,
        // http 代理配置
        proxy: {
            // 配置跨域
            '/admin': {
                target: url,
                changeOrigin: true, //开启代理
                ws: true,
                pathRewrite: {
                    '^/admin': '/admin'
                }
            },
            '/group1': {
                target: 'http://172.16.200.204:8888/',
                changeOrigin: true, //开启代理
                pathRewrite: {
                    '^/group1': '/group1'
                }
            }
        },
        // before: (app) => { }
    },
    // publicPath: '/admin/',
    // 第三方插件配置
    // pluginOptions: {

    // }
}