function create() {
  var demo = document.getElementById('app');
  for (var i = 0; i < 100; i++) {
    var el = document.createElement('p');
    el.innerHTML = 'hello';
    demo.appendChild(el);
  }
}

create();