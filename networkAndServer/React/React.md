##  你真的理解setState吗？

* setState只在合成事件和钩子函数中是“异步”的，在原生事件和“setTimeout”中是同步的
* setState的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序放在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数setState(partialState, callback) 中的callback拿到更新后的结果。
* setState的批量更新优化也是建立在“异步”（合成事件，钩子函数）之上的，在原生事件和setTimeout中不会批量更新，在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其覆盖，取最后一次的执行，如果是同事setstate多个不同的值，在更新时会对其进行合并批量更新

* 钩子函数：绑定的事件

```
<button id="mes">show</button>

//js
var btn = document.getElementById('mes');

var showMes = function() {
    alert('钩子函数');
};

btn.addEventListener('click', showMes);

 //showMes 就是钩子函数
```

### 回调函数和钩子函数的区别 

* 根本上，他们都是为了捕获消息而生的，但是钩子函数在捕获消息的第一时间就会执行，而回调函数是在整个捕获过程结束时，最后一个被执行的。(绑定事件)

* 回调函数其实就是调用者把回调函数的函数指针传递给调用函数，当调用函数执行完毕时，通过函数指针来调用回调函数。
