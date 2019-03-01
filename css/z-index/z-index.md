
##  规则

* 顺序规则
  *  在不设置position属性（或设置成static）的情况下，文档流后面的DOM节点会覆盖前面的DOM节点。 
* 定位规则
  *  定位节点（position属性设置为relative，absolute或fixed的节点）会覆盖非定位节点（不设置position属性或position属性设为static的节点）
*  参与规则
  *  z-index属性仅对定位节点生效。
*  默认值规则
   *   对于所有的定位节点，z-index值大的节点会覆盖z-index值小的节点。
   *   z-index设为0和没有设置z-index的节点在同一层级内没有高低之分。在IE6和7种，z-index的默认值为0，其他浏览器中默认值为auto。
   *   子dom会覆盖在父dom上，无论有没有设置z-index
*   从父规则
   *   两个节点A和B都是定位节点，如果节点A的z-index值比节点B的大，那么节点A的子元素都会覆盖在节点B以及节点B的子节点上。
   *   如果定位节点A和B的z-index值一样大，那么根据顺序规则，B会覆盖A，那么即使A的子节点的z-index比B的子节点大，B的子节点还是会覆盖A的子节点。
*  层级树规则
  *  定位节点，且z-index有整数值的（不包括z-index:auto），会被放置到一个与DOM节点不一样的层级树里。
  *  在下面的DOM节点中，A和B是兄弟节点，但是在层级树种，A和B-1才是兄弟节点（因为他们都是Root下的第一层含有整数z-index的定位节点），所以A在B和B-1之上。虽然A-1的z-index比B-1的小，但是根据从父规则，A-1也在B-1之上。

## 概念

层叠上下文是HTML元素的三维概念，这些HTML元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的用户的z轴上延伸，HTML元素依据其自身属性按照优先级顺序占用层叠上下文的空间。

##  特性

* 子元素的 z-index 值只在父级层叠上下文中有意义。
* 子级层叠上下文被自动视为父级层叠上下文的一个独立单元。

##  产生的条件
满足一下其中一个条件，即可产生一个层叠上下文：

根元素 (HTML),    
z-index 值不为 "auto"的 绝对/相对定位，     
position: fixed       
opacity 属性值小于 1 的元素       
transform 属性值不为 "none"的元素     
filter值不为“none”的元素      
-webkit-overflow-scrolling 属性被设置 "touch"的元素     

参考文章：
[DOM层级顺序与z-index](https://segmentfault.com/a/1190000014382426)