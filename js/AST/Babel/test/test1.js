const pluginTester = require('babel-plugin-tester') ;
const babel = require('babel-core');

pluginTester({
  plugin: identifierReversePlugin,
  snapshot: true,
  tests: [
    { code: '"hello";', snapshot: false },
    {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    `
      function sayHi(person) {
        return 'Hello ' + person + '!'
      }
      console.log(sayHi('Jenny'))
    `,
  ],
})

function identifierReversePlugin() {
  return {
    name: 'identifier reverse',
    visitor: {
      Identifier(idPath) {
        idPath.node.name = idPath.node.name.split('').reverse().join('')
      }
    }
  }
}
