##  相关知识

####  vertical-align

CSS 的属性 vertical-align 用来指定行内元素（inline）或表格单元格（对应table-cell）元素的垂直对齐方式。

```

vertical-align: baseline;
vertical-align: top;
vertical-align: middle;
vertical-align: bottom;
vertical-align: sub;
vertical-align: text-top;

```

####  table-cell

display：table-cell；会使元素表现的类似一个表格中的单元格td，利用这个特性可以实现文字的垂直居中效果。

小结：  
* 不要与float：left; position:absolute; 一起使用 
* 可以实现大小不固定元素的垂直居中  
* margin设置无效，响应padding设置  
* 对高度和宽度高度敏感  
* 不要对display：table-cell使用百分比设置宽度和高度


 


####  box-sizing

box-sizing 属性用于更改用于计算元素宽度和高度的默认的 CSS 盒子模型。可以使用此属性来模拟不正确支持CSS盒子模型规范的浏览器的行为。

```
box-sizing: content-box;
box-sizing: border-box;
```

####  区别

content-box:

内容实际宽度 = width - *border - *padding

*border: border-left + border-right
*padding: padding-left + padding-right


border-box:

内容实际宽度 = width




参考文章:   
https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing   
[七种实现左侧固定，右侧自适应两栏布局的方法](https://segmentfault.com/a/1190000010698609)


####  flex

flex 属性可以指定1个，2个或3个值。

**单值语法: 值必须为以下其中之一:**

一个无单位数(<number>): 它会被当作<flex-grow>的值。
一个有效的宽度(width)值: 它会被当作 <flex-basis>的值。
关键字none, auto,或initial.

**双值语法: 第一个值必须为一个无单位数，并且它会被当作<flex-grow>的值。第二个值必须为以下之一：**

一个无单位数：它会被当作<flex-shrink>的值。
一个有效的宽度值: 它会被当作<flex-basis>的值。

**三值语法:**

第一个值必须为一个无单位数，并且它会被当作<flex-grow>的值。
第二个值必须为一个无单位数，并且它会被当作 <flex-shrink>的值。
第三个值必须为一个有效的宽度值， 并且它会被当作<flex-basis>的值。


align-item控制y轴，justify-content控制x轴