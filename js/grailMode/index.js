// JS中并没有真正意义上的继承，所谓的继承只是利用了原型和原型链的方法，同时在使用这些方法时会产生一些额外的且不希望产生的影响——创建作用域

// 普通继承方式的缺陷：

// 传统的继承方式(如博文10.原型中的原型链案例所示)过多地继承了没有用的属性
// 借用构造函数来继承会导致： 
//      不能继承借用构造函数的原型
//      每次构造函数都要多走一个函数
// 用共享原型来继承，不能随便改动自己的原型

// 圣杯模式的本质是 利用一个临时函数作为中间层以及原型链的方式实现继承
// 通过圣杯模式可以把一个家族中的各个对象的干扰给截断，以使每个对象在对父类有继承的情况下相互独立，以免各个对象在试图修改自身(特别是自身原型)的属性时影响到其他对象

const log = console.log.bind(this)


var Person = function () { }

Person.prototype.sayHello = function () {
  console.log('hello');
};

Person.prototype.spell = function () {
  console.log('i can spell!');
};

var personA = new Person();
var personB = new Person();

personA.sayHello();
personA.spell();
personB.sayHello();
personB.spell();

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
// 之前应项目需求 实例化了很多对象， 现在需要 实例化 n 个说中文的对象，同时要具备之前的 spell相同能力 
// console.log('原有的继承方式：')
// Person.prototype.sayHello = function () {
//     console.log('你好');
// };

// var chinaPersonA = new Person();
// var chinaPersonB = new Person();
// chinaPersonA.sayHello();
// chinaPersonA.spell();
// chinaPersonB.sayHello();
// chinaPersonB.spell();

console.log('圣杯模式:')
function grailMode(Origin, Target) {
  var Temp = function () { };
  Temp.prototype = Origin.prototype;
  Target.prototype = new Temp();
  Target.prototype.constructor = Target;
  Target.prototype.uber = Origin;
}

// 由于当立函执行完毕时会返回一个匿名函数(注：以下简称匿函)，这个匿函调用了Temp函数，
// 最终匿函也被赋予到了grailMode2函数中，导致立函执行前预编译产生的AO(活动对象-函数作用域对象)在立函执行完毕后并不会销毁，
// 于是Temp函数成为了一个闭包并被一同赋予到了grailMode2函数中去了，
// 这样当在外部使用grailMode2函数时，将会一直都在使用一个Temp函数，
// 而不用每次使用时都再新建一个Temp函数

// 使用匿名函数的好处：将会一直都在使用一个Temp函数， 而不用每次使用时都再新建一个Temp函数 
var grailMode2 = (function () {
  return function (Origin, Target) {
    var Temp = function () { };
    Temp.prototype = Origin.prototype;
    //Target.prototype = Temp.prototype; // 不能这么写，因为这样写就相当于对象Target、Origin和Temp共享原型了 
    //Target.prototype.__proto__--->Origin.prototype
    //使对象Target试图修改自身属性时仅仅是以Temp函数作为对象进行修改，而不会影响到其他对象 */
    Target.prototype = new Temp();
    Target.prototype.constructor = Target;
    Target.prototype.uber = Origin;  //标记继承自谁，属性名自定义
  }
})();

var ChinaPerson = function () { }
grailMode(Person, ChinaPerson);

ChinaPerson.prototype.sayHello = function () {
  console.log('你好');
}

console.log('ChinaPerson ->', ChinaPerson);

var ChinaPersonA2 = new ChinaPerson();
ChinaPersonA2.sayHello();
ChinaPersonA2.spell();

personA.sayHello();
personA.spell();


// 参考文章：
// https://blog.csdn.net/palmer_kai/article/details/79698125
// https://blog.csdn.net/qq_41135015/article/details/78739980