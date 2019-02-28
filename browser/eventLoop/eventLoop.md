##  浏览器内核常驻线程

* GUI渲染线程
* JS引擎线程
* 事件触发线程
* 定时器线程
* http请求线程

##  JS引擎线程

####  JavaScript 引擎是单线程

每次只能执行一项任务，其他任务都得按照顺序排队等待被执行，只有当前的任务执行完成之后才会往下执行下一个任务

####  JavaScript 事件循环机制

JavaScript 事件循环机制分为**浏览器**和 **Node 事件循环机制**，两者的实现技术不一样，浏览器 Event Loop 是 HTML 中定义的规范，Node Event Loop 是由 libuv 库实现。这里主要讲的是浏览器部分

Javascript 有一个 **main thread 主线程**和 **call-stack 调用栈(执行栈)**，所有的任务都会被放到调用栈等待主线程执行。

* JS 调用栈
  * JS 调用栈是一种**后进先出**的数据结构。当函数被调用时，会被添加到栈中的顶部，执行完成之后就从栈顶部移出该函数，直到栈内被清空。
* 同步任务、异步任务
  *   JavaScript 单线程中的任务分为**同步任务**和**异步任务**。同步任务会在调用栈中按照顺序排队等待主线程执行，异步任务则会在异步有了结果后将注册的回调函数添加到任务队列(消息队列)中等待主线程空闲的时候，也就是栈内被清空的时候，被读取到栈中等待主线程执行。任务队列是**先进先出**的数据结构。
*  Event Loop
  *   调用栈中的同步任务都执行完毕，栈内被清空了，就代表主线程空闲了，这个时候就会去任务队列中按照顺序读取一个任务放入到栈中执行。每次栈内被清空，都会去读取任务队列有没有任务，有就读取执行，一直循环读取-执行的操作，就形成了事件循环。
*  定时器
  *   定时器会开启一条定时器触发线程来触发计时，定时器会在等待了指定的时间后将事件放入到任务队列中等待读取到主线程执行。
  *   定时器指定的延时毫秒数**其实并不准确**，因为定时器只是在到了指定的时间时将事件放入到任务队列中，必须要**等到**同步的任务和现有的任务队列中的事件全部执行完成之后，才会去读取定时器的事件到主线程执行，中间可能会存在耗时比较久的任务，那么就不可能保证在指定的时间执行    
*  宏任务(macro-task)、微任务(micro-task)
   *  macro-task包括:
      *  script(整体代码)
      *  setTimeout
      *  setInterval
      *  setImmediate
      *  I/O
      *  UI rendering。
   *  micro-task包括：
      *  process.nextTick （nodeJs）
      *  Promises
      *  Object.observe
      *  MutationObserver  

[JS浏览器事件循环机制](https://segmentfault.com/a/1190000015559210)

---

####  Node.js中nextTick、setTimeout、setImmediate的区别

setImmediate：setimmediat在poll阶段空闲时生效

setTImeout(): 当时间达到后，有机会就执行

nextTick()在eventloop当前阶段生效，即当前操作执行完，就执行nextTick。执行后，再继续evnetLoop

##  结论

process.nextTick()，效率最高，消费资源小，但会阻塞CPU的后续调用； （**idle观察者**）（**用数组**）
setImmediate()，消耗的资源小，也不会造成阻塞，但效率也是最低的。（IE10 + ）（**check观察者**）(**用链表**)
setTimeout()，精确度不高，可能有延迟执行的情况发生，且因为动用了红黑树，所以消耗资源大； （**check观察者**（**采用红黑树**）

####  idle观察者 > I/O观察者 > check观察者。

####  执行顺序

 process.nextTick() > setTimeout > setImmediate 


#### 使用nextTick的主要原因:
允许处理错误，清理不需要的资源，或，在事件循环结束前再次尝试发送请求
让回调函数，在调用栈unwound（已清除)后，且事件循环继续前执行。


[查看图文容易理解](https://blog.csdn.net/hkh_1012/article/details/53453138)