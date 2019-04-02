
function debounce(fn, wait, immediate) {
  let timer = null;

  return function () {
    const _this = this;
    const args = arguments;

    if (immediate && !timer) {
      fn.apply(_this, args);
    }

    if (timer) {
      window.clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, wait);

  }
}

var dom = document.getElementById("debounce1");
var log = function () {
  console.log(1);
}

dom.addEventListener('input', debounce(log, 1000))