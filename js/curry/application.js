// 事件监听

// 正常
var addEvent = function(ele,type,fn){
  if(window.addEventListener){
    ele.addEventListener(type, fn);
  } else if (window.attachEvent){
    ele.attachEvent("on" + type, fn)
  }
}

// 柯里化
var addEventCurry = function(){
  if(window.addEventListener){
    return function (ele, type, fn){
      ele.addEventListener(type, fn);
    }
  } else if (window.attachEvent){
    return function (ele, type, fn){
      ele.attachEvent("on" + type, fn)
    }
  }
}

// 防抖
function debounce(fn, wait, immediate){
  var timer = null;
  return function (){
    let _self = this;

    if(timer){
      clearTimeout(timer)
    }

    if (immediate && timer){
      fn.apply(this,arguments)
    }

    timer = setTimeout(function(){
      fn.apply(_self,arguments)
    },wait)
  }
}

//节流
function throttle(fn, wait, immediate){
  var timer = null;
  return function (){
    let _self = this;
    if (immediate && timer){
      fn.apply(this, arguments)
    }

    if (!timer){
      timer = setTimeout(function(){
        fn.apply(_self, arguments)
        timer = null;
      },wait)
    }
  }
} 

// bind事件
var EventUtil = {
  addHandler: (function () {
    if (window.addEventListener) {
      return function (element, type, handler) {
        element.addEventListener(type, handler, false);
      }
    } else if (window.attachEvent) {
      return function (element, type, handler) {
        element.attachEvent("on" + type, handler);
      }
    } else {
      return function (element, type, handler) {
        element["on" + type] = handler;
      }
    }
  })()
}
//书写一个执行方法，并且把方法放在对象中
var handler = {
  message: "这是小明",
  handlerClick: function (event) {
    console.log('this ->', this);
    console.log('event.type ->', event.type);
  }
}

function bind(fn, context) {
  return function () {
    return fn.apply(context, arguments)
  }
}

// console.log('handler ->', handler);
// EventUtil.addHandler(document.getElementById('btn'), "click", bind(handler.handlerClick, handler))
EventUtil.addHandler(document.getElementById('btn'), "click", handler.handlerClick.bind(handler))