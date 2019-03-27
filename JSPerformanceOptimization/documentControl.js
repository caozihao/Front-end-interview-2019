// 13. 通过模板元素clone，替代createElement
var frag = document.createDocumentFragment();
for (var i = 0; i < 1000; i++) {
  var el = document.createElement('p');
  el.innerHTML = i;
  frag.appendChild(el);
}

document.body.appendChild(frag);

// 替换为

var frag = document.createDocumentFragment();
var pEl = document.getElementsByTagName('p')[0];
for (var i = 0; i < 1000; i++) {
  // false	可选。该方法将复制并返回调用它的节点的副本。如果传递给它的参数是 true，它还将递归复制当前节点的所有子孙节点。否则，它只复制当前节点。
  var el = pEl.cloneNode(false);
  el.innerHTML = i;
  frag.appendChild(el);
}

document.body.appendChild(frag);

// 14. 使用firstChild和nextSibling代替childNodes遍历dom元素
var nodes = document.body.childNodes;
for (var i = 0; i < nodes.length; i++) {
  var node = nodes[i];
}
// 替换为

var node = document.body.firstChild;
while (node) {
  node = node.nextSibling;
} 