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
'&&' 运算符使用技巧：当&&的第一个运算数的值为假时，取第一个运算数的值，反之，取第二个的值。
```javascript
0 && 1; // 0
false && true; // false
true && false; // false
1 && 2; // 2
```
|| 运算符使用技巧：当第一个运算数的值为为真时，取第一个运算数的值，反之，取第二个的值。一般使用这种技巧设置默认值。
```javascript
undefined || 0; //0
null || {}; // {}
0 || []; // []
1 || true; // 1
```
以上技巧利用了&&和||的短路原理，&&运算符左边的值为假时，不再执行右边的值，||运算符左边的值为真，则不再执行右边的值。
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
// 使用闭包，创建唯一ID
var create = function(){
	var num = 0;
	return function(){
		return num ++;
	}
}
var uId = create();
uId(); // 0
uId(); // 1
uId(); // 2
```
## 函数  
在JavaScript中函数就是对象。对象字面量产生的对象连接到Object.prototype，函数对象连接到Funtion.prototype（该原型对象本身连接到Object.prototype。  
每个函数在创建时两个附加隐藏属性：函数的上下文和实现函数行为的代码。每个函数对象在创建时也带有一个prototype属性，它的值是一个拥有constructor属性，该属性指向该函数的对象。
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
//结论：1、函数表达式和函数声明都会进行变量提升；2、函数表达式会覆盖同名的函数声明
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
如果函数前面带上new来调用，那么this指向该新对象上，使用new调用函数也会改变return语句的行为，如果return的是对象则返回该对象，否则，返回（this）新创建的对象。
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
apply方法有两个参数，第一个参数thisObj，是绑定this执行的上下文，第二个参数argArr，参数数组。
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
fun.getStatus.apply(obj); // 24
fun.getStatus.apply(this);

// apply方法第一个参数为null或者undefined时，this指向全局对象（非严格模式下）
function test(){
	console.log(this);
};
test.apply(null); // this指向全局对象（window对象）
test.apply(undefined); // this指向全局对象（window对象）
test.apply(this); // this指向全局对象（window对象）
test.apply(1); // this指向Number对象
test.apply('string'); // this指向String对象
test.apply(true); // this指向Boolean对象

// 结论：通俗的说，就是把某个方法放到apply方法的第一个参数（thisObj）作用域下执行。
```
3、arguments类数组参数对象  
arguments对象是一个类数组对象，只有length属性，没有数组相关方法。它可以获取函数调用时的参数列表。该对象只能在函数内部使用。
```javascript
var sum = function(){
	var sum = 0;
	for(var i = 0, len = arguments.length; i < len; i ++){
		sum += arguments[i];
	}
	return sum;
};
console.log(sum(1, 2, 3, 4, 5)); // 15
```
4、异常  
JavaScript提供了一套异常处理机制。
```javascript
var add = function(a, b){
	if(typeof a !== 'number' || typeof b !== 'number'){
		throw {
			name: 'TypeError',
			message: 'add needs numbers'
		};
	}
	return a + b;
};
add(1, 2); // 3
add(1, '2'); // 报错
add(); // 报错

// try_catch代码块
var try_it = function(){
	try{
		add('one');
	}catch(e){
		console.log(e.name + ' : ' + e.message);
	}
};
try_id(); // TypeError : add needs numbers
```
5、给类型添加方法  
通过给Object.prototype添加方法使得该方法对所有对象可用。  
通过给Function.prototype添加方法使得该方法对所有函数可用。
```javascript
// 给Function.prototype添加方法
Function.prototype.method = function(name, func){
	if(!this.prototype[name]){
		this.prototype[name] = func;
	}
};

// 给Number对象添加一个integer方法
Number.method('integer', function(){
	var funName = this < 0 ? 'ceil' : 'floor'; 
	return Math[funName](this);
});
(10/4).integer(); // 2
(-10/4).integer(); // -2

// 给String对象添加一个移除两端字符串的方法
String.method('trim', function(){
	return this.replace(/^\s+|\s+$/, '');
});
'  Better '.trim(); // 'Better'
```
6、递归  
递归函数会直接或间接地调用自身的一种函数。一般来说，一个递归函数调用自身去解决它的子问题。  
递归可以非常高效地操作树形结构，比如浏览器端的文档对象模型（DOM）。每次递归调用时处理给定树的一小段。
```javascript
// walk_the_DOM调用自身去处理每一个子节点
var walk_the_DOM = function walk(node, func){
	func(node);
	node = node.firstChild;
	while(node){
		walk(node, func);
		node = node.nextSibling;
	}
};
// 创建一个通过属性查找节点的函数
var getElementByAttribute = function(attr, value){
	var results = [];
	walk_the_DOM(document.body, function(node){
		var actual = node.nodeType === 1 && node.getAttribute(attr);
		if(typeof actual === 'string' && (actual === value || typeof value !== 'string')){
			results.push(node);
		}
	});
	return results;
};

// 利用递归，计算一个数的阶乘
var factorial = function factorial(i, a){
	a = a || 1;
	if(i < 2){
		return a;
	}
	return factorial(i - 1, a * i);
};
factorial(3); // 6
factorial(3, 2); // 12
factorial(3, 3); // 18

// 不建议在匿名函数中使用arguments.callee()
// 在给函数表达式一个名称或者使用函数声明而该函数必须调用自己时，禁止使用 arguments.callee()
// 在ES5的严格模式中禁止使用 arguments.callee()
function create(){
	return function(num){
		if(num < 2){
			return 1;
		}else{
			return num * arguments.callee(num - 1);
		}
	}	
};
var result = create()(3); // 6
```
7、作用域  
作用域控制着变量与参数的可见性和生命周期。  
JavaScript有函数作用域，但没有块级作用域，最好的做法是在函数体的顶部声明函数中可能用到的所有变量。
```javascript
// 函数内的变量会进行变量提升，所以运行cxt()函数，前两次console.log(c);没有报错
function cxt(){
	var a = 1, b = 2;
	console.log(c); // undefined
	function innerFun(){
		var a = 6, b =7, c = 8;
		console.log(a, b, c); // 6 7
	}
	innerFun();
	console.log(c); // undefined
	if(a == 1){ // false
		var c = 3;
	};
	console.log(c); // 3
}
```
8、闭包  
一个函数（内部函数）能访问另一个函数（外部函数）的变量就形成了闭包。
```javascript
var myObject = function(){
	var value = 0;
	return {
		increment: function(inc){
			value += typeof inc === 'number' ? inc : 1;
		},
		getValue: function(){
			return value;
		}
	};
}();

// 创建一个名为quo的构造函数
var quo = function(status){
	return {
		getStatus: function(){
			return status;
		}
	};
};
// 构造一个quo实例
var myQuo = quo('crazy');
console.log(myQuo.getStatus()); // 'crazy'
// 这个构造函数被设计成无需加new来使用，所以名字也没有首字母大写

// 定义一个函数，它设置一个DOM节点为黄色，然后把它渐变为白色
var fade = function(node){
	var level = 1;
	var step = function(){
		var hex = level.toString(16); // 转化为16进制数
		console.log(hex);
		node.style.backgroundColor = '#FFFF' + hex + hex;
		if(level < 15){
			level += 1;
			setTimeout(step, 100);
		}
	};
	setTimeout(step, 100);
};
fade(document.body);
```
9、回调  
回调函数可以让不连续的事件处理变得更容易。
```javascript
// 这种同步请求会阻塞进程
request = prepare_the+request();
response = send_request_synchronously(request);
display(response);

// 更好的方式使用异步回调请求
request = prepare_the_request();
send_request_asynchronously(request, function(response){
	display(response);
});
```
10、模块  
可以使用函数和闭包来构造模块。  
模块是一个提供接口却隐藏状态与实现的函数或对象。  
模块模式的一般形式：一个定义了私有变量和函数的函数；利用闭包创建可以访问私有变量和函数的特权函数；最后返回这个特权函数，或者把它们保存到一个可访问的地方。
```javascript
// 给所有函数都添加该方法
Function.prototype.method = function(name, func){
	if(!this.prototype[name]){
		this.prototype[name] = func;
	}
}
String.method('deentityify', function(){
	// 字符实体表
	var entity = {
		quot: '""',
		lt: '<',
		gt: '>'
	};
	// 返回deentityify方法
	return function(){
		// 使用字符串的replace方法
		// 查找‘&’开头和‘;’结束的子字符串
		return this.replace(/&([^&;]+);/g, function(a, b){
			console.log(a, b); // a为正则表达式第一个匹配，b为第二个匹配（圆括号里的匹配）
			var r = entity[b];
			return typeof r === 'string' ? r : a;
		});
	}
}()); // 这里使用立即执行函数
console.log('&lt;&quot;&gt;'.deentityify()); // <"">

// 构造一个用来产生序列号的对象
var serial_marker = function(){
	// 返回一个用来产生唯一字符串的对象
	// 唯一字符串由两部分组成：前缀+序列号
	// 该对象包含一个设置前缀的方法，一个设置序列号的方法和一个产生唯一字符串的gensym方法
	var prefix = '';
	var seq = 0;
	return {
		set_prefix: function(p){
			prefix = String(p);
		},
		set_seq: function(s){
			seq = s;
		},
		gensym: function(){
			var result = prefix + seq;
			seq += 1;
			return result;
		}
	};
};
var seqer = serial_marker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym(); // unique is "Q1000"
var unique = seqer.gensym(); // "Q1001"
```
模块模式通常结合单例模式（Singleton Pattern）使用。  
JavaScript的单例就是用对象字面量表示法创建的对象，对象的属性值可以是数值或函数，并且属性值在该对象的生命周期中不会发生变化。  

11、链式调用（级联）  
方法返回this而不是undefined就可以启用链式调用（级联），链式调用可以产生出具备强大表现力的接口。
```javascript
getElement('myBoxDiv').
	move(100, 200).
	width(100).
	height(200).
	color('red').
	on(mouseover, func);
```
12、记忆  
函数可以用对象去记住先前操作的结果，从而避免多余的运算。这种优化被称为记忆。JavaScript的对象和数组要实现这种优化是非常方便的。
```javascript
// Fibonacci数列，斐波那契数列，特点，前面相邻两项之和等于后一项的值。
var fibonacci = function(n){
	return n < 2 ? n : fibonacci(n - 1)	+ fibonacci(n - 2);
};
for(var i =0; i <= 10; i ++){
	console.log(i, fibonacci(i));
}
// 0 0
// 1 1
// 2 1
// 3 2
// 4 3
// 5 5
// 6 8
// 7 13
// 8 21
// 9 34
// 10 55
// fibonacci被调用了453次，除了我们调用了11次，其它的调用都在计算已经计算过的值

// 上面的例子做了很多重复的工作，下面进行一下优化
var fibonacci = function(){
	var memo = [0, 1];
	var fib = function(n){
		var result = memo[n];
		if(typeof result !== 'number'){ // 判断是否已经存在结果
			result = fib(n - 1) + fib(n - 2);
			memo[n] = result;
		}
		return result;
	};
	return fib;
}();
for(var i =0; i <= 10; i ++){
	console.log(i, fibonacci(i));
}
// 这样优化后只调用了29次，我们调用了11次，函数自身调用了18次

// 编写一个函数来帮助我们构造带记忆动能的函数，他返回一个管理memo存储和在需要是调用func函数的shell函数。
var memoizer = function(memo, func){
	var shell = function(n){
		var result = memo[n];
		if(typeof result !== 'number'){
			result = func(shell, n);
			memo[n] = result;
		}
		return result;
	};
	return shell;
};
// 使用memoizer来定义fibonacci函数
var fibonacci = memoizer([0, 1], function(shell, n){
	return shell(n - 1) + shell(n - 2);
});
// 使用memoizer来定义factoriala函数
var factorial = memoizer([1, 1], function(shell, n){
	return n * shell(n - 1);
});
```












