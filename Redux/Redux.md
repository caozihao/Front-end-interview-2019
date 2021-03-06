##  Redux

Redux是一个数据管理中心，可以把它理解为一个全局的data store实例，它通过一定的使用规则和限制，保证着数据的健壮性，可追溯和可预测性。它与react无关，可以独立运行于任何js环境中，从而也为同构应用提供了更好的数据同步通道

## 核心理念：
  * 单一数据源：整个应用只有唯一的状态数，也就是所有state最终维护在一个根级store中
  * 状态值只读：为了保证状态的可控性，最好的方式就是监控状态的变化，那这里就两个必要条件：
    * Redux Store中的数据无法被直接修改
    * 严格控制修改的执行
  * 纯函数：规定只能通过一个纯函数来描述修改  
  * 结构示意图：
    ```
    事件触发一个异步方法 ->
    在一个异步方法里的毁掉里调用Action->
    在reducer里面对数据进行处理，并且返回一个state->
    store改变数据
    ```

##  理念实现：
* store：全局store单例，每个Redux应用下只有一个store，它具有以下方法供使用：
  * getState:获取state
  * dispatch：触发action，更新state
  * subscribe:订阅数据变更，注册监听器
  ```
  //创建
  const store = createStore(Reducer,initStore)
  ```
  * Action：它作为一个行为载体，用于映射相应的Reducer，并且它可以成为数据的载体，将数据从应用传递至store中，是store唯一的数据源：
  ```
  // 一个普通的 Action
  const action = {
    type: 'ADD_LIST',
    item: 'list-item-1',
  }
 // 使用：
  store.dispatch(action)

  // 通常为了便于调用，会有一个 Action 创建函数 (action creater)
  funtion addList(item) {
    return const action = {
      type: 'ADD_LIST',
      item,
    }
  }
 
 // 调用就会变成:
  dispatch(addList('list-item-1'))

  ```

    *  Reducer：用于描述如何修改数据的纯函数，Action属于行为名称，而Reducer便是修改行为的实质
      ```
    // 一个常规的 Reducer
    // @param {state}: 旧数据
    // @param {action}: Action 对象
    // @returns {any}: 新数据
    const initList = []
    function ListReducer(state = initList, action) {
    	switch (action.type) {
    		case 'ADD_LIST':
    			return state.concat([action.item])
    			break
    		defalut:
    			return state
    	}
    }

  ```
  * 注意
    * 遵守数据不可变，不要去直接修改state，而是返回出一个新对象，可以使assign/copy/extend/解构等方式创建新对象
    * 默认情况下需要返回原数据，避免数据被清空
    * 最好设置初始值，便于应用的初始化及数据稳定
  * 进阶
    *   React-Redux: 结合 React 使用；
        *   <Provider>: 将 store 通过 context 传入组件中；
        *   connect：一个高阶租价，可以方便在 React 组件中使用 Redux；
            *   将store通过mapStateToProps进行筛选后使用props注入组件
            *   根据mapDispatchToProps创建方法，当组件调用时使用dispatch触发对应的action
    *   Reducer的拆分与重构：
        *   随着项目越大，如果将所有状态的 reducer 全部写在一个函数中，将会 难以维护；
        *   可以将 reducer 进行拆分，也就是 函数分解，最终再使用combineReducers()进行重构合并；
    *   异步Action：由于 Reducer 是一个严格的纯函数，因此无法在 Reducer 中进行数据的请求，需要先获取数据，再dispatch(Action)即可，下面是三种不同的异步实现:
        *   redex-thunk
        *   redux-saga
        *   redux-observable
    * React Hooks
　　　  这文章讲的不错：https://segmentfault.com/a/1190000016950339
      *   React 中通常使用 类定义 或者 函数定义 创建组件:
      *   在类定义中，我们可以使用到许多 React 特性，例如 state、 各种组件生命周期钩子等，但是在函数定义中，我们却无能为力，因此 React 16.8 版本推出了一个新功能 (React Hooks)，通过它，可以更好的在函数定义组件中使用 React 特性。
      * 好处
        * 跨组件复用: 其实 render props / HOC 也是为了复用，相比于它们，Hooks 作为官方的底层 API，最为轻量，而且改造成本小，不会影响原来的组件层次结构和传说中的嵌套地狱；
        * 类定义更为复杂:
          * 不同的生命周期会使逻辑变得分散且混乱，不易维护和管理；
          * 时刻需要关注this的指向问题；
          * 代码复用代价高，高阶组件的使用经常会使整个组件树变得臃肿；
        * 状态与UI隔离
          * 正是由于 Hooks 的特性，状态逻辑会变成更小的粒度，并且极容易被抽象成一个自定义 Hooks，组件中的状态和 UI 变得更为清晰和隔离。
      * 注意：
          * 避免在 循环/条件判断/嵌套函数 中调用 hooks，保证调用顺序的稳定，只能在最外层使用
          * 只有 函数定义组件 和 hooks 可以调用 hooks，避免在 类组件 或者 普通函数 中调用；
          * 不能在useEffect中使用useState，React 会报错提示；
          * 类组件不会被替换或废弃，不需要强制改造类组件，两种方式能并存；
      * 重要钩子
        * 状态钩子（useState）:用于定义组件的 State，其到类定义中this.state的功能；
        * 生命周期钩子（useEffect）：类定义中有许多生命周期函数，而在 React Hooks 中也提供了一个相应的函数 (useEffect)，可以看作是componentDidMount、componentDidUpdate和componentWillUnmount的结合。
          * useEffect(callback, [source])接受两个参数
            * callback: 钩子回调函数；
            * source: 设置触发条件，仅当 source 发生改变时才会触发；
            * useEffect钩子在没有传入[source]参数时，默认在每次 render 时都会优先调用上次保存的回调中返回的函数，后再重新调用回调；
          * 通过第二个参数，我们便可模拟出几个常用的生命周期:
            * componentDidMount: 传入[]时，就只会在初始化时调用一次；
              ```
              const useMount = (fn)=>useEffect(fn,[])
              ```
            * componentWillUnmount:传入[]，回调中的返回的函数也只会被最终执行一次；
              ```
              const useUnmount = (fn) => useEffect(() => fn, [])
              ```
            * mounted:可以使用 useState 封装成一个高度可复用的 mounted 状态；
             ```
             const useMounted = ()=>{
               const[mounted,setMounted] = useState(false);
               useEffect(()=>{
                 !mounted && setMounted(true);
                 return ()=>setMounted(false)
               },[]);
               return mounted
             }
             ```  
           *  componentDidUpdate:useEffect每次均会执行，其实就是派出了DidMount后即可
            ```
            const mounted = useMounted();
            useEffect(()=>{
              mounted && fn()
            })
            ```
        * 其它内置钩子:
          * useContext: 获取 context 对象
          * useReducer: 类似于 Redux 思想的实现，但其并不足以替代 Redux，可以理解成一个组件内部的 redux:
            * 并不是持久化存储，会随着组件被销毁而销毁；
            * 属于组件内部，各个组件是相互隔离的，单纯用它并无法共享数据；
            * 配合useContext的全局性，可以完成一个轻量级的 Redux；
          * useCallback：缓存回调函数，避免传入的回调每次都是新的函数实例而导致依赖组件重新渲染，具有性能优化的效果；
          * useMemo: 用于缓存传入的 props，避免依赖的组件每次都重新渲染；
          * useRef: 获取组件的真实节点；
          * useLayoutEffect:
            * DOM更新同步钩子。用法与useEffect类似，只是区别于执行时间点的不同。
            * useEffect属于异步执行，并不会等待 DOM 真正渲染后执行，而useLayoutEffect则会真正渲染后才触发；
            * 可以获取更新后的 state；
        * 自定义钩子:基于 Hooks 可以引用其它 Hooks 这个特性，我们可以编写自定义钩子，如上面的useMounted。又例如，我们需要每个页面自定义标题:
            ```
            function useTitle(title){
              useEffect(()=>{
                document.title = title;
              });
            }

            function Home(){
              const title = '我是首页';
              useTitle(title);
              return(
                <div>{title}</div>
              )
            }

            ```
## SSR

SSR，俗称 服务端渲染 (Server Side Render)，讲人话就是: 直接在服务端层获取数据，渲染出完成的 HTML 文件，直接返回给用户浏览器访问。
