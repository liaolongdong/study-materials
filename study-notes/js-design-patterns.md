# JavaScript设计模式
## 创建对象的基本模式  
JavaScript中创建对象的基本模式有4钟。  
一、门户大开型（对象字面量）是创建对象最简单的一种方式，但它只能提供公用成员。  
二、使用new关键字，创建一个对象。  
三、使用下划线来约定或者规范表示属性或方法为私有属性（其实这种方法和第一种类似，只是增加了一个约定或者规范）。  
四、使用闭包来创建真正的私有成员，这些成员只能通过一些特权方法访问。
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
	console.log('book-info:\n' + 'book-name:' + this.name + ', book-author:' + this.author + ', book-price:' + this.price);
};
var myBook = new Book('myBook');
myBook.display();
// 输出结果：
// book-info:
// book-name:myBook, book-author:Better, book-price:10
```

