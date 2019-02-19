function Person(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age, gender) {
  // Person.call(this,name,age);
  Person.apply(this, arguments); //this继承了person的属性和方法
  this.gender = gender;
}
var student = new Student("陈安东", 20, "男");
console.log("姓名:" + student.name + "\n" + "年龄:" + student.age + "\n" + "性别:" + student.gender);