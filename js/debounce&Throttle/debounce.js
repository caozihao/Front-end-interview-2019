let timer = null
function debounce(fn, wait, immediate) {
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


// 优化版
var debounce2 = (function () {
  let timer = null;
  return function (fn, wait, immediate) {
    let args = arguments;
    let context = this;

    if (immediate & !timer) {
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

// 作者给出的代码，但是效果有问题，难道是我调用方式有问题？
function debounce3(fn, wait, immediate) {
  let timer = null

  return function () {
    let args = arguments
    let context = this

    if (immediate && !timer) {
      fn.apply(context, args)
    }

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}


let log = function () {
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

debounce3(log, 1000, false)()
debounce3(log, 1000, false)()
debounce3(log, 1000, false)()
