// 设置同域下共享的localStorage与监听window.onstorage

window.onstorage  = function(e){
  console.log(e.key + ' 键已经从 ' + e.oldValue + ' 改变为 ' + e.newValue + '.');
}

setInterval(function(){
  console.log('newDate', Date.now());
  window.localStorage.setItem('newDate', Date.now());
},1000)