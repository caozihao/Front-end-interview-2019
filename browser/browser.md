##  2. 浏览器架构
* 用户界面
* 主进程
* 内核
    * js渲染引擎
      * JS执行栈（后进先出）
    * 事件触发线程
      * 消息队列
        * 宏任务
        * 微任务
    * 定时器线程
    * 网络异步线程
    * I/O线程

##  3. 浏览器下事件循环(Event Loop)
  事件循环是指：执行一个宏任务，然后执行清空微任务列表，循环再执行宏任务。在清微任务列表  

* 微任务：microtask(jobs):promise/process.nextTick/Object.observe
* 宏任务:macrotask(tasks):setTimeout/setImmediate/setInterval/I/O/UI rending/script(整体代码)

##  4.从输入url到展示的过程

* DNS解析
* TCP三次握手
* 发送请求，分析url，设置请求报文（头，主题）
* 服务器返回请求的文件（html）
* 浏览器渲染
  * HTML parser ->DOM Tree
    * 标记化算法，进行元素状态的标记
    * dom数的构建
  * CSS parser -> Style Tree
    * 解析 css 代码，生成样式数
*  attachment -->Render Tree
  *   综合dom树与style树，生成渲染树
*  layout布局
*  GPU painting：像素绘制页面  


*标记化算法：
**标记化算法的输出结果是HTML标记**，该算法使用状态机来表示，每一个状态接受来自输入信息流的一个或多个字符串，并更具这些字符更新下一个状态，当前的标记化状态和树结构状态会影响进入下一状态的决定。这意味着，即使接受的字符相同，对于下一个正确的状态也会产生不同的结果，具体取决于当前的状态，该算法相当复杂，无法在此详述。

```
<html>
  <body>
    Hello world
  </body>
</html>
```
初始状态是**数据状态**。遇到字符 < 时，状态更改为“**标记打开状态**”。接收一个a-z字符会创建“**起始标记**”，状态更改为“**标记名称状态**”。这个状态会一直**保持到接收 > 字符**。在此期间接收的每个字符都会附加到新的标记名称上。

##  重绘与回流

当页面的样式发生变化时，浏览器需要触发更新，重新绘制元素，过程中，有两种类型操作，即重绘和回流

### 重绘  

当元素样式的改变不影响布局时，浏览器将使用重绘对元素进行更新，此时由于只需要UI层面的重新像素绘制，因此损耗较少

### 回流

当元素的尺寸，结构或触发某些属性时，浏览器会重新渲染页面，称为回流。此时，浏览器需要重新经过计算，计算后还需要重新页面布局，因此是较重的操作

页面初次渲染
浏览器窗口大小改变
元素尺寸、位置、内容发生改变
元素字体大小变化
添加或者删除可见的 dom 元素
激活 CSS 伪类（例如：:hover）
查询某些属性或调用某些方法

clientWidth、clientHeight、clientTop、clientLeft
offsetWidth、offsetHeight、offsetTop、offsetLeft
scrollWidth、scrollHeight、scrollTop、scrollLeft
getComputedStyle()
getBoundingClientRect()
scrollTo()


**回流必定发生重绘，重绘不一定触发回流，重绘的开销较小，回流的代价较高**

####  最佳实践：

* css
 
  * 避免使用table布局
  * 将动画效果应用到position属性为absolute或fixed的元素上

* js

  * 避免频繁操作样式，可汇总后统一 一次修改
  * 尽量使用class进行样式修改
  * 减少dom的增删次数，可使用 字符串 或者 documentFragment 一次性插入
  * 极限优化时，修改样式可将其display: none后修改
  * 避免多次触发上面提到的那些会触发回流的方法，可以的话尽量用 变量存住


##  存储

分为短暂性存储，持久性存储

* 短暂性，将数据存储在内存中，只在运行时可用
* 持久性存储，分为浏览器端与服务端
  * 浏览器
    * cookie：通常用于存储用户身份，登录状态等
      * http中自动携带，体积上限为4k，可自行设置过期时间
    * localstorage/sessionstorage：长久储存/窗口关闭删除，体积限制为 4~5M
    * indexDB (浏览器提供的本地数据库,NoSql)
  * 服务器：
    * 分布式缓存 redis
    * 数据库