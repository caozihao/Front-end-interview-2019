##  AST (Abstract Syntax Trees)抽象语法树

**官方解释**

It is a hierarchical program representation that presents source code structure according to the grammar of a programming language, each AST node corresponds to an item of a source code.

**中文**

它是一种分层程序表示，它根据编程语言的语法呈现源代码结构，每个AST节点对应一个源代码项。

**过程**

**第一步**：

词法分析，也叫做扫描scanner。它读取我们的代码，然后把它们按照预定的规则合并成一个个的标识tokens。同时，它会移除空白符，注释，等。最后，整个代码将被分割进一个**tokens列表（或者说一维数组）**。

当词法分析源代码的时候，它会一个一个字母地读取代码，所以很形象地称之为扫描-scans；当它遇到空格，操作符，或者特殊符号的时候，它会认为一个话已经完成了。


**第二步**:

语法分析，也叫做解析器。它会将词法分析出来的数组转化成树形的表达形式。同时，验证语法，语法如果有错的话，抛出语法错误。


当生成树的时候，解析器会删除一些没必要的标识tokens（比如不完整的括号），因此AST不是100%与源码匹配的，但是已经能让我们知道如何处理了。说个题外话，解析器100%覆盖所有代码结构生成树叫做**CST（具体语法树）**


---

**参考文章**：

[平庸前端码农之蜕变 — AST](https://juejin.im/post/5bfc21d2e51d4544313df666)

[AST抽象语法树——最基础的javascript重点知识，99%的人根本不了解](https://segmentfault.com/a/1190000016231512)