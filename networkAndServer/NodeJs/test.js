// setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(function () {
//     console.log('promise1')
//   })
// }, 0)

// setTimeout(() => {
//   console.log('timer2')
//   Promise.resolve().then(function () {
//     console.log('promise2')
//   })
// }, 0)


// setImmediate(function A() {
//   console.log(1);
// });
// setTimeout(function B() {
//   console.log(2);
// }, 0);

// 结论：
// 如果两者都在主模块调用，那么执行先后取决于进程性能，即随机。
// 如果两者都不在主模块调用（即在一个 I/O callbcacks 中调用），那么 setImmediate 的回调永远先执行 

// 假设 如果都在主模块调用， 而我们机器的性能一般， 那么进入timer阶段时，1ms 可能已经过去了，这时 setTimeout(fn, 0) 相当于 setTimeout(fn, 1) ， timer 中的回调会首先执行
// 如果没有 1ms ， 在 check 阶段时 ， setImmediate 的回调会先执行。
// 为什么 fs.readFile 回调里设置的，setImmediate 始终先执行？因为fs.readFile的回调执行是在 poll 阶段，所以，接下来的 check 阶段会先执行 setImmediate 的回调。


// setImmediate(function A() {
//   console.log(1);
//   setImmediate(function B() {
//     console.log(2);
//     process.nextTick(function () {
//       console.log('nextTick');
//     });
//     setTimeout(function t1() {
//       console.log('t1');
//     })
//   });
//   // setTimeout(function t1() {
//   //   console.log('t1');
//   // })
// });
// setTimeout(function t2() {
//   console.log('t2');
//   setTimeout(function t3() {
//     console.log('t3');
//   });
//   setTimeout(function t4() {
//     console.log('t4');
//   });
// }, 0);

// 两种结果：

// t2
// 1
// t3
// t4
// 2
// nextTick
// t1

// 1
// t2
// 2
// nextTick
// t3
// t4
// t1

// setTimeout(() => console.log(1));
// setImmediate(() => console.log(2));

// Promise.resolve().then(() => console.log(3));
// process.nextTick(() => console.log(4));

// 4，3，1，2
// microTask会优于macroTask运行
// Node中process.nextTick比Promise更加优先

setTimeout(function () {
  console.log(1);
}, 0);
console.log(2);
process.nextTick(() => {
  console.log(3);
});
new Promise(function (resolve, rejected) {
  console.log(4);
  resolve()
}).then(res => {
  console.log(5);
})
setImmediate(function () {
  console.log(6)
})
console.log('end');

// 2，4，end,3,5,1,6