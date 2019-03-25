##  框架：React

## Fiber

* 通过对象记录组件上需要做或者已经完成的更新，一个组件可以对应多个Fiber

React的核心流程可以分为两个部分：

* reconciliation （调度算法，也可称为render）：
  * 更新state与props;
  * 调用生命周期钩子;
  * 生成virtual dom;
  * 通过新旧vdom进行diff算法，获取vdom change
  * 确定是否需要重新渲染
* commit：
  * 如需要。则操作dom节点更新
  
#### ps 

componentWillMount componentWillReceiveProps componentWillUpdate 几个生命周期方法，在Reconciliation Phase被调用，有被打断的可能（时间用尽等情况），所以可能被多次调用。其实 shouldComponentUpdate 也可能被多次调用，只是它只返回true或者false，没有副作用，可以暂时忽略。


### React16 以前
* 对virtural dom的更新和渲染是同步的。就是当一次更新或者一次加载开始以后，diff virtual dom并且渲染的过程是一口气完成的。如果组件层级比较深，相应的堆栈也会很深，长时间占用浏览器主线程，一些类似用户输入、鼠标滚动等操作得不到响应。

### React16 Fiber
* 就是把一个任务分成很多小片，当分配给这个小片的时间用尽的时候，就检查任务列表中有没有新的、优先级更高的任务，有就做这个新任务，没有就继续做原来的任务。这种方式被叫做异步渲染(Async Rendering)。

##  为什么需要Fiber

* 问题：随着应用变得越来越庞大，整个更新渲染的过程开始变得吃力，大量的组件渲染会导致主进程长时间被占用，导致一些动画或高频操作出现卡顿和掉帧的情况。而关键点，便是 同步阻塞。在之前的调度算法中，React 需要实例化每个类组件，生成一颗组件树，使用 同步递归 的方式进行遍历渲染，而这个过程最大的问题就是无法 暂停和恢复。
 
* 解决方法：解决同步阻塞的方法，通常有两种: **异步** 与***任务分割*。而 React Fiber 便是为了实现任务分割而诞生的。
* 在 React V16 将调度算法进行了重构， 将之前的 stack reconciler 重构成新版的 fiber reconciler，变成了具有链表和指针的 单链表树遍历算法。通过指针映射，每个单元都记录着遍历当下的上一步与下一步，从而使遍历变得可以被暂停和重启。
* 这里我理解为是一种 任务分割调度算法，主要是 将原先同步更新渲染的任务分割成一个个独立的 小任务单位，根据不同的优先级，将小任务分散到浏览器的空闲时间执行，充分利用主进程的事件循环机制。
* 核心
  * Fiber这里可以具象为一个数据结构
  ```
  class Fiber {
    constructor (instance){
      thisinstance = instance;
      this.child = child;
      this.return = parent;
      this.sibling = previous;
    }
  }
  ```
    * 链表数遍历算法：通过节点保存与映射，能够随时进行停止和重启，这样便能达到实现任务分割的基本前提：
      * 首先通过不断遍历子节点，到树末尾
      * 开始通过sibling遍历兄弟节点
      * return 返回父节点，继续执行2
      * 直到 root 节点后，跳出遍历
    * 任务分割，React中的渲染更新可以分成两个阶段：
      * reconciliation阶段：vdom 的数据对比，是个适合拆分的阶段，比如对比一部分树后，先暂停执行个动画调用，待完成后再回来继续比对。
      * Commit 阶段:将 change list 更新到 dom 上，不适合拆分，因为使用 vdom 的意义就是为了节省传说中最耗时的 dom 操作，把所有操作一次性更新，如果在这里又拆分，那不是又懵了么。
    * 分散执行：任务分割后，就可以把小任务单元分散到浏览器的空闲期间去排队执行，而实现的关键是两个新API，requestIdleCallback 与 requestAnimationFrame
      * 低优先级的任务交给requestIdleCallback处理，这是个浏览器提供的事件循环空闲期的回调函数，需要 pollyfill，而且拥有 deadline 参数，限制执行事件，以继续切分任务；
      * 高优先级的任务交给requestAnimationFrame处理；
    ```
      //类似于这样的方式
      requestIdleCallBack((deadline)=>{
         // 当有空闲时间时，我们执行一个组件渲染；
         // 把任务塞到一个个碎片时间中去；
         while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && nextComponent) {
            nextComponent = performWork(nextComponent);
         }
      })

    ```
    * 优先级策略：文本框输入 > 本次调度结束需完成的任务 > 动画过渡 > 交互反馈 > 数据更新 > 不会显示但以防将来会显示的任务

## Tips:

> Fiber其实可以算是一种编程思想，在其它语言中也有许多应用(Ruby Fiber)。当遇到进程阻塞的问题时，任务分隔，异步调用，缓存策略是三个显著的解决思路

##  生命周期

在新版本中，React 官方对生命周期有了新的变动建议:

* 使用getDerivedStateFromProps 替换componentWillMount；
* 使用getSnapshotBeforeUpdate替换componentWillUpdate；
* 避免使用componentWillReceiveProps；
  
其实该变动的原因，正是由于上述提到的 Fiber。首先，从上面我们知道 React 可以分成 reconciliation 与 commit 两个阶段，对应的生命周期如下:

##  reconciliation

* componentWillMount
* componentWillReveiveProps
* shouldComponentUpdate
* componentWillUpdate
  
##  commit

* componentDidMount
* componentDidUpdate
* componentWillUnmount

在Fiber中，reconciliation阶段进行了任务分割，涉及到暂停和重启，因此可能会导致reconciliation中的生命周期函数在一次更新渲染中被多次调用的情况，产生一些意外错误

```
class Component extends React.Component {
  // 替换 `componentWillReceiveProps` ，
  // 初始化和 update 时被调用
  // 静态函数，无法使用 this
   static getDerivedStateFromProps(nextProps, prevState) {}

  // 判断是否需要更新组件
  // 可以用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}

  // 组件被挂载后触发
  componentDidMount() {}
  
  // 替换 componentWillUpdate
  // 可以在更新之前获取最新 dom 数据
  // 调用是在render之后，mounted 之前
  getSnapshotBeforeUpdate() {}
  
  // 组件更新后调用
  componentDidUpdate() {}
  
  // 组件即将销毁
  componentWillUnmount() {}
  
  // 组件已销毁
  componentDidUnMount() {}
}

```
##  使用建议：

  * 在constructor初始化 state；
  * 在componentDidMount中进行事件监听，并在componentWillUnmount中解绑事件；
  * 在componentDidMount中进行数据的请求，而不是在componentWillMount；
  * 需要根据 props 更新 state 时，使用getDerivedStateFromProps(nextProps, prevState)；
    * 旧 props 需要自己存储，以便比较；
  
  ```
  public static getDerivedStateFromProps(nextProps, prevState) {
      // 当新 props 中的 data 发生变化时，同步更新到 state 上
      if (nextProps.data !== prevState.data) {
        return {
          data: nextProps.data
        }
      } else {
        return null1
      }
    }
  ```
    * 可以在componentDidUpdate监听 props 或者 state 的变化，例如:
  ```
  componentDidUpdate(prevProps) {
    // 当 id 发生变化时，重新获取数据
    if (this.props.id !== prevProps.id) {
      this.fetchData(this.props.id);
    }
  }
  ```
      * 在componentDidUpdate使用setState时，必须加条件，否则将进入死循环；
      * getSnapshotBeforeUpdate(prevProps, prevState)可以在更新之前获取最新的渲染数据，它的调用是在 render 之后， mounted 之前；
      * shouldComponentUpdate: 默认每次调用setState，一定会最终走到 diff 阶段，但可以通过shouldComponentUpdate的生命钩子返回false来直接阻止后面的逻辑执行，通常是用于做条件渲染，优化渲染的性能。

##  setState

在了解setState之前，我们先来简单了解下 React 一个包装结构: Transaction:

* 事务
  *  是 React 中的一个调用结构，用于包装一个方法，结构为: initialize - perform(method) - close。通过事务，可以统一管理一个方法的开始与结束；处于事务流中，表示进程正在执行一些操作；
  *  setState: React 中用于修改状态，更新视图。它具有以下特点:
  * 异步与同步: setState并不是单纯的异步或同步，这其实与调用时的环境相关:
    * 在 合成事件 和 生命周期钩子(除 componentDidUpdate) 中，setState是"异步"的；
      *  原因: 因为在setState的实现中，有一个判断: 当更新策略正在事务流的执行中时，该组件更新会被推入dirtyComponents队列中等待执行；否则，开始执行batchedUpdates队列更新；
         *  在生命周期钩子调用中，更新策略都处于更新之前，组件仍处于事务流中，而componentDidUpdate是在更新之后，此时组件已经不在事务流中了，因此则会同步执行；在生命周期钩子调用中，更新策略都处于更新之前，组件仍处于事务流中，而componentDidUpdate是在更新之后，此时组件已经不在事务流中了，因此则会同步执行；
         *  在合成事件中，React 是基于**事务流完成的事件委托机制** 实现，也是处于事务流中；
      * 问题: 无法在setState后马上从this.state上获取更新后的值。
      * 解决: 如果需要马上同步去获取新值，setState其实是可以传入第二个参数的。setState(updater, callback)，在回调中即可获取最新值；
    * 在 原生事件 和 setTimeout 中，setState是同步的，可以马上获取更新后的值；
      * 原因: 原生事件是浏览器本身的实现，与事务流无关，自然是同步(在代码中会因为事件循环的机制而直接进入同步的分支),而setTimeout是放置于定时器线程中延后执行，此时事务流已结束，因此也是同步；
  * 批量更新: 在 合成事件 和 生命周期钩子 中，setState更新队列时，存储的是 合并状态(Object.assign)。因此前面设置的 key 值会被后面所覆盖，最终只会执行一次更新；
  * 函数式: 由于 Fiber 及 合并 的问题，官方推荐可以传入 函数 的形式。setState(fn)，在fn中返回新的state对象即可，例如this.setState((state, props) => newState)；
    * 使用函数式：可以用于避免setState的批量更新的逻辑，传入的函数将会被顺序调用
  * 注意事项：
    * setState 合并，在 合成事件 和 生命周期钩子 中多次连续调用会被优化为一次（在代码中的具体表现是会先创建一个updateQueue，通过firstUpdate，lastUpdate，lastUpdate.next去维护一个更新的队列，在最终的performWork 中，相同的key会被覆盖，只会对最后一次的setState进行更新）
    * 当组件已被销毁，如果再次调用setState,React会报错警告，通常有两种解决办法：
      * 将数据挂载到外部，通过props传入，如放到Redux或父级中
      *  在组件内部维护一个状态量 (isUnmounted)，componentWillUnmount中标记为 true，在setState前进行判断；

##  HOC (高阶组件)

* HOC(Higher Order Componennt) 是在 React 机制下社区形成的一种组件模式，在很多第三方开源库中表现强大。
* 简述：
  * 高阶组件不是组件，是 增强函数，可以输入一个元组件，返回出一个新的增强组件；
  * 高阶组件的主要作用是 代码复用，操作 状态和参数；
* 用法：
  * 属性代理（Props Proxy），返回出一个组件，基于被包裹组件进行功能增强：
    * 默认参数：可以为组件包裹一层默认参数
    * 提取状态: 可以通过 props 将被包裹组件中的 state 依赖外层，例如用于转换受控组件
    * 包裹组件: 可以为被包裹元素进行一层包装
    * 反向继承 (Inheritance Inversion): 返回出一个组件，继承于被包裹组件
    * 渲染劫持 (Render Highjacking)
      *  条件渲染: 根据条件，渲染不同的组件
      *  可以直接修改被包裹组件渲染出的 React 元素树
   *  操作状态 (Operate State): 可以直接通过 this.state 获取到被包裹组件的状态，并进行操作。但这样的操作容易使 state 变得难以追踪，不易维护，谨慎使用。
   *  应用场景
    *  权限控制，通过抽象逻辑，统一对页面进行权限判断，按不同的条件进行页面渲染:
    *  性能监控，包裹组件的生命周期，进行统一埋点
    *  代码复用，可以将重复的逻辑进行抽象
  *  使用注意
     *  纯函数：增强函数应为纯函数，避免侵入修改元组件；
     *  避免用法污染：理想状态下，应透传元组件的无关参数与事件，尽量保证用法不变；
     *  命名空间：为 HOC 增加特异性的组件名称，这样能便于开发调试和查找问题；
     *  引用传递：如果需要传递元组件的 refs 引用，可以使用React.forwardRef
     *  静态方法：元组件上的静态方法并无法被自动传出，会导致业务层无法调用；解决:
        *  函数导出
        *  静态方法赋值
     *  重新渲染： 由于增强函数每次调用是返回一个新组件，因此如果在 Render 中使用增强函数，就会导致每次都重新渲染整个HOC，而且之前的状态会丢失；





##  参考文章:
 
https://github.com/qiqingjin/blog/tree/master/React_Redux
https://juejin.im/post/5c92f499f265da612647b754#comment (自己实现一个Fiber)