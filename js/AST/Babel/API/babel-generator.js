// Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射

const babylon = require('babylon')
const generate = require('babel-generator');

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, {}, code)