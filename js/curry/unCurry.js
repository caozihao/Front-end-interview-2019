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
// sayHi(obj, arg1, ...) =>
// obj.sayHi(arg1, ...)

console.log('result ->',result);
