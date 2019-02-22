// Babel Types模块是一个用于 AST 节点的 Lodash 式工具库（译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用。

const traverse = require('babel-traverse');
const t = require('babel-types');

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});

// Definitions

// Babel Types模块拥有每一个单一类型节点的定义，包括节点包含哪些属性，什么是合法值，如何构建节点、遍历节点，以及节点的别名等信息。
// 单一节点类型的定义形式如下：

defineType("BinaryExpression", {
  // 每一个节点类型都有构造器方法builder，按类似下面的方式使用
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});


// Builders

t.binaryExpression("*", t.identifier("a"), t.identifier("b"));

// =>

// {
//   type: "BinaryExpression",
//   operator: "*",
//   left: {
//     type: "Identifier",
//     name: "a"
//   },
//   right: {
//      type: "Identifier",
//      name: "b"
//   }
// }

