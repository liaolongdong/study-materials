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











