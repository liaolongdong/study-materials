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
```javascript
// 在外部函数内部调用变量
function outerFun(){
	var a = 10;
	function innerFun(){
		a *= 2;
	}
	innerFun();
	return a;
}
outerFun(); // 20
outerFun(); // 20
// 内部函数可以访问外部函数的变量，但变量并没有一直驻留在内存中
```
```javascript
// 在外部函数外部内部函数调用变量
function outerFun(){
	var a = 10;
	function innerFun(){
		a *= 2;
		return a;
	}
	return innerFun;
}
var fun = outerFun();
fun(); // 20
fun(); // 40
fun(); // 80
var fun1 = outerFun();
fun1(); // 20
```
上述代码中，把内部函数（innerFun）的引用返回给变量fun。这个函数现在是在外部函数（outerFun）外部调用的，但它依然能够访问a变量。这是因为JavaScript中的作用域是词法作用域。也就是说，函数运行在定义它们的作用域中（本例中是outerFun内部的作用域），而不是运行在调用它们的作用域中。只要innerFun被定义在outerFun中，那么它就能访问outerFun作用域中定义的所有变量，即使outerFun执行结束了。  
这就是闭包的一个例子。在outerFun返回后，它的作用域被保存下来了，但只有它返回的那个函数（innerFun）能够访问这个作用域。在这个示例中，fun和fun1各有这个作用域及变量a的一个副本，而且只有它们自己能对其进行修改。返回一个内嵌函数是创建闭包最常用的手段。  

3.1 用闭包实现私有成员
我们需要创建一个只能在对象内部访问的变量，使用闭包是再合适不过了，因为借助于闭包你可以创建只允许特定函数访问的变量，而且这些变量在这些函数的各次调用之间依然存在。为了创建私有属性，我们需要在构造函数的作用域中定义相关变量。
```javascript
var Book = function(newName, newAuthor, newPrice){
	// 私有属性
	var name, author, price;

	// 私有方法
	function checkName(name){
		return name || 'Better-Book';
	}

	// 特权方法
	this.getName = function(){
		return name;
	};
	this.setName = function(newName){
		name = newName;
	};
	this.getAuthor = function(){
		return author;
	};
	this.setAuthor = function(newAuthor){
		author = newAuthor || 'Better';
	};
	this.getPrice = function(){
		return price;
	};
	this.setPrice = function(newPrice){
		price = newPrice || 10;
	};

	this.setName(newName);
	this.setAuthor(newAuthor);
	this.setPrice(newPrice);
};
// 公有方法
Book.prototype = {
	display: function(){
		console.log('checkName:' + this.checkName + ', getName:' + this.getName() + 
		', getAuthor:' + this.getAuthor() + ', getPrice:' + this.getPrice());
	}	
};
var myBook = new Book();
myBook.display(); // checkName:undefined, getName:undefined, getAuthor:Better, getPrice:10
myBook.setName('Better-Book');
myBook.getName(); // 'Better-Book'
myBook.display(); // checkName:undefined, getName:Better-Book, getAuthor:Better, getPrice:10
var myBook1 = new Book('Better-Book-Two', 'xiaoxin');
myBook1.display(); // checkName:undefined, getName:Better-Book-Two, getAuthor:xiaoxin, getPrice:10
```
任何不需要直接访问私有属性的方法都可以像原来那样在Book.prototype中声明。display就是这类方法中的一个。他不需要直接访问任何私有属性，因为它可以通过调用getName或者getAuthor来进行间接访问。只有那些需要直接访问私有成员的方法才应该被设计为特权方法。但特权方法太多又会占用过多内存，因为每个对象实例都包含了所有特权方法的新副本。  
优点：有这种方式创建的对象可以具有真正的私有属性。
缺点：每个生成一个新对象实例都将为每一个私有方法和特权方法生成一个新的副本，这会比其他做法耗费更多内存，所以只适合用在需要真正私有属性的场合。  

4、更多高级对象创建模式  
4.1 静态属性和方法  
前面所讲的作用域和闭包可用于创建静态成员，包括公有和私有的。大多数方法和属性所关联的是类的实例。而静态成员所关联的则是类本身。换句话说，静态成员是在类层次上操作的，而不是在实例的层次上操作。每个静态成员都只有一份。
```javascript
var Book = (function(){
	// 私有静态属性
	var numOfBooks = 0;
	// 私有静态方法
	function checkName(name){
		return name === 'Better-Book';
	};
	// 返回构造函数
	return function(newName, newAuthor, newPrice){
		// 私有属性
		var name, author, price;
		// 特权方法
		this.getName = function(){
			return name;
		};
		this.setName = function(newName){
			checkName(newName)? name = newName : name = 'Better-Books';
		};
		this.getAuthor = function(){
			return author;
		};
		this.setAuthor = function(newAuthor){
			author = newAuthor || 'Better';
		};
		this.getPrice = function(){
			return price;
		};
		this.setPrice = function(newPrice){
			price = newPrice || 10;
		};

		// 构造代码
		numOfBooks ++; // 记录实例次数
		if(numOfBooks > 50) throw new Error('Book:构造函数只能被实例化50次');

		this.setName(newName);
		this.setAuthor(newAuthor);
		this.setPrice(newPrice);
	}
})();
// 公有静态方法
Book.convertToNameCase = function(str){
	return typeof str === 'string' ? str.toLowerCase() : str;
};
// 公有方法
Book.prototype = {
	display: function(){
		console.log('getName:' + this.getName() + ', convertToNameCase:' + Book.convertToNameCase(this.getName()));
	}	
};
Book.convertToNameCase('Better'); // 'better'
var myBook = new Book('Better-Book');
myBook.display(); // getName:Better-Book, convertToNameCase:better-book
```
这里的私有成员和特权成员仍然被声明在构造函数中（分别使用var和this关键字）。
但那个构造器却从原来的普通构造函数变成了一个内嵌函数，并且被作为包含它的函数的返回值赋值给变量Book。这就创建了一个闭包，你可以把静态的私有成员声明在里面。位于外层函数声明之后的一对空括号很重要，其作用是代码一载入就立即执行这个函数（IIFE，立即执行函数）而不是在调用Book构造函数时。这个函数的返回值是另一个函数，它被赋给Book变量，Book因此成了一个构造函数。在实例化Book时，所调用的是这个内层函数。外层那个函数只适用于创建一个可以用来存放静态私有成员的闭包。  

这些使用静态成员可以从构造函数内部访问，这意味着所有的私有函数和特权函数都能访问它们。与其他方法相比，它们有一个明显的优点，就是在内存中只会存放一份。其中那些静态方法被声明在构造函数之外，所以它们不是特权方法，不能访问任何定义在构造函数中的私有属性。定义在构造函数中的私有方法能够调用那些私有静态方法，反之则不然。要判断一个私有方法是否被设计为静态方法，一条经验法则是看它是否需要访问任何实例数据。如果它不需要那么将其设计为静态方法会更有效率（从内存占用的意义上来说），因为它只会被创建一份。
