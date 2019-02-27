
// 每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，
// 通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms执行一次即可。

function throttle(fn, wait, immediate) {
  let timer = null

  return function () {
    let context = this;

    if (immediate && !timer) {
      fn.apply(context, arguments)
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, arguments)
        timer = null
      }, wait)
    }
  }
}

let log = function(){
  console.log('throttle')
  console.log('arguments ->', arguments);
}

window.addEventListener('resize', throttle(log,500,true))