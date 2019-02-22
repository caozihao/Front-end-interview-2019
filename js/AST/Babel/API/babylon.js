
// Babylon 是 Babel 的解析器。

const babylon = require('babylon')
const code = `function square(n){
  return n * n;
}`; 
 
const result =  babylon.parse(code);

// sourceType 可以是 "module" 或者 "script"，它表示 Babylon 应该用哪种模式来解析。 "module" 将会在严格模式下解析并且允许模块定义，"script" 则不会。
const result2 = babylon.parse(code,{
  sourceType:'module',
  plugins:['jsx']
})


// console.log('result ->',result)
console.log('result2 ->', result2)