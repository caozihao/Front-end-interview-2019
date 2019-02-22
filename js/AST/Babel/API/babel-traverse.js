// Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换，移除和添加节点
// 和 Babylon 一起使用来遍历和更新节点：

const babylon = require('babylon');
const traverse = require('babel-traverse');

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast,{
  enter(path){
    if( path.node.type === 'Identifier' && path.node.name === "n"){
      path.node.name = "x";
    }
  }
})