// babel 核心库，用来实现核心的转换引擎
const babel = require("@babel/core");
// 实现类型转化 生成AST节点
const types = require("@babel/types");

let code = 'let sum = (a,b) => a+b;';
// let es5Code = function (a, b) {
//   return a + b;
// };

// babel 转化采用的是访问者模式Visitor 对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行操作也不同

// 这个访问者可以对特定的类型的节点进行处理
let visitor = {
  ArrowFunctionExpression(path) {
    //t.arrowFunctionExpression(params, body, async)
    // 如果这个节点是箭头函数的节点的话，我们在这里进行处理替换工作
    // 1.复用params参数
    let params = path.node.params;
    let blockStatement = types.blockStatement([types.returnStatement(path.node.body)])
    let func = types.functionExpression(null, params, blockStatement, false, false);
    // 最后替换节点
    path.replaceWith(func);
  }
}

let arrayPlugin = { visitor }

// babel内部先把代码转化成AST,然后进行遍历

let result = babel.transform(code, {
  plugins: [
    arrayPlugin
  ]
})

console.log('result ->', result.code)