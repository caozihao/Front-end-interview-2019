
const babel = require('babel-core');
const types = require('babel-types');

module.exports = {
  visitor: {
    // 这里的ref是ImportDeclaration的第二个参数，这里的值是.babelrc中的 {
    // "library": "lodash"
    //}, 这里是指定 我们在引用哪个库的时候使用这个插件
    ImportDeclaration(path, ref = {}) {
      let { opts } = ref
      let node = path.node;
      let specifiers = node.specifiers
      if (opts.library == node.source.value && !types.isImportDeclaration(specifiers[0])) {
        let newImport = specifiers.map((specifier) => (
          types.importDeclaration([types.ImportDefaultSpecifier(specifier.local)], types.stringLiteral(`${node.source.value}/${specifier.local.name}`))
        ));
        path.replaceWithMultiple(newImport)
      }
    }
  }
}