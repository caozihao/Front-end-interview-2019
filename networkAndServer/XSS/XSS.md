## XSS  (Cross Site Scripting)

* 全称为跨站脚本攻击
* XSS 攻击通常指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序，这些恶意网页程序通常是JavaScript，但实际上也可以包括Java，VBScript，ActiveX，Flash或者甚至是普通的HTML。攻击成功后，攻击者可能得到更高的权限（如执行一些操作）、私密网页内容、会话和cookie等各种内容。

##  xss攻击的种类

* 持续性XSS攻击，恶意脚本来源于网站的数据库
  ```
  <script>alert(‘aaa’)</script>
  ```
  * 这种攻击方式恶意代码会被存储在数据库中，其他用户在正常访问的情况下，也有会被攻击，影响的范围比较大

*  反射型XSS攻击：恶意脚本来源于受害者的请求
  
  ```
  url :http://xxx?keyword=<script>alert('aaa')</script>
  ```
  * 在一个反射型XSS攻击中，恶意文本属于受害者发送给网站的请求中的一部分。随后网站又把恶意文本包含进用于响应用户的返回页面中，发还给用户。
  
  * 反射型的攻击需要用户主动的去访问带攻击的链接，攻击者可以通过邮件或者短信的形式，诱导受害者点开链接。如果攻击者配合短链接URL，攻击成功的概率会更高

* 基于DOM的XSS攻击
  ```
  url :http://xxx?name=<script>alert('aaa')</script>
  ```
  * 基于DOM的XSS攻击是反射型攻击的变种。服务器返回的页面是正常的，只是我们在页面执行js的过程中，会把攻击代码植入到页面中
  * 这种攻击方式发生在我们合法的js执行中，服务器无法检测我们的请求是否有攻击的危险

##  如何防范XSS攻击

* 可以下载前端防御组件：js-xss  
* 可以在js中用正则表达式 过滤特殊字符, 校验所有输入域是否含有特殊符号
* 替换，把含有特殊字符的替换为空
* 判断，如果是特殊字符就不让输出
* 操作dom进行.text()的行为

##  使用dom操作防范输入框攻击

* 用户输入数据后Encode内容后再保存到持久存储
  * 转义的实现方式就是：
    * 动态创建一个dom元素
    * 然后把输入框的内容作为纯本文赋给这个dom元素
    * 获取这个元素的html内容（不包括dom元素）

  * 解析实现方式就是：
    * 动态创建一个dom元素
    * 然后把输入框的内容作为html赋给这个dom元素
    * 获取这个元素的纯文本内容（不包括dom元素，因为获取纯文本的方法会自动过滤掉标签元素）
  ```
  原生 JS方法

  //转义  元素的innerHTML内容即为转义后的字符
  function htmlEncode ( str ) {
    var ele = document.createElement('span');
    ele.appendChild( document.createTextNode( str ) );
    return ele.innerHTML;
  }
  //解析 
  function htmlDecode ( str ) {
    var ele = document.createElement('span');
    ele.innerHTML = str;
    return ele.textContent;
  }
   
  // jquery方法
  function htmlEncode(value) {
    return $("<div/>").text(value).html();
  }

  function htmlDecode(value) {
    return $("<div/>").html(value).text();
  }

  ```


参考文章：
https://blog.csdn.net/qq_43287488/article/details/82873336
