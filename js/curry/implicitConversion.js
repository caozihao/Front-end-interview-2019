
// 隐式转换
// 当我们直接将函数参与其他的计算时，函数会默认调用toString方法，直接将函数体转换为字符串参与计算。

function fn(){
  return 20;
}

// console.log(fn + 10)  // function fn(){ return 20; }10


function fn2() {
  return 20;
}
// 重写toString方法
fn2.toString = function(){
  return 20;
}
// 重写valueOf方法
fn2.valueOf = function(){
  return 10;
}

// 同时重写函数的toString方法与valueOf方法时，最终的结果会取valueOf方法的返回结果

console.log(fn2 + 10) 