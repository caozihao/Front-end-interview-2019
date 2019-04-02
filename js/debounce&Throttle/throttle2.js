function throttle(fn, wait = 1000, immediate) {
  let timer = null;
  let _immediate = immediate;
  return function () {
    const _this = this;
    const arg = arguments;

    if (_immediate) {
      fn.apply(_this, arg);
      _immediate = false;
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(_this, arg);
        timer = null;
      }, wait);
    }

  }
}

var log = function (params) {
  console.log('11');
}

window.addEventListener('resize', throttle(log))