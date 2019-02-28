##  函数的柯里化

柯里化是把接受多个参数的函数变成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下参数且返回结果的新函数的技术。    

柯里化函数的运行过程其实就是一个参数的收集过程，将每一次的参数收集起来，并在最里层处理    

柯里化能够应对更加复杂的逻辑封装。当情况变得多变，柯里化依然能够应付自如

####  通用代码

```

// 一个通用的柯里化函数 (多一个执行方法)
function commonCurry (func){
  var args = [].slice.call(arguments, 1);
  var _func = function(){
    if(!arguments.length){
      return func.apply(this,args);
    }else{
      [].push.apply(args,arguments);
      return _func;
    }
  }
  return _func;
}

// 一个通用的柯里化函数（没有执行方法）
function commonCurry2(func) {
  var args = [].slice.call(arguments, 1);
  
  var _func = function () {
      [].push.apply(args, arguments);
      return _func;
  }
   
  _func.toString = function(){
    return func.apply(this, args);
  }
  return _func;
}


function addFunc(...args) {
  // 等同于下方代码
  // const res = args.reduce(function (a, b) {
  //   return a + b;
  // })

  const res = [].reduce.call(arguments, function (a, b) {
    return a + b;
  })

  // log('addFunc res ->', res)
  return res;
}


const a = commonCurry(addFunc, 1, 2, 3)(1)(2)(3, 4, 5, 5)(5, 6, 6, 7, 8, 8)(1)(1)(1)()
const a2 = commonCurry2(addFunc, 1, 2, 3)(1)(2)(3, 4, 5, 5)(5, 6, 6, 7, 8, 8)(1)(1)(1)

log('a + 10 ->', a + 10);
// log('a(10) + 10 ->', a(10) + 10);  //报错 
// log('a(10)(1,2,3)(4,5,6) + 10) ->', a(10)(1, 2, 3)(4, 5, 6) + 10); //报错 

log('a2 + 10 ->', a2 + 10);
log('a2(10) + 10 ->', a2(10) + 10);
log('a2(10)(1,2,3)(4,5,6) + 10) ->', a2(10)(1,2,3)(4,5,6) + 10);



```


##  反柯里化

对反柯里化更通俗的解释可以是 函数的借用，是函数能够接受处理其他对象，通过借用泛化、扩大了函数的使用范围。   
x.y(z) =>  y(x',z)  假设x' 为x或者其他对象，这就扩大了函数的使用范围。

####  通用代码

```
//函数调用
var uncurrying = function (fn) {
  return function () {
    var args = [].slice.call(arguments, 1);
    return fn.apply(arguments[0], args);
  }
};

//等同于
var uncurrying2 = function (fn) {
  return function () {
    var context = [].shift.call(arguments);
    return fn.apply(context, arguments);
  }
};

// 绑定在原型上
Function.prototype.uncurrying2 = function () {
  var _this = this;
  return function () {
    var args = [].slice.call(arguments, 1);
    return _this.apply(arguments[0], args);
  }
}


// 绑定在原型上
Function.prototype.uncurrying3 = function () {
  var _this = this;
  return function () {
    // return Function.prototype.call.apply(_this, arguments);
    return _this.call.apply(_this, arguments);
  }
}

var test = 'a,b,c';
console.log('split-origin ->',test.split(','));

var split = uncurrying(String.prototype.split);
console.log('split1 ->', split(test, ','))

var split2 = String.prototype.split.uncurrying2();
console.log('split2 ->', split2(test,','))

var split3 = String.prototype.split.uncurrying3();
console.log('split3 ->', split3(test, ','))

```



##  总结

函数柯里化就是对高阶函数的降阶处理，缩小适用范围，创建一个针对性更强的函数  
反柯里化就是反过来，增加适用范围，让方法使用场景更大

####  参考文章:

[前端基础进阶（八）：深入详解函数的柯里化](https://www.jianshu.com/p/5e1899fe7d6b)

[函数柯里化（应用）](https://www.jianshu.com/p/4b293581a03f)

[简单理解JavaScript中的柯里化和反柯里化](https://juejin.im/post/58a5879e1b69e6006d1e8748)

[从一道面试题谈谈函数柯里化(Currying)](https://segmentfault.com/a/1190000008193605)

[掌握JavaScript函数的柯里化](https://segmentfault.com/a/1190000006096034)

[JS进阶篇--JS中的反柯里化( uncurrying)](https://segmentfault.com/a/1190000010700130)