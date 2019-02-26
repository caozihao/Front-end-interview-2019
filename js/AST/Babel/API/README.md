

[写一个babel插件实现按需打包的功能](https://www.jianshu.com/p/b2e0b90b507d)

[Babel API github](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-visitors)

[在线转换AST](https://astexplorer.net/)

[快速写一个babel插件](https://www.jianshu.com/p/44c0075fd043)

[babel-types查找手册](https://www.babeljs.cn/docs/core-packages/babel-types/#variabledeclaration)


##  主要API

* babylon 
>  Babel 的解析器,用于词法解析和语法解析

* babel-traverse
>  模块维护了整棵树的状态，并且负责替换、移除和添加节点。

* babel-types
>  用于 AST 节点的 Lodash 式工具库,它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。

* babel-generator
> 模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射

* babel-template
> 能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成的大规模 AST的时候。 在计算机科学中，这种能力被称为准引用（quasiquotes）。


##   babel编译原理
* babylon将ES6/ES7 代码解析成 AST
* babel-traverse对AST进行遍历转移，得到新的AST
* 其中用到了babel-types,是一个类Lodash式工具库，包含了构造、验证以及变换 AST 节点的方法
* 新AST 通过babel-generator 转换成ES5