function throttle(fn, wait, immediate) {
  let timer = null
  let callNow = immediate

  return function () {
    let context = this,
      args = arguments

    if (callNow) {
      fn.apply(context, args)
      callNow = false
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

let log = function(){
  console.log('throttle')
}

window.addEventListener('resize', throttle(log,1000,false))