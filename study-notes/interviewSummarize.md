## 面试总结

## JS编程题

## 考察promise和setTimeout定时器结合使用
```javascript
var promise = new Promise(function(resolve, reject) {
	setTimeout(function() {
		console.log(1);
		resolve();
	}, 3000);
});
promise.then(function() {
	setTimeout(function() {
		console.log(2);
	}, 2000);
}).then(function() {
	setTimeout(function() {
		console.log(3);
	}, 1000);
}).then(function() {
	setTimeout(function() {
		console.log(4);
	}, 0);
});
// 输出结果：3s后输出1和4，再过1s输出3，再过1s输出2
// 解析：promise.then()方法要等resolve()执行以后，才会执行后面的then方法，后面的这些方法按定时器异步流程处理
```

## 实现add(1)(2)(3)这类方法以及扩展方法
```javascript
var add = function (a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        }
    }
}
console.log(add(1)(2)(3));
// 输出结果：6

function add1 (x) {
    var sum = x;
    var temp = function (y) {
        sum = sum + y;
        return temp;
    }
    temp.toString = function () {
        return sum;
    }
    return temp;
}
console.log(add1(1)(2)(3));   
console.log(add1(1)(2)(3)(4)(5));
// 输出结果：6 15
```   
