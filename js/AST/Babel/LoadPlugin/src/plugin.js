const babel = require('babel-core');
const types = require('babel-types');

let visitor = {
  ImportDeclaration(path, ref = { options: {} }){
    let node = path.node;
    let specifiers = node.secifiers;
    if (options.library == node.soure.value && !types.isImportDeclaration(specifiers[0])) {
      let newImport = specifiers.map((specifier) => (
        types.importDeclaration([types.ImportDefaultSpecifier(specifier.local)], types.stringLiteral(`${node.soure.value}/${specifier.local.name}`))
      ));
      path.replaceWithMultiple(newImport)
    }
  }
}

const code = "import {flatten, join} from 'lodash';";
let r = babel.transform(code, {
  plugins: [
    { visitor }
  ]
})