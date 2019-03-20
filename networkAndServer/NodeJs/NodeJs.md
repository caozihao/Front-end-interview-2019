##  nodeJs的基本架构

Node.js是一个基于ChromeV8引擎的JavaScript，Node.js 使用高效、轻量级的事件驱动、非阻塞 I/O 模型。

nodejs的组成部分：（javascript,C++）

* Node standard library (javascript)
  * http,net,stream,fs,events,buffer
* Node bidings(C++)
  * V8
    * javascript VM
  * libuv
    * Thread pool
    * Event pool
    * Async I/O
  * C-ares
    * Async DNS
  * http_parser
  * OpenSSL
  * zlib,etc
                                       

* Node standard library(javascript):Node的标准库，也就是我们平常所说的fs,path,http,net,stream等模块

* Node bindings:是C++与javascript沟通的桥梁，封装了V8和Libuv的细节，向上层提供API

* 最后一层是支撑Node的关键

##  Libuv

Libuv是一个高性能，事件驱动的I/O库，并且提供了跨平台（如windows,*nix）的API，简单来说,Nodejs的异步，非阻塞I/O，底层实际上是Libuv实现的。

##  Event Loop

Nodejs启动的时候，他会初始化Event Loop,处理提供的输入脚本，这可能会使异步API调用。调用Timers，或者调用process.nextTick,然后开始处理事件循环

每个盒子被当作Event Loop的一个阶段

##  Event Loop Phases Overview

* timers：这个阶段执行由setTimeout()和setInterval()调度的回调
* I/O callbacks:执上一轮循环中有少数的I/Ocallback会被延迟到这一轮的这一阶段执行
* idle,prepare:只在内部使用
* poll:最为重要的阶段，执行I/O callback，在适当的条件下会阻塞在这个阶段
* check:setImmediate()的回调将会在这个阶段执行
* close callbacks:比如 socket.on('close', ...)。

event loop的每次循环都需要依次经过上述的阶段，每个阶段都有自己的callback队列，每当进入某个阶段，都会从所属的队列中取出callback来执行，当队列为空或者被执行的callback、的数量达到系统的最大数量时，进入下一个阶段，这六个阶段都执行完毕称为一轮循环。

event loop的核心代码在deps/uv/src/unix/core.c


参考文章：
https://blog.csdn.net/hhthwx/article/details/80034562
https://www.cnblogs.com/yzfdjzwl/p/8182749.html


##  浏览器和nodejs EventLoop的区别

* nodejs的eventLoop是基于libuv这个库的，而浏览器中的event loop则在html5的规范中明确定义

* libuv已经对eventLoop做出了实现，而html5规范中只是定义了浏览器中eventLoop的模型，具体实现留给了浏览器厂商

* nodejs的MacroTask分好几种，而这好几种又有不同的task queue，不同的task queue又有顺序区别，而Micro Task是穿插在每一种Macro 之间的

* nodejs evenLoop 在每个阶段完成后，而不是MacroTask任务完成后，microTask队列就会被执行，

* js event Loop 则是 同步代码（microTask）—>microTask—>macroTask


## 解析

* setTimeout / setInrval 属于timers类型
* setImmediate 属于 check类型
* socket 的 close 事件属于 close callbacks 类型；
* 其他 MacroTask 都属于 poll 类型。
* process.nextTick 本质上属于 MicroTask，但是它先于所有其他 MicroTask 执行；
* 所有 MicroTask 的执行时机，是不同类型 MacroTask 切换的时候。
* idle/prepare 仅供内部调用，我们可以忽略。
* pending callbacks 不太常见，我们也可以忽略。


## 堆栈

* 堆（heap）：是一种先进先出的数据结构
* 栈（stack）：是一种后进先出的数据结构

##  Nodejs 中的event Loop

远离刨析
1，我们写的js代码会交给v8引擎进行处理
2，解析后的代码中可能会调用Node Api，会交给Libuv库进行处理
3，libuv库负责Node Api的执行，它将不同的任务分配给不同的线程，形成Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎
4，V8引擎再将结果返回给用户


## process.nextTick

* process.nextTick()不在event loop的任何阶段执行，而是在各个阶段切换的中间执行
* process.nextTick()是node早期版本无setImmediate时的产物，node作者推荐我们尽量使用setImmediate。

##  总结

* 同一个上下文下，MicroTask会比MacroTask先运行
* 然后浏览器按照一个MacroTask任务，所有MicroTask的顺序运行，Node按照六个阶段的顺序运行，并在每个阶段后面都会运行MicroTask队列
* 同个MicroTask队列下process.tick()会优于Promise

参考文章：https://segmentfault.com/a/1190000013861128