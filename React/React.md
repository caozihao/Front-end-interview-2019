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

## diff算法 (待补充)

  *  传统diff算法：利用循环递归的方式对所有节点依次对比，算法的复杂度是O(n3)，其中n为节点总数，所以在一个大项目中性能将会存在极大的瓶颈。
  *  react-diff
     *  作用：计算Virtual DOM中真正变化的部分，并只针对该部分进行原生DOM操作，而非重新渲染整个页面
     *  策略：对传统diff算法的优化主要基于三个策略，这些策略最后都是对比vdom，算法复杂度是O(n)总结如下：
        *  DOM结构发生改变：直接卸载并重新creat
        *  DOM结构一样：不会卸载，但是会update
        *  所有同一层级的子节点， 他们都可以通过key来区分，同时遵循1，2两点
    * Key
      * 没有key也不会影响程序执行的正确性，这个key的存在与否只会影响diff算法的复杂度，如果不加key，diff算法就会以暴力的方式去根据一二的策略更新，但是你加了key,diff算法会引入一些另外的操作
      * 不要用index或者随机数作为key的值，如果你的数据能够确保唯一性，就用数据本身作为key
      * 如果不是同一个父节点，那么key相同也没关系
    * tree-diff
      * React通过updateDepth对virtual DOM树进行层级控制
      * 对树分层比较，两颗树只对同一层次节点进行比较，如果该节点不存在时，则该节点及子节点会被完全删除，不会再进一步比较
      * 只需遍历一次，就能完成整棵DOM数的比较
      * 如果DOM节点出现了跨层级操作，diif会咋办？
        * diff只简单考虑同层级的节点位置变换，如果是跨层级，就创建节点和删除节点
    * component-diff
      * 同一类型的两个组件，按原策略（层级比较）继续比较Virtual DOM树即可
      * 同一类型的两个组件，组件A变化为组件B时，可能Virtual DOM没有任何变化，如果知道这点（变换的过程中，Virtual DOM没有改变），可节省大量计算时间，所以 用户 可以通过 shouldComponentUpdate() 来判断是否需要 判断计算。
      * 不同类型的组件，将一个（将被改变的）组件判断为dirty component（脏组件），从而替换 整个组件的所有节点。
    * element-diff
      * 当节点处于同一层级时，diff提供三种节点操作：删除，插入，移动
    * 新旧集合中存在相同节点但位置不同时，如何移动节点：
      * 在新集合中取得一个元素，判断旧节点中是否存在相同的元素，如果存在，就去判断是否移动该元素
      * 移动元素的条件就是判断Index < lasIndex:
        * lastIndex初始值为0，取max(index,lastIndex)的值，index值为在旧集合中的index。
        * 到index为最后一个元素的时候，diif操作结束
    * 新集合中有新加入的节点，旧集合中有删除的节点
      * 新集合对比后，再对旧集合遍历，判断新集合没有，但旧集合有的元素，发现D，删除D，diff操作结束
    * diff不足与待优化的地方：
      * 由于移动条件是 判断Index < lasIndex，且 lasIndex是取max(index,lastIndex)，所以当一开始lastIndex为最大时，后面的所有元素都要移动
      * 因此在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，会影响React的渲染性能

参考文章：
https://www.jianshu.com/p/fa4ca1fed4cf （浅谈React diff算法与key）
https://www.jianshu.com/p/3ba0822018cf（React之diff算法）


## ps 

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

## SSR

SSR，俗称 服务端渲染 (Server Side Render)，讲人话就是: 直接在服务端层获取数据，渲染出完成的 HTML 文件，直接返回给用户浏览器访问。
* 前后端分离：前端与服务端隔离，前端动态获取数据，渲染页面。
* 痛点
 * 首屏渲染性能瓶颈
   * 空白延迟: HTML下载时间 + JS下载/执行时间 + 请求时间 + 渲染时间。在这段时间内，页面处于空白的状态。
 * SEO 问题: 由于页面初始状态为空，因此爬虫无法获取页面中任何有效数据，因此对搜索引擎不友好。
   * 虽然一直有在提动态渲染爬虫的技术，不过据我了解，大部分国内搜索引擎仍然是没有实现。

最初的服务端渲染，便没有这些问题。但我们不能返璞归真，既要保证现有的前端独立的开发模式，又要由服务端渲染，因此我们使用 React SSR。

* 原理：
  * Node服务：让前后端运行同一套代码成为可能
  * Virtual Dom：让前端代码脱离浏览器运行
*  条件: Node 中间层、 React / Vue 等框架。 结构大概如下:略
*  开发流程：React + Router + Redux + Koa
   *  同个项目中，搭建前后端部分，常规结构
      *  build
      *  public 
         *  src
            *  client
            *  server
   * server中使用Koa路由监听页面访问
   * 通过访问url匹配前端页面路由
   * 通过页面路由的配置进行 数据获取。通常可以在页面路由中增加 SSR 相关的静态配置，用于抽象逻辑，可以保证服务端逻辑的通用性，如:
     * 获取数据通常有两种情况：
       * 中间层也使用 http 获取数据，则此时 fetch 方法可前后端共享；
       * 中间层并不使用 http，是通过一些 内部调用，例如 Rpc 或 直接读数据库 等，此时也可以直接由服务端调用对应的方法获取数据。通常，这里需要在 ssrConfig 中配置特异性的信息，用于匹配对应的数据获取方法。
       * 创建Redux store，并将数据dispatch到里面
       * 注入Store，调用renderToString，将React Virtual Dom渲染成字符串
       * 将AppString包装成完整的html文件格式
       * 此时，已经能生成完整的html文件，但只是个纯静态的页面，没有样式和交互，接下来，要插入JS与CSS，可以通过访问前端打包后生成的asset-manifest.json文件来获取相应的文件路径，并同样注入到Html中引用
       * 进行数据脱水，为了把服务端获取的数据同步到前端，主要是将数据序列化后，插入到Html中，返回给前端。
       * 有特别的两点:
         * 使用了serialize-javascript序列化 store， 替代了JSON.stringify，保证数据的安全性，避免代码注入和 XSS 攻击；
         * 使用 json 进行传输，可以获得更快的加载速度；
       * client层数据吸水：初始化 store 时，以脱水后的数据为初始化数据，同步创建 store。

##  函数式编程 
  函数式编程是一种编程范式，你可以理解为一种软件架构的思维模式  ，它有着独立一套理论基础与边界法则，追求的是更简洁，可预测，高复用，易测试。其实在现有的众多知名库中，都蕴含着丰富的函数式编程思想，如React/Redux等。
    * 常见的编程范式
      * 命令式编程（过程化编程）：更关心解决问题的步骤，一步步以语言的形式告诉计算机做什么
      * 事件驱动编程：事件订阅与触发，被广泛用于GUI的编程设计中
      * 面向对象编程：基于类，对象与方法的设计模式，拥有三个基础概念：封装性，继承性，多态性
      * 函数式编程 
        * 换成一种更高端的说法，面向数据编程
    * 函数式编程的理念：
      * 纯函数（确定性函数）：是函数式编程的基础，可以使程序变得灵活，高度可拓展，可维护
        * 优势：
          * 完全独立，与外部解耦
          * 高度可复用，在任意上下文，任意时间线上，都可执行并且保证结果稳定
          * 可测试性极强
        * 条件
          * 不修改参数
          * 不依赖，不修改任何函数外部的数据
          * 完全可控，参数一样，返回值一定一样，例如函数不能包含new Date()或者Math.random()等这不可控因素
          * 引用透明
        * 我们常用到的许多API或者工具函数，他们都具有着纯函数的特点，如split / join / map
    * 复合函数：将多个函数进行组合后调用，可以实现将一个个函数单元进行组合，达成最后的目标
      * 扁平化嵌套：首先，我们一定能想到组合函数最简单的操作就是 包裹，因为在 JS 中，函数也可以当做参数:
          * f(g(k(x))): 嵌套地狱，可读性低，当函数复杂后，容易让人一脸懵
          * 理想的做法: xxx(f, g, k)(x)
        * 结果传递：如果想实现上面的方式，那也就是xxx函数要实现的便是: 执行结果在各个函数之间的执行传递；
          * 这时我们就能想到一个原生提供的数组方法: reduce，它可以按数组的顺序依次执行，传递执行结果；
          * 所以我们就能够实现一个方法pipe，用于函数组合:
            ```
            const pipe = (...fs) => p =>fs.reduce((v,f)=>f(v),p)
            ```
        * 使用：实现一个驼峰命名转中划线命名的功能
        * 好处：
          * 隐藏中间参数，不需要临时变量，避免了这个环节的出错几率
          * 只需关注每个纯函数单元的稳定，不需要关注命名，传递，调用等
          * 可复用性强，任何一个函数单元都可被任意服用和组合
          * 可拓展性强，成本低，例如现在价格需求，要查看每个环节的输出
        * 一些工具纯函数可直接引用lodash/fp，例如curry/map/split等，并不需要像我们上面这样实现
      * 数据不可变性：这是一种数据理念，也是函数式编程中的核心理念之一
          * 倡导：一个对象在被创建后便不会再被修改，当需要改变值时，是返回一个全新的对象，而不是直接在原对象上修改
          * 目的：保证数据的稳定性，避免依赖的数据被未知的修改，导致了自身的执行异常，能有效提高可控性与稳定性
          * 并不等同于const,使用const创建一个对象后，它的属性仍然可以被修改
          * 更类似于Object.freeze:冻结对象，但freeze仍无法保证深层的属性不被篡改
          * immutable.js，js中的数据不可变库，它保证了数据不可变，在Ract生态中被广泛应用，大大提升了性能与稳定性
            * trie数据结构
              * 一种数据结构，能有效的深度冻结对象，保证其不可变
              * 结构共享:可以共用不可变对象的内存引用地址，减少内存占用，提高数据操作性能
        * 避免不同函数之间的状态共享，数据的传递使用复制或全新对象，遵守数据不可变原则。
        * 避免从函数内部改变外部状态，例如改变了全局作用域或父级作用域上的变量值，可能会导致其他单位错误
        * 避免在单元函数内部执行一些副作用，应该将这些操作抽离成更独立的工具单元
          * 日志输出
          * 读写文件
          * 网络请求
          * 调用外部进程
          * 调用有副作用的函数 
      * 高阶函数： 是指以函数为参数 ，返回一个新的增强函数的一类函数，通常用于
        * 将逻辑行为进行隔离抽象，便于快速服用，如处理数据，兼容性等
        * 函数组合，将一系列单元函数列表组合成功能更强大的函数
        * 函数增强，快速地拓展函数功能
      * 函数式编程的好处
        * 函数副作用小，所有函数独立存在，没有任何耦合，复用性极高
        * 不关注执行时间，执行顺序，参数，命名等，能专注于数据的流动与处理，能有效提高稳定性与健壮性
        * 追求单元化，粒度化，使其重构和改造成本降低，可维护，可拓展性较好
        * 更易于做单元测试
##  总结

    * 函数式编程其实是一种编程思想，它追求更细的粒度，将应用拆分成一组组极小的单元函数，组合调用操作数据流
    * 它提倡着纯函数/函数复合/数据不可变，谨慎对待函数内的状态共享/依赖外部/副作用
    * 编程范式之间，其实并不矛盾，各有各自的优劣势
    * 理解和学习它们的理念与优势，合理的设计融合，将优秀的软件编程思想用于提升我们应用
    * 所有设计思想，最终的目标一定是使我们的应用更加解耦颗粒化，易拓展，易测试，高复用，开发更为高效和安全


##  参考文章:
 
https://github.com/qiqingjin/blog/tree/master/React_Redux (作者实现的React16的dem)
https://juejin.im/post/5c92f499f265da612647b754#comment ((中篇)中高级前端大厂面试秘籍，寒冬中为您保驾护航，直通大厂)
https://blog.csdn.net/qiqingjin/article/details/80118669 (React-从源码分析React Fiber工作原理)


##  React 实例化生命周期

1,getDefaultProps()

2,getInitialState()

3,componentWillMount()

4,render()

5,componentDidMount()

## 更新触发5个钩子函数

1,componentWillReceivePorps()

2,shouldComponentUpdate()

3,componentWillUpdate()

4,render()

5,componentDidUpdate()

6,componentWillUnmount()
