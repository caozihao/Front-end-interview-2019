##  居中布局

DOM
```
<div id="box">
  <div id="content" />
</div>
```

* 水平居中：
  * 行内元素:text-align:center
  * 块级元素：margin: 0 auto
  * absolute + transform
    * 已知父元素高度
    ```
    #box {
      height:300px;
      width:500px
    }
    
     .content{
       width:50%;
       height:50%;
       position:relative;
       top:50%;
       transform:translateY(-50%)
     }
     * 未知父元素高度
      ```
      #box {
        height:300px;
        width:500px;
        position:relative;
      }
      
      .content{
        width:50%;
        height:50%;
        position:absolute;
        top:50%;
        transform:translateY(-50%)
      }
      ```
  * flex + justify-content: center
* 垂直居中
  * line-height:height
  * absolute + transform
  * flex + align-items: center
  * table
    ```
       #box {
        height: 300px;
        width: 500px;
        background: blue;
        display: table;
      }

      #content {
        width: 50%;
        height: 50%;
        background: yellow;
        display: table-cell;
        vertical-align: middle;
        text-align: center;
      }
    ```
* 水平垂直居中
  * absolute + transform
  * flex + justify-content + align-items
  * table

##  选择器优先级
  * !important > 行内样式 > #id > .class > tag >继承  > 默认

## 去除浮动影响，防止父级高度塌陷
  * 通过增加尾元素清除浮动
    * :after{ clear:both }
  * 创建父级BFC
  * 父级设置高度

## link 与 @import 的区别
  * link功能较多，可以定义 RSS，定义 Rel 等作用，而@import只能用于加载 css
  * 当解析到link时，页面会同步加载所引的 css，而@import所引用的 css 会等到页面加载完才被加载
  * @import需要 IE5 以上才能使用
  * link可以使用 js 动态引入，@import不行