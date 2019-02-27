// 反柯里化
// 作用在于扩大函数的适用性，使本来作为对象所拥有的功能的函数可以被任意对象所用

// 例子

//  obj.func(arg1,arg2) => func(obj,arg1,arg2)

Function.prototype.uncurring = function(){
  var _this = this;
  return function(){
    return Function.prototype.call.apply(_this,arguments);
  }
}

function sayHi(){
  return "Hello" + this.value + " " +[].slice.apply(arguments);
}

var sayHiuncurrying = sayHi.uncurring();
var result = sayHiuncurrying({ value: 'world' }, 'hahah', '21312321'); 

// sayHiuncurrying(obj, arg1, ...)   =>
// sayHi.call(obj, arg1, ...) =>
// obj.sayHi(arg1, ...)

//  x.y(z) =>  y(x',z)  假设x' 为x或者其他对象，这就扩大了函数的使用范围。
console.log('result ->',result);

// 通用反柯里化函数

var uncurrying = function (fn) {
  return function () {
    var args = [].slice.call(arguments, 1);
    return fn.apply(arguments[0], args);
  }
};

// 对反柯里化更通俗的解释可以是 函数的借用，是函数能够接受处理其他对象，通过借用泛化、扩大了函数的使用范围。
// 所以 uncurrying更常见的用法是对 Javascript 内置的其他方法的 借调 而不用自己都去实现一遍。


// 参考文章：
// https://segmentfault.com/a/1190000010700130
// https://juejin.im/post/58a5879e1b69e6006d1e8748