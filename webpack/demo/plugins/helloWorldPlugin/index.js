// 请将它放到node_modules中

//插件内部可以接受到该插件的配置参数
function helloWorldPlugin() { }

helloWorldPlugin.prototype.apply = function (compiler) {

  compiler.plugin('done', function () {
    console.log('>>>>>>>>>> World!');
  });
  //使用 Compiler 对象的 compilation 钩子函数就可以获取 Compilation 对象
  compiler.plugin("compilation", function (compilation) {
    //使用 Compilation 注册回调
    compilation.plugin("optimize", function () {
      console.log(">>>>>>>>>>Assets are being optimized.");
    });
  });
  // 异步 
  compiler.plugin('emit', function (compilation, callback) {
    setTimeout(() => {
      console.log('>>>>>>>>>>Done with async work......');
      callback();
    }, 1000);
  })

};
module.exports = helloWorldPlugin;

// 官网文档
// https://github.com/webpack/docs/wiki/how-to-write-a-plugin