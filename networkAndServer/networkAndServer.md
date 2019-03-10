##  服务端与网络

* 1.0协议缺陷
  * 无法复用链接，完成即断开，重新慢启动和TCP3次握手
  * head of line blocking: 线头阻塞，导致请求之间互相影响

* 1.1改进
  * 长连接（默认 keep-alive）,复用
  * host字段指定对应的虚拟站点
  * 新增功能：
    * 断点续传
    * 身份认证
    * 状态管理
    * cache缓存
      *cache-control
      *Expires
      *Last Modified
      *Etag

* 2.0
  * 多路复用
  * 二进制分帧层：应用层和传输层之间
  * 首部压缩
  * 服务端推送

* https：较为安全的网络传输协议
  * 证书（公钥）
  * SSL加密
  * 端口443

* TCP:
  * 三次握手
  * 四次挥手
  * 滑动窗口：流量控制
  * 拥塞处理
    * 慢开始
    * 拥塞避免
    * 快速重传
    * 快速回复

* 缓存策略（可分为强缓存和协商缓存）
  * Cache-Control(http:1.1)/Expires(http1.0)：浏览器判断缓存是否过期，未过期时，直接使用强缓存，Cache-Control的max-age优先级高于Expires
  * 当缓存过期时，使用协商缓存
    * 唯一标识方案：ETag(response携带) & if-None-Match(request携带，上一次返回的ETag):服务器判断资源是否被修改
    * 最后一次修改时间：Last-Modified（response）& if-Mondified-Since(request,上一次返回的Last-Modified)
      * 如果一致，则直接返回304，通知浏览器使用缓存
      * 如果不一致，则服务器返回新的资源
    * Last-Modified缺点：
      * 周期性修改，但内容未变时，会导致缓存失效
      * 最小粒度只到s,s以内的改动无法检测到
    * Etag的优先级高于Last-Modified

