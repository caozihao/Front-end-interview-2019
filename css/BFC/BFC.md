## BFC （Block Formatting Context）
 **块级格式化上下文**，是一个独立的渲染区域，让处于内部的元素与外部的元素相互隔离，使内外元素的定位不会互相影响
## 触发条件

* 根元素
* position: absolute/fixed
* display: inline-block/table-cell/table-caption/table(Table会默认生成一个匿名的table-cell，正是这个匿名的table-ccell生成了BFC)
* float !== none
* ovevflow !== visible

##  规则

* 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
* BFC 中子元素的 margin box 的左边， 与包含块 (BFC) border box的左边相接触 (子元素 absolute 除外)
* BFC 的区域不会与 float 的元素区域重叠
* 计算 BFC 的高度时，浮动子元素也参与计算
* 文字层不会被浮动层覆盖，环绕于周围

##  应用
* 阻止margin重叠
  * 应用了‘属于同一个BFC的两个相邻Box的margin会发生重叠’的特性，意味着如果相邻兄弟元素不属于同一个BFC（比如其中一个是float元素），就不会发生margin重叠了
* 解决父元素高度塌陷
  * 应用了‘计算BFC高度时，浮动元素也参与计算在内’的特性
* 自适应两栏布局
  * 应用了‘BFC的区域不会与floatbox重叠的特性，一边浮动，一边自适应的部分形成BFC，那么两者就不会重叠，’避免出现文字环绕及类似情形
* 可以阻止元素被浮动元素覆盖

##  清除浮动

* 利用 clear属性，清除浮动 
  * 添加空div清理浮动（浮动元素的同级）
    ```
    <div class="p">
        <div class="c"></div>
        <div class="c"></div>
        <div class="c"></div>
        <div style="clear:left;"></div>
    </div>
    ```
  * 向父元素添加伪元素
    ```
    .floatfix:after{
      content:'';
      clear:both;
      display: block;
    }

      <div class="p floatfix">
          <div class="c">1</div>
          <div class="c">2</div>
          <div class="c">3</div>
      </div>
    ```
* 使父容器形成BFC

clear : 属性指定一个元素是否可以在它之前的浮动元素旁边，或者必须向下移动(清除浮动) 到这些浮动元素的下面。right清除左边，left清除右边，both清楚全部，那边高就移动到那边下边

参考文章：

[我对BFC的理解](https://www.cnblogs.com/dojo-lzz/p/3999013.html) 

[CSS清浮动处理（Clear与BFC）](http://www.cnblogs.com/dolphinX/p/3508869.html)

[MDN(BFC)](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

[MDN(CSS)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)

[张徐鑫 CSS深入理解流体特性和BFC特性下多栏自适应布局](https://www.zhangxinxu.com/wordpress/2015/02/css-deep-understand-flow-bfc-column-two-auto-layout/)