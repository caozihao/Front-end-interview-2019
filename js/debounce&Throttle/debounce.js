
// 防抖 (debounce): 
// 将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可

let timer = null
function debounceFunc(fn, wait, immediate) {
  if (immediate && !timer) {
    fn()
  }

  //如果有新的操作触发，就更新定时器，直到最后一个
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(function () {
    fn()
  }, wait)
}


// 优化版 匿名函数，直接调用使用
var debounceFunc2 = (function () {
  let timer = null;
  return function (fn, wait, immediate) {
    let args = arguments;
    let context = this;

    if (immediate && !timer) {
      fn.apply(context, args)
    }
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(function () {
      fn.apply(context, args)
    }, wait)
  }
})()

// 作者给出的代码，使用 window.addEventListener 来调用
function debounceFunc3(fn, wait, immediate ) {
  let timer = null

  return function () {
    let args = arguments;
    let context = this;

    // 之前写错了，&&写成了& 
    // 复习一下&：
    // 1，&是表示位的与运算
    // 2，把左右两边的数字转化为二进制，然后每一位分别进行比较，如果相等就为1，不相等即为0
    // 3，同时&具有强制转换的功能，把false,true转换成了0和1进行比较。而0又表示false的意思，所以带有false的都挂掉了，偶尔也可以当做逻辑与来使用
    if (timer) clearTimeout(timer)
   
    if (immediate  && !timer) {
      // 使用apply 确保 在 fn 函数里的 this 指向的是 input对象(不然就指向 window 了)
      fn.apply(context, args)
      // fn()
    }
   
    timer = setTimeout(() => {
      fn.apply(context, args)
      // fn()
    }, wait)
  }
}

// 加上取消按钮
function debounceFunc4(fn, wait, immediate) {
  let timer = null;
  
  let debounce = function () {
    let args = arguments;
    let context = this;
    if (timer) clearTimeout(timer);

    if (immediate && !timer) {
      fn.apply(context, args);
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait)
  }

  debounce.cancel = function(){
    clearTimeout(timer);
    timer = null;
  }

  return debounce;
}



let log = function () {
  console.log('this ->', this);
  console.log('debounce')
  console.log('arguments ->', arguments)
}

//测试，最终都应该只输出一个debounce
// debounce(log,1000,false)
// debounce(log,1000,false)
// debounce(log,1000,false)

// debounce2(log,1000,false)
// debounce2(log,1000,false)
// debounce2(log,1000,false)

// debounce3(log, 1000, false)()
// debounce3(log, 1000, false)()
// debounce3(log, 1000, false)()

var debounce1 = document.getElementById('debounce1');
var debounce2 = document.getElementById('debounce2');
var debounce3 = document.getElementById('debounce3');
var debounce4 = document.getElementById('debounce4');
var cancelDebounce = document.getElementById('cancel-debounce');

// debounce1.addEventListener('input', debounceFunc(log, 1000, false))
// debounce2.addEventListener('input', debounceFunc2(log, 1000, false))
debounce3.addEventListener('input', debounceFunc3(log, 1000, false))

let debounceObj = debounceFunc4(log, 2000, true);

debounce4.addEventListener('input', debounceObj)
cancelDebounce.addEventListener('click', function(){
  debounceObj.cancel()
})


// 参考文章 https://github.com/mqyqingfeng/Blog/issues/22