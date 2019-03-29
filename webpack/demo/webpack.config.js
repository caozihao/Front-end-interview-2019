const HelloWorldPlugin = require('helloWorldPlugin')
const HelloFileListPlugin = require('helloFileListPlugin')
const path = require('path');
module.exports = {
  entry: './src/index.js',// 入口文件
  output: {
    path: path.join(__dirname, 'dist'), // 输出路径
    filename: 'bundle.js' // 输出的文件名称
  },
  plugins: [
    new HelloWorldPlugin({ option: true }),
    new HelloFileListPlugin({
      callback: (data) => {
        console.log('!!!!' + data + '')

      },
      content: 'Hello Plugin!',
      htmlfilePath: path.join(__dirname, './src/index.html')
    })
  ]
}
