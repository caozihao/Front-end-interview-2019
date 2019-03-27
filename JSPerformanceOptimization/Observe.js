var model = {};
// Object.observe() 用于异步监听JavaScript对象变化的方法
// 这个接口已经被废弃并从各浏览器中移除
// chrome 36 - 52可用
Object.observe(model, function (changes) {
  changes.forEach(change => {
    console.log(change.type, change.name, change.oldValue);
  });
})

setTimeout(() => {
  model = {
    type: 'String',
    name: "张梦雪"
  }
}, 1000);