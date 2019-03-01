##  indexDB 

IndexedDB 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作,不属于关系型数据库（不支持 SQL 查询语句），更接近 NoSQL 数据库。

### 特点

* 键值对储存
* 异步
* 支持事务
* 同源限制
* 储存空间大 （250M ~）
* 支持二进制储存

### 基本概念

* 数据库 (IDBDatabase 对象)
* 对象仓库 (IDBObjectStore 对象)
* 索引 (IDBIndex 对象)
* 事务 (IDBTransaction 对象)
* 操作请求 (IDBRequest 对象)
* 指针 (IDBCursor 对象)
* 主键集合 (IDBKeyRange 对象)

### 浏览器兼容性

桌面端：IE 10 +
手机端（安卓/IOS）：不支持    

localstorage
桌面端：IE 8 +
手机端（安卓/IOS）：支持