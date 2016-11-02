# JavaScript设计模式
## 创建对象的基本模式  
JavaScript中创建对象的基本模式有3种。  
一、门户大开型是创建对象最简单的一种方式，但它只能提供公用成员。  
二、使用下划线来约定或者规范表示属性或方法为私有属性（其实这种方法和第一种类似，只是增加了一个约定或者规范）。  
三、使用闭包来创建真正的私有成员，这些成员只能通过一些特权方法访问。
```javascript
// 创建一个Book类
function Book(name, author, price){
	// 设置默认值
	this.name = name || 'book-name';
	this.author = author || 'Better';
	this.price = price || 10;
};
// 添加图书信息展示方法
Book.prototype.display = function(){
	console.log('book-info:\n' + 'book-name:' + this.name + 
	', book-author:' + this.author + ', book-price:' + this.price);
};
var myBook = new Book('myBook');
myBook.display();
// 输出结果：
// book-info:
// book-name:myBook, book-author:Better, book-price:10
```
1、门户大开型  
实现Book类最简单的做法是按传统方式创建一个类，用一个函数作为其构造函数，这种称为门户大开型对象，这种对象的所有属性和方法都是公开的、可访问的。这些公用属性需要使用this关键字创建。
```javascript
var Book = function(name, author, price){
	if(name == undefined) throw new Error('Book constructor requires an name.');
	this.name = name;
	this.author = author || 'Better';
	this.price = price || 10;
};
Book.prototype = {
	getName: function(){
		return this.name;
	},
	setName: function(name){
		this.name = name;
	},
	display: function(){
		console.log('book-info:\n' + 'book-name:' + this.name + 
		', book-author:' + this.author + ', book-price:' + this.price);
	}
};
var myBook1 = new Book();
// Uncaught Error: Book constructor requires an name.
var myBook = new Book('JavaScript Design Patterns', 'Ross Harmes', 50);
myBook.getName(); // 'JavaScript Design Patterns'
myBook.setName('BetterBook');
myBook.getName(); // 'BetterBook'
myBook.display();
// 输出：
// book-info:
// book-name:JavaScript Design Patterns, book-author:Ross Harmes, book-price:50
```
优点：简单易用，不要求深入理解作用域或者原型链。  
缺点：无法保护内部数据，取值器和赋值器需要引入额外代码。  
2、用命名规范区别私有成员  
从本质上说这种模式与门户大开型对象创建模式如出一撤，唯一的区别在于方法和属性名称前加了下划线以表示私有成员。  
下划线的这种用法是一个众所周知的命名规范，它表明一个属性或方法仅供对象内部使用，直接访问它或设置它可能会导致意想不到的后果。
```javascript
var Book = function(name, author, price){
	this.setName(name);
	this.setAuthor(author);
	this.setPrice(price);
};
Book.prototype = {
	getName: function(){
		return this._name;
	},
	setName: function(name){
		this._name = name;
	},
	getAuthor: function(){
		return this._author;
	},
	setAuthor: function(author){
		this._author = author;
	},
	getPrice: function(){
		return this._price;
	},
	setPrice:function(price){
		this._price = price || 10;
	},
	_priviteMethod: function(){
		console.log('this is privite method');
	}
};
var myBook = new Book('JavaScript', 'Better');
myBook.getName(); // 'JavaScript'
myBook.getAuthor(); // 'Better'
myBook.getPrice(); // 10
myBook._priviteMethod(); // 'this is privite method'
```
优点：拥有门户大开型对象创建模式的所有优点，而且比后者少一个缺点。 
缺点：这只是一种约定，只有在得到遵守时才有效果。主要适用于非敏感性的内部方法和属性。  
3、作用域、嵌套函数和闭包  
在JavaScript中，只有函数具有作用域，也就是说，在一个函数内部声明的变量在函数外部无法访问。

