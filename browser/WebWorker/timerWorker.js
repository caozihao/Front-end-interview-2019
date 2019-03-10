var i = 0;

function timedCount() {
  i = i + 1;
  // 下面三种都可以
  // this.postMessage(i);
  // self.postMessage(i);
  // postMessage(i);

  setTimeout("timedCount()", 500);
}

timedCount();

// * 同源限制
// * 无法使用 document / window / alert / confirm
//   * 无法加载本地资源

// document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
// alert(666);
// console.log('window ->', window)