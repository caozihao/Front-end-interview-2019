// 创建worker
// const worker = new Worker('work.js');

// 向主进程推送消息
// worker.postMessage('Hello World!');

// //监听主进程的消息 
// worker.onmessage = function (e) {
//   console.log('Received message ' + event.data);
// }

// console.log('Worker....');

//关闭主线程 
// worker.terminate();
var w;

function startWorker() {

  if (typeof (Worker) !== "undefined") {
    if (typeof (w) == "undefined") {
      w = new Worker("./timerWorker.js");
      // w = new Worker("http://www.w3school.com.cn/example/html5/demo_workers.js");
    }
    w.onmessage = function (event) {
      console.log('event ->', event);
      document.getElementById("result").innerHTML = event.data;
    };
  }
  else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
  }
}

function stopWorker() {
  w.terminate();
}