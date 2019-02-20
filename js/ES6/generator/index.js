// yield中使用延时

// 第一种方法

// console.log('启动...')
// function* f() {
//   console.log('执行了！')
// }

// var generator = f();

// setTimeout(function () {
//   generator.next()
// }, 2000);


// 第二种方法

const delay = (ms) => new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });

function* baum() {
  yield delay(1000).then(() => console.log(1))
  yield console.log(2)
  yield delay(1000).then(() => console.log(3))
  yield console.log(4)
}

console.log('任务开始...')
const b = baum();
// b.next();  //{ value: Promise { <pending> }, done: false }
// b.next(); 
// b.next();  //{ value: Promise { <pending> }, done: false }
// b.next();

// 上面输出2,4,1秒后输出1,3

// 要使顺序输出1，2，3，4

b.next().value.then(()=>{
  b.next();
  b.next().value.then(()=>{
    b.next();
  })
})


// 优化后

function himmel(gen){
  const item =  gen.next();
  if(item.done){
    return item.value
  }

  const {value,done} = item;
  if(value instanceof Promise){
    value.then(()=>{
      himmel(gen)
    })
  }else{
    himmel(gen)
  }
}

himmel(b);

// 参考文章： https://www.jianshu.com/p/c1b8b89c4905

 
// dva 里使用这种方法
// *submitKYCForm(action, { call, put }) {
//     const delay = (ms) => new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//     yield call(delay, 5000);
//     yield put({ type: 'refreshAccountInfo' });
// }