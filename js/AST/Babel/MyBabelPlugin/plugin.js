export default function ({types:t}){
  return{
    vistior:{
      BinaryExpression(path){
     
        if(path.node.operator !== '==='){
          return;
        }
        path.node.left = t.identifier('sebmck');
        path.node.right = t.identifier("dork");
      }
      // Identifier(path,state){

      // },
      // ASTNodeTypeHere(path, state){

      // }
    }
  }
}

   // 检查节点的类型


// source code
// foo === bar

//  =>
// AST
// {
//   type: "BinaryExpression",
//     operator: "===",
//       left: {
//     type: "Identifier",
//       name: "foo"
//   },
//   right: {
//     type: "Identifier",
//       name: "bar"
//   }
// }