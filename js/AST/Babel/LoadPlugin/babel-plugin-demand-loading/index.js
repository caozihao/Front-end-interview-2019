
const babel = require("@babel/core");

module.exports = function ({ types: t }) {
  return {
    visitor: {
      /**
       * @param {*} path  当前节点的位置
       * @param {*} state  插件选项
       * 在babel.plugins里面配置
      *   "plugins": [
                [
                  "demand-loading",
                  // 这个对象就是state
                    {
                      "library": "lodash", 
                      "idNeed": true
                    }
                ]
            ]
       */
      ImportDeclaration(path, state) {
        let { opts } = state
        let node = path.node;
        let specifiers = node.specifiers
        if (opts.library == node.source.value) {
          //  console.log('specifiers ->', specifiers);
          let newImport = specifiers.map((specifier, index) => {
            return t.importDeclaration([t.ImportDefaultSpecifier(specifier.local)], t.stringLiteral(`${node.source.value}/${specifier.local.name}`))
          });
          // console.log('newImport ->', newImport);
          path.replaceWithMultiple(newImport)
        }
      }
    }
  }
}