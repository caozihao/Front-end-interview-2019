##  缓存的优点

* 减少网路宽带消耗
* 降低服务器压力
* 减少网络延迟，加快页面打开速度

##  浏览器端的缓存规则

对于浏览器端的缓存来讲，这些规则是在**HTTP协议头**和**HTML页面的Meta标签**中定义的。他们分别从新鲜度和校验值两个维度来规定浏览器是否可以直接使用缓存中的副本，还是需要去源服务器获取更新的版本。

* 新鲜度（过期机制）
  * 1,含有完整的过期时间控制头信息（HTTP协议报头），并且仍在有效期内；
  * 2,浏览器已经使用过这个缓存副本，并且在一个会话中已经检查过新鲜度；
  * 满足以上两个情况的一种，浏览器会直接从缓存中获取副本并渲染。
* 校验值（验证机制）
  * 服务器返回资源的时候有时在控制头信息带上这个资源的实体标签Etag（Entity Tag），它可以用来作为浏览器再次请求过程的校验标识。如过发现校验标识不匹配，说明资源已经被修改或过期，浏览器需求重新获取资源内容。

##  浏览器缓存的控制
  *  使用HTML Meta 标签
  ```
  <meta http-equiv="Pragma" content="no-cache">  

  ```
    * 坑：
      *   仅有IE才能识别这段meta标签含义，其它主流浏览器仅识别“Cache-Control: no-store”的meta标签。
      * 在IE中识别到该meta标签含义，并不一定会在请求字段加上Pragma，但的确会让当前页面每次都发新请求（仅限页面，页面上的资源则不受影响）。
  
  * 使用缓存有关的HTTP消息报头
  。一个URI的完整HTTP协议交互过程是由HTTP请求和HTTP响应组成

  ###  Cache-control与Expires
  * Expires（1.0），1.1中用Cache-Control: max-age=秒替代,原因是因为Expires控制缓存的原理是使用客户端的时间与服务端返回的时间做对比，如果客户端与服务端的时间因为某些原因（例如时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存则会直接失效，这样的话强制缓存的存在则毫无意义
  * HTTP响应报文中expires的时间值，是一个绝对值
  * HTTP响应报文中Cache-Control为max-age=600
  * Cache-Control与Expires的作用一致，都是指明当前资源的有效期,控制浏览器是否直接从浏览器缓存取数据还是重新发请求到服务器取数据
  * Cache-Control的选择更多，设置更细致
  * 优先级: Cache-control > Expires

  
  ###  Last-Modified/ETag与Cache-Control/Expires
  * 配置Last-Modified/ETag的情况下，浏览器再次访问统一URI的资源，还是会发送请求到服务器询问文件是否已经修改，如果没有，服务器会只发送一个304回给浏览器，告诉浏览器直接从自己本地的缓存取数据；如果修改过那就整个数据重新发给浏览器；
  * Cache-Control/Expires则不同，如果检测到本地的缓存还是有效的时间范围内，浏览器直接使用本地副本，**不会发送任何请求**。
  * 优先级:两者一起使用时,Cache-control/Expires >  Last-Modified/ETag;。
  * 当本地副本根据Cache-Control/Expires发现还在有效期内时，则不会再次发送请求去服务器询问修改时间（Last-Modified）或实体标识（Etag）
  * 一般情况下，使用Cache-Control/Expires会配合Last-Modified/ETag一起使用，因为即使服务器设置缓存时间, 当用户点击“刷新”按钮时，浏览器会忽略缓存继续向服务器发送请求，这时Last-Modified/ETag将能够很好利用304，从而减少响应开销。

  ### Last-Modified与ETag
  * HTTP1.1中Etag的出现主要是为了解决几个Last-Modified比较难解决的问题：
    * Last-Modified标注的最后修改只能精确到秒级，如果某些文件在1秒钟以内，被修改多次的话，它将不能准确标注文件的新鲜度
    * 如果某些文件会被定期生成，当有时内容并没有任何变化，但Last-Modified却改变了，导致文件没法使用缓存
    * 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形
  * Etag是服务器自动生成或者由开发者生成的对应资源在服务器端的唯一标识符，能够更加准确的控制缓存。Last-Modified与ETag是可以一起使用的.
  * 服务器会优先验证ETag，一致的情况下，才会继续比对Last-Modified，最后才决定是否返回304。
  * Last-Modified(response 携带) /If-Modified-Since  (request，上一次返回的Last-Modified) 要配合Cache-Control使用
  * Etag(response 携带)/If-None-Match(request携带，上一次返回的 Etag)也要配合Cache-Control使用。


###  用户行为与缓存

用户操作|Expires/Cache-Control|
Last-Modified/Etag|
-|-
地址栏回车|有效|有效
页面链接跳转|有效|有效
新开窗口|有效|有效
前进、后退|有效|有效
F5刷新|无效|有效
Ctrl+F5刷新|无效|无效

### 不能缓存的请求

* HTTP信息头中包含以下内容
  * Cache-Control:no-cache 
  * pragma:no-cache（HTTP1.0）
  * Cache-Control:max-age=0
* 需要根据Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
* 经过HTTPS安全加密的请求（有人也经过测试发现，ie其实在头部加入Cache-Control：max-age信息，firefox在头部加入Cache-Control:Public之后，能够对HTTPS的资源进行缓存，参考《HTTPS的七个误解》）
*  POST请求无法被缓存
*  HTTP响应头中不包含Last-Modified/Etag，也不包含Cache-Control/Expires的请求无法被缓存

### Cache-control

指令|作用|
-|-|
public|表示响应可以被客户端和代理服务器缓存
private|表示响应只可以被客户端缓存
max-age=30|缓存30秒后就过期，需要重新请求
s-maxage=30|覆盖max-age,作用一样，只在代理服务器中生效
no-store|不缓存任何响应
no-cache|资源被缓存，但是立即失效，下次会发起请求验证资源是否过期
max-stable=30|30秒内，计师缓存过期，也使用该缓存
min-stable=30|希望在30秒内获取最新的响应

### 实际场景应用缓存策略

*  频繁变动的资源
  ```
  Cache-Control: no-cache

  ```
  * 首先需要使用Cache-Control: no-cache 使浏览器每次都请求服务器，然后配合 ETag 或者 Last-Modified 来验证资源是否有效。这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。
* 不常变化的资源
  ```
  Cache-Control: max-age=31536000(一年)
  ```


  ### from memory cache 和 from disk cache
  * 缓存分两种：from memory cache，from disk cache
  * from memory cache代表使用内存中的缓存，from disk cache则代表使用的是硬盘中的缓存，浏览器读取缓存的顺序为memory –> disk
  * 内存缓存(from memory cache)：内存缓存具有两个特点，分别是快速读取和时效性
    * 快速读取：内存缓存会将编译解析后的文件，直接存入该进程的内存中，占据该进程一定的内存资源，以方便下次运行使用时的快速读取。
    * 时效性：一旦该进程关闭，则该进程的内存则会清空。关闭或者刷新页面后就会丢失
  * 硬盘缓存(from disk cache)：硬盘缓存则是直接将缓存写入硬盘文件中（C:\Users\Skull\AppData\Local\Google\Chrome\User Data\Default\Cache），读取缓存需要对该缓存存放的硬盘文件进行I/O操作，然后重新解析该缓存内容，读取复杂，速度比内存缓存慢。
  * memory 中的资源其实也同时会存在 disk 中，所以下一次加载，浏览器会优先从 disk 中检索。
  * 脚本、图片、字体 存在 memory  / 脚本、样式表、图片、媒体、字体 是会缓存在 disk 

###   三级缓存原理
*  先去内存看，如果有，直接加载
*  如果内存没有，择取硬盘获取，如果有直接加载
*  如果硬盘也没有，那么就进行网络请求
*  加载到的资源缓存到硬盘和内存


参考文章:
* https://www.cnblogs.com/slly/p/6732749.html
* https://www.cnblogs.com/shixiaomiao1122/p/7591556.html
* https://www.jianshu.com/p/54cc04190252