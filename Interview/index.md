##  石头，剪刀，布

* Vue的特点

* Vue和React的相同点和区别



##  rcrai
* 有这场一个场景，父组件a和子组件b；问当初始化和更新的时候，组件的生命周期是怎么样的？

  ```
    初始化：

    A:componentWillMount
    B:componentWillMount
    B:componentDidMount
    A:componentDidMount

    更新

    A:componentWillUpdate
    B:componentWillReceiveProps
    B:componentWIllUpdate
    B:componentDidUpdate
    A:componentDidUpdate
  ```
* 笔试题
  ```
    // 题目，求会打印出什么
    var a = {n:1};  
    var b = a; 
    a.x = a = {n:2};  
   
    console.log(a.x);// --> ？  
    console.log(b.x);// --> ？
    
    //答案
    // a.x = undefined；
    // b.x = {n:2}；

  ```
  思路
  * a 是一个对象，所以 b = a, b是指向a的引用
  * .优先级高于 = ，所以先执行 a.x；此时a和b都指向了{n:1,x:undefined}
  * 结下来执行 a = {n:2},此时，a变量的指针指向了一个新的内存区,变成了新对象{n:2},a变量脱离了对内存区{n: 1}的引用关系
  * a.x = a => b.x = a> b.x = {n:2} 


* 笔试题
  ```
  // 写一个去重的方法，最后输出结果是 [{key:1},{key:2}]
  var arr = [{key:1},{key:2},{key:1}]

  // 方法一
  var obj = {};
  var newArr = [];
  for(let item of arr){
      if(!obj[item['key']]){
          obj[item['key']] = true;
          newArr.push(item);
      }
  }

  console.log('newArr ->',newArr);

  // 方法二
  var newArr2 = arr.reduce(function(totalArr,item){
      !obj2[item.key] ?  obj2[item.key] = true && totalArr.push(item): '';
      return totalArr;
  },[])

  console.log('newArr2 ->',newArr2);

  ```
* 说一下高阶组件中的反向继承：    
  定义：返回出一个组件，继承于被包裹组件
  用途：渲染劫持 / 条件渲染: 根据条件，渲染不同的组件

  应用场景:

  * 权限控制，通过抽象逻辑，统一对页面进行权限判断，按不同的条件进行页面渲染。

  * 性能监控，包裹组件的生命周期，进行统一埋点。

  * 代码复用，可以将重复的逻辑进行抽象。

