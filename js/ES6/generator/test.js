const delay2 = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

function* test() {
  yield delay2(1000).then(() => console.log(1))
  yield console.log(2)
  yield delay2(1000).then(() => console.log(3))
  yield console.log(4)
}

const b = test();
b.next();
b.next();
b.next();
b.next();