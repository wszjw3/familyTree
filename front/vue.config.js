// vue.config.js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  // publicPath: '',
  configureWebpack: (config) => {
    config.entry.app = ['babel-polyfill', './src/main.js']
    //删除console插件
    let plugins = [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        terserOptions: {
          warnings: false,
          compress: {
            // 打包时删除console以及debugger，测试环境如需使用console或者debugger请改为false（不要直接删除）
            drop_console: true,
            drop_debugger: true,
          },
          output: {
            //去掉注释内容
            comments: false,
          },
        }
      })
    ]
    //只有打包生产环境才需要将console删除
    if (process.env.NODE_ENV == 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  }
  // ,
  // chainWebpack: config => {
  //   config
  //     .entry('app')
  //     .add('babel-polyfill')
  // }
  // config.output.filename('[name].[hash].js').end()
  // }
}
