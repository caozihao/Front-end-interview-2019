##  如何编写一个webpack插件

在开发插件的时候最重要的两个资源就是compiler和compilation对象，理解他们的角色是拓展webpack引擎重要的第一步
* complier对象代表了完整的配置的webpack环境，一旦开启webpack之后，这个对象就被构建了，并且这个对象会使用所有操作设置，包括options,loaders以及plugins来进行配置，当将一个插件应用到webpack环境中，这个插件将会获得一个对于这个compiler的引用，使用这个compiler可以访问主要的webpack环境
* 一个compilation对象代表版本资源的一次构建，当运行webpack开发中间件的时候，每次检测到文件变化都会产生一个新的compilation，因此会生成一系列变异后的资源，Compilation表示有关模块资源，已编译资源，已更改文件和监视依赖关系的当前状态的信息，该compilation还提供了许多回调点，插件可以选择执行自定义操作

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

##  如何创建一个webpack的插件

* 一个js命名函数
* 在原型链上存在一个apply方法
* 为该插件指定一个webpack的事件钩子函数
* 使用webpack内部的实例对象（complier或者Compliation）具有的属性或者方法
* 当功能完成以后，需要执行webpack的回调函数


官方文档:
https://github.com/webpack/docs/wiki/how-to-write-a-plugin

其他文档:
https://segmentfault.com/a/1190000004279560
https://segmentfault.com/a/1190000012840742

Compilation文档:
https://github.com/webpack/webpack/blob/master/lib/Compilation.js
Compiler文档:
https://github.com/webpack/webpack/blob/master/lib/Compiler.js