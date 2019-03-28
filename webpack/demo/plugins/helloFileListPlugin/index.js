// 请将它放到node_modules中

// function helloFileListPlugin() { }

// helloFileListPlugin.prototype.apply = function (compiler) {


// };
class HelloFileListPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor({ callback, content, htmlfilePath }) {
    this.callback = callback;
    this.content = content;
    this.htmlfilePath = htmlfilePath;
  }
  apply(compiler) {
    // const this = this;
    // 在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容。
    compiler.plugin('emit', (compilation, callback) => {
      var filelist = 'In this build:\n\n';
      for (var filename in compilation.assets) {
        filelist += ('- ' + filename + '\n');
      }
      compilation.assets['filelist.md'] = {
        source: function () {
          return filelist;
        },
        size: function () {
          return filelist.length;
        }
      };
      this.callback(this.content);
      // console.log('this.content ->', this.content);
      callback();
    });

    // 当依赖的文件发生变化时会触发 watch-run 事件
    compiler.plugin('watch-run', (watching, callback) => {
      // 获取发生变化的文件列表
      const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
      // changedFiles 格式为键值对，键为发生变化的文件路径。
      if (changedFiles[htmlfilePath] !== undefined) {
        // filePath 对应的文件发生了变化
        console.log('>>>>>>>File change')
      }
      callback();
    });

    compiler.plugin('after-compile', (compilation, callback) => {
      // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
      compilation.fileDependencies.add(this.htmlfilePath);
      callback();
    });

    // 判断 Webpack 使用了哪些插件

  }
}
module.exports = HelloFileListPlugin;
