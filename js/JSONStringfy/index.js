// 1、如果obj里面有时间对象，则JSON.stringify后再JSON.parse的结果，时间将只是字符串的形式。而不是时间对象；
// 备注：用new Date()的形式会造成此错误 ，而Date.now()无此错误
const log = console.log.bind(this)

const test = {
  name: "a",
  // date:[new Date(1536627600000),new Date(1536627600000)]
  date: [Date.now()]
}

const b = JSON.parse(JSON.stringify(test))
// log('b ->',b)
// log('typeof test ->',typeof test.date[0])
// log('typeof b->',typeof b.date[0])

// 2 如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象；

const test2 = {
  name: 'a',
  date: new RegExp('\\w+'),
};
// debugger
const copyed2 = JSON.parse(JSON.stringify(test2));
test2.name = 'test'
// console.log('test2', test2)
// console.log('copyed2', copyed2)
// console.log('deepClone2', deepClone(test2))

// 3、如果obj里有函数，undefined，则序列化的结果会把函数或 undefined丢失；

const test3 = {
  name: 'a',
  date: function hehe() {
    console.log('fff')
  },
  age: undefined
};
// debugger
const copyed3 = JSON.parse(JSON.stringify(test3));
test3.name = 'test'
console.log('test3', test3)
console.log('copyed3', copyed3)
console.log('deepClone3', deepClone(test3))

// 4、如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
const test4 = {
  a: NaN,
  b: Infinity,
  c: -Infinity
};
// debugger
const copyed4 = JSON.parse(JSON.stringify(test4));
test4.name = 'test'
// console.log('test4', test4)
// console.log('copyed4', copyed4)

// 5、JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor；

function Person(name) {
  this.name = name;
  console.log(name)
}

const liai = new Person('liai');

const test5 = {
  name: 'a',
  date: liai,
};
// debugger
const copyed5 = JSON.parse(JSON.stringify(test5));
test5.name = 'test'
// console.log('test5', test5)
// console.log('copyed5', copyed5)


// 6、如果对象中存在循环引用的情况也无法正确实现深拷贝；


// 以上，如果拷贝的对象不涉及上面讲的情况，可以使用JSON.parse(JSON.stringify(obj))实现深拷贝，但是涉及到上面的情况，可以考虑使用如下方法实现深拷贝：


function deepClone(data) {
  const type = judgeType(data);
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === 'array') {
    // eslint-disable-next-line
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    // 对原型上的方法也拷贝了....
    // eslint-disable-next-line
    for (const key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

function judgeType(obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  // if (obj instanceof Element) {
  //   return 'element';
  // }
  return map[toString.call(obj)];
}



// 摘自  https://www.jianshu.com/p/b084dfaad501