
setImmediate(function () {
  console.log('setImmediate');
}, 0)

setTimeout(function(){
  console.log('setTimeout');
},0)

process.nextTick(function(){
  console.log('process.nextTick');
})

console.log('normal')