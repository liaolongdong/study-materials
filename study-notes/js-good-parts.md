# JavaScript语言精粹学习笔记

## 语法
1、注释  
JS提供了两种注释方式：一种是块注释：/* 被注释的内容 */ ，另一种是行注释：// 被注释的内容。
使用块注释是不安全的，例如,使用正则表达式：
```javascript
// /*
	var test = /test*/;
// */
```
2、数字
```javascript
var isNaN = isNaN(number); // 用isNaN方法判断是否为数字，不是数字返回true,反之，返回false
```
3、字符串不可变
```javascript
'A' === '\u0041'; // true
'c' + 'a' + 't' === 'cat'; // true
'cat'.toUpperCase() === 'CAT'; // true
```
4、语句  
条件判断会被当成false的值：false,null,undefined,'',0,NaN,其他所有值都为被当做true。

5、运算符  
typeof运算符产生的值有：'number','string','boolean','undefined','function','object'.  
'+' 运算符只有在操作符两端操作数都为数字时进行相加，其他情况是字符串连接。  
'/' 运算符可能产生一个非整数结果，即使两个运算数都是整数。  
'&&' 运算符使用技巧：当&&的第一个运算符的值为假时，取第一个运算数的值，反之，取第二个的值。
```javascript
0 && 1; // 0
false && true; // false
true && false; // false
1 && 2; // 2
```
|| 运算符使用技巧：当第一个运算符的值为为真时，取第一个运算数的值，反之，取第二个的值。一般使用这种技巧设置默认值。
```javascript
undefined || 0; //0
null || {}; // {}
0 || []; // []
1 || true; // 1
```
## 对象  
1、使用字面量创建对象  
对象属性值可以使用undefined以外的任何值
```javascript
var obj = {};
obj.name = 'Better';
obj.age = 24;
obj['first-name'] = 'liao'; //由于first-name不是合法的标识符，所以必须使用[]，不能使用.
obj.last_name = 'longdong'; // last_name为合法标识符
```
2、引用  
对象通过引用进行传递
```javascript
var a = {}, b ={}, c = {}; //a,b,c属于不同的对象，因为它们的引用不同
a == b; // false
var a = b = c = {}; // a,b,c属于用一个对象
a === b; // true
```
3、原型  
每个对象都有原型对象，所谓的原型链，就是查找对象的属性和方法时，首先，查找对象本身是否有该属性或者方法，如果没有，则沿着原型对象进行查找，直到Object.prototype，如果都没有则返回undefined.
```javascript
// 模拟Object.create()方法创建新对象
if( typeof Object.create === 'function'){
	Object.create = function (obj) {
		var F = function(){};
		F.prototype = obj;
		return new F();
	}
}
obj.hasOwnProperty('name'); // 该方法用于检测对象本身是否拥有该属性，不会查找原型链中的属性和方法
```
4、全局变量  
减少全局变量主要有两种方式：一、使用命名空间，二、使用闭包
```javascript
// 使用命名空间
var mynamespace = {};
mynamespace.module1 = {
	name : 'xiaoxin',
	age: 24
};
mynamespace.module2 = {
	name: 'xiaowu',
	age: 22
};
// 使用闭包

```
## 函数  
在JavaScript中函数就是对象。对象字面量产生的对象连接到Object.prototype，函数对象连接到Funtion.prototype（该原型对象本身连接到Object.prototype。  
每个函数在创建时两个附加隐藏属性：函数的上下文和实现函数行为的代码。 
每个函数对象在创建时也带有一个prototype属性，它的值是一个拥有constructor属性，该属性指向该函数的对象。
```javascript
var f = function(){};
f.prototype.constructor === f;
```
1、函数字面量（函数表达式）
函数表达式与函数声明的区别：
```javascript
// 函数表达式
console.log(fun1); // undefined
var fun1 = function(){
	console.log(123);
};
console.log(fun1); // function(){console.log(123)};

// 函数声明
console.log(fun2); // function fun2(){console.log(456)};
function fun2(){
	console.log(456);
};
console.log(fun2); // function fun2(){console.log(456)};

var fun3 = function(){
	console.log(666);
};
function fun3(){
	console.log(888);
};
console.log(fun3()); // 666
//结论：函数表达式会覆盖同名的函数声明
```
2、函数调用  
JavaScript中一共有四种函数调用模式：方法调用模式、函数调用模式、构造函数调用模式和apply调用模式。  
- 方法调用模式  
当函数作为一个对象的方法（属性）时，this指向该对象。
```javascript
var myObj = {}; // 创建一个对象
myObj.name = 'Better';
myObj.method = function(){ // 给对象添加方法
	console.log(this.name);
};
myObj.method(); // 'Better'
```
- 函数调用模式
当一个函数没有作为一个对象的方法（属性）时，this指向全局对象（window对象）
```javascript
// 全局函数
function add(a, b){
	return a + b;
};
add(1, 2); // 3

myObj.value = 2;
myObj.double = function(){
	console.log(this);
	var that = this; // 把指向myObj对象的this指针，存到that变量中
	var helper = function(){
		console.log(this); // 这里的this指向window对象
		that.value = add(that.value, that.value);
	};
	helper(); // 以函数形式进行调用helper函数
};
myObj.double(); // 以方法的形式调用double函数
myObj.value; // 4
```
- 构造函数调用模式
如果函数前面带上new来调用，那么this指向该新对象上，使用new调用函数也会改变return语句的行为，如果return的是对象则返回该对象，否则，返回新创建的对象。
```javascript
// 创建一个构造函数，约定构造函数使用大写开头
function Fun(string){
	this.status = string;
};
// 给构造函数添加公共方法
Fun.prototype.getStatus = function(){
	return this.status;
};
// 创建实例
var fun = new Fun('Better');
fun.getStatus(); // 'Better'
// 不推荐使用该方法
```
- apply调用模式
apply方法有两个参数，第一个是绑定this执行的上下文，第二个数参数数组。
```javasvcript
// 创建一个构造函数，约定构造函数使用大写开头
function Fun(string){
	this.status = string;
};
// 给构造函数添加公共方法
Fun.prototype.getStatus = function(){
	return this.status;
};
// 创建实例
var fun = new Fun('Better');
fun.getStatus(); // 'Better'

// this指向全局对象
function add(a, b){
	return a + b;
};
var arr = [3, 4];
var sum = add.apply(null, arr); // 7

// this指向obj对象
var obj = {};
obj.status = 24;
Fun.prototype.getStatus.apply(obj); // 24
```






