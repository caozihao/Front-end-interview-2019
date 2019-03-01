// 打开数据库，如果数据库不存在，就会新建数据库；第二个参数，新建数据库时，默认为1
var request = window.indexedDB.open('my-DB',2)

let personData = [
  { id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 21, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 22, email: 'wangwu@example.com' }
]

request.onerror = function (event) {
  console.log('数据库打开报错');
}

var db = null;
request.onsuccess = function(event){
  db = request.result;
  console.log('数据库打开成功');
  testFunc();
}

// 数据库升级事件:如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件
request.onupgradeneeded = function (event) {
  db = event.target.result;
  console.log('数据库升级事件');
  addObjectStore();
}

// 创建表和索引
function addObjectStore(){
  var objectStore = null;
  if (!db.objectStoreNames.contains('person')) {
    // 新增表格 
    objectStore = db.createObjectStore('person', {
      keyPath: 'id'
    })
    // 索引必须是唯一的，unique：唯一的
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('email', 'email', { unique: true })
  }
}

function testFunc(){
  delayed(add,500);
  delayed(readAll, 1000);
  delayed(update, 1500);
  delayed(remove, 2000)
  delayed(readAll, 2500);
  delayed(searchByIndex, 3000);
}

function delayed(fun,time){
  setTimeout(fun, time)
}

// 新增数据
function add (){
  // 操作事务  事务的名称/访问类型
  var transaction = db.transaction(['person'],'readwrite');
  // 选中表
  var objectStore = transaction.objectStore('person');
  // 执行添加语句
  objectStore.add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' })
  // objectStore.add({ id: 2, name: '李四', age: 21, email: 'lisi@example.com' })
  // var request =   objectStore.add({ id: 8, name: '王6', age: 22, email: 'wangwu@example.com1112111' })

  // TODO 批量操作，但是没有监听事件
  // for (let item of personData){
  //   var request =  objectStore.add(item);
  // }

  // var request = objectStore.add(personData);

  // setTimeout(() => {
  //   readAll();
  // }, 1000);

  request.onsuccess = function (event) {
    console.log('数据写入成功');
    // readAll();
  };

  request.onerror = function (event) {
    console.log('数据写入失败');
    // readAll();
  }
}

// 读取数据
function read(){
  var transaction = db.transaction(['person']);
  var objectStore = transaction.objectStore('person');
  var request = objectStore.get(1);
  request.onerror = function (event) {
    console.log('事务失败');
  };

  request.onsuccess = function (event) {
    if (request.result) {
      console.log('Name: ' + request.result.name);
      console.log('Age: ' + request.result.age);
      console.log('Email: ' + request.result.email);
    } else {
      console.log('未获得数据记录');
    }
  };
}

// 遍历数据
// 遍历数据表格的所有记录，要使用指针对象 IDBCursor。
function readAll() {
  console.log('----------------readAll----------------')
  var transaction = db.transaction(['person']);
  var objectStore = transaction.objectStore('person');

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;

    if (cursor) {
      console.log('Id: ' + cursor.key);
      console.log('Name: ' + cursor.value.name);
      console.log('Age: ' + cursor.value.age);
      console.log('Email: ' + cursor.value.email);
      cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}

// 更新数据
function update() {
  console.log('----------------update----------------')
  var transaction = db.transaction(['person'], 'readwrite');
  var objectStore = transaction.objectStore('person');
  var request = objectStore.put({ id: 1, name: '李四', age: 35, email: 'lisi@example666.com' });

  request.onsuccess = function (event) {
    console.log('数据更新成功');
  };

  request.onerror = function (event) {
    console.log('数据更新失败');
  }
}

// 删除数据
function remove() {
  console.log('----------------remove----------------')
  var transaction = db.transaction(['person'], 'readwrite');
  var objectStore = transaction.objectStore('person');
  var request =objectStore.delete(1);

  request.onsuccess = function (event) {
    console.log('数据删除成功');
  };
}

// 使用索引

function searchByIndex(){
  console.log('----------------index----------------')
  var transaction = db.transaction(['person'], 'readonly');
  var store = transaction.objectStore('person');
  var index = store.index('email');
  var request = index.get('lisi@example.com111');

  request.onsuccess = function (e) {
    var result = e.target.result;
    if (result) {
      console.log('找到索引数据:', result);
    } else {
      console.log('没找到索引数据');
    } 
  }
}