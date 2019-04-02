const log = console.log.bind(this)

// 正常
function add(a, b, c) {
  return a + b + c;
}

// 伪柯里化
function add2(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    }
  }
}

const result = add(1, 2, 3);
const result2 = add2(1)(2)(3);

// log('result ->', result);
// log('result2 ->', result2);

function addCurry() {
  // 将arguments 转为 数组
  var args = [].slice.apply(arguments);

  var _add = function () {
    if (!arguments.length) {
      return args.reduce(function (a, b) {
        return a + b;
      })
    } else {
      // 将 arguments 放入 args,一下三种都可以
      [].push.apply(args, arguments);
      // args = [].concat.apply(args, arguments);
      // args.push(...arguments);
      return _add;
    }
  }
  return _add;
}

// addCurry2 和 addCurry3 一样
function addCurry2() {
  var args = [].slice.apply(arguments);

  var add = function () {
    var _add = function () {
      [].push.apply(args, arguments);
      return _add;
    }
    _add.toString = function () {
      return args.reduce(function (a, b) {
        return a + b;
      })
    }
    return _add;
  }
  return add(...args);
}


function addCurry3() {
  var args = [].slice.apply(arguments);

  var _add = function () {
    [].push.apply(args, arguments);
    return _add;
  }

  _add.toString = function () {
    return args.reduce(function (a, b) {
      return a + b;
    })
  }

  return _add;
}

// 使用匿名函数 arguments.callee ，但是在严格模式下不能使用
function addCurryCallee() {
  var args = [].slice.apply(arguments);

  return function () {
    if (!arguments.length) {
      return args.reduce(function (a, b) {
        return a + b;
      })
    }
    [].push.apply(args, arguments);

    return arguments.callee;
  }
}

// 知识：
// arguments对象不是一个 Array 。它类似于Array，但除了length属性和索引元素之外没有任何Array属性。
// 例如，它没有 pop 方法。但是它可以被转换为一个真正的Array：

//  arguments.callee 是 arguments 对象的一个属性。它可以用于引用该函数的函数体内当前正在执行的函数。
//  在严格模式下，第5版 ECMAScript(ES5) 禁止使用 arguments.callee() 。
//  当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字, 要么使用一个函数声明.

// 柯里化的特点：
// 一个闭包保存参数
// 一个函数来进行递归

// 多一个执行方法
const addCurryResult1 = addCurry(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8)();
// 没有执行方法
const addCurryResult2 = addCurry2(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8);
// 没有执行方法
const addCurryResult3 = addCurry3(1, 2, 3)(1)(2)(3)(4, 5, 6)(7, 8);


// let showNumberDom1 = document.querySelector("#show-number-1");
// let showNumberDom2 = document.querySelector("#show-number-2");
// let showNumberDom3 = document.querySelector("#show-number-3");

// showNumberDom1.innerHTML = addCurryResult1;
// showNumberDom2.innerHTML = addCurryResult2;
// showNumberDom3.innerHTML = addCurryResult3;

// log('addCurryResult1 ->', addCurryResult1);
// log('addCurryResult2 ->', addCurryResult2);
// log('addCurryResult3 ->', addCurryResult3);

// 一个通用的柯里化函数 (多一个执行方法)
function commonCurry(func) {
  var args = [].slice.call(arguments, 1);
  var _func = function () {
    if (!arguments.length) {
      return func.apply(this, args);
    } else {
      [].push.apply(args, arguments);
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

  _func.toString = function () {
    return func.apply(this, args);
  }
  return _func;
}


function addFunc(...args) {
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
log('a2(10)(1,2,3)(4,5,6) + 10) ->', a2(10)(1, 2, 3)(4, 5, 6) + 10);