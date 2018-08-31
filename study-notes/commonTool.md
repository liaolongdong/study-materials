# 总结一下平时开发中经常使用到的公用方法

## 这些公用函数方法使用的是ES6的语法

### 毫秒数转换成日期（格式：yyyy-mm-dd、yyyy-mm-dd hh:mm、yyyy-mm-dd hh:mm:ss）
```javascript
// 参数说明：timeStamp为时间戳毫秒数，默认格式为：yyyy-mm-dd type：1 对应日期格式yyyy-mm-dd hh:mm  2 对应日期格式yyyy-mm-dd hh:mm:ss
export const formatDate = (timeStamp, type) => {
  let formatDateStr = '';
  let date = new Date(timeStamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hour = hour < 10 ? '0' + hour : hour;
  second = second < 10 ? '0' + second : second;
  if (type === 1) {
    formatDateStr = `${year}-${month}-${day} ${hour}:${minute}`;
  } else if (type === 2) {
    formatDateStr = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } else {
    formatDateStr = `${year}-${month}-${day}`;
  }
  return formatDateStr;
}
// 测试结果
console.log(formatDate(1506664038876)); // 2017-09-29
console.log(formatDate(1506664038876, 1)); // 2017-09-29 13:47
console.log(formatDate(1506664038876, 2)); // 2017-09-29 13:47:18
```
### 距离当前时间多久（几秒前、几分钟前、几小时前）
```javascript
export const durationTime = (timeStamp) => {
  let durationTimeStr = '';
  let duration = (+Date.now() - timeStamp) / 1000;
  if (duration < 60) {
    durationTimeStr = `${Math.round(duration)}秒前`;
  } else if (duration >= 60 && duration < 60 * 60) {
    durationTimeStr = `${Math.round(duration / 60)}分钟前`;
  } else if (duration >= 60 * 60 && duration < 60 * 60 * 24) {
    durationTimeStr = `${Math.round(duration / 60 / 60)}小时前`;
  } else {
    // 使用上面的日期格式化formatDate方法
    durationTimeStr = formatDate(timeStamp, 2);
  }
  return durationTimeStr;
}
// 测试结果
console.log(durationTime(1506664038876)); // 10分钟前
```

### 倒计时（距离现在还有00天00小时00分钟00秒）
```javascript
// 参数说明：remainTime: 剩余时间毫秒数，mountId:挂载dom节点
let futureDateTime = Date.parse('2018-10-25');
export const countDownNow = (remainTime, mountId) => {
  let intDay, intHour, intMin, intSecond, timeStr;
  let saveRemainTime = remainTime;
  remainTime = remainTime - Date.now(); // 剩余时间减去当前时间
  if(remainTime > 0) {
    intDay = Math.floor(remainTime / (24 * 60 * 60 * 1000)); // 剩余天数
    remainTime = remainTime - (intDay * 24 * 60 * 60 * 1000); // 减去剩余天数的毫秒数
    intHour = Math.floor(remainTime / (60 * 60 * 1000)); // 剩余小时数
    remainTime = remainTime - (intHour * 60 * 60 * 1000); // 减去剩余小时数的毫秒数
    intMin = Math.floor(remainTime / (60 * 1000)); // 剩余分钟数
    remainTime = remainTime - (intMin * 60 * 1000); // 减去剩余分钟数的毫秒数
    intSecond = Math.floor(remainTime / 1000); // 剩余秒数
    intDay < 10 && (intDay = '0' + intDay);
    intHour < 10 && (intHour = '0' + intHour);
    intMin < 10 && (intMin = '0' + intMin);
    intSecond < 10 && (intSecond = '0' + intSecond);
    timeStr = intDay + '天' + intHour + '时' + intMin + '分' + intSecond + '秒';
    // document.getElementById(mountId).innerText = timeStr;
    // 配合测试
    console.log('剩余时间', timeStr);
    setTimeout(function () {
      countDownNow(saveRemainTime, mountId);
    }, 1000);
  } else {
    console.log('666', timeStr);
    // document.getElementById(mountId).innerText = '该时间点已过';
  }
}

// 测试结果
countDownNow(futureDateTime, 'mountId');
// 剩余时间 284天15时34分26秒
// 剩余时间 284天15时34分22秒 .....
```

### 手机格式校验 ###
```javascript
export const checkPhoneNum = (phoneNum) => {
  let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
  return phoneReg.test(phoneNum);
}
// 测试结果
console.log(checkPhoneNum(13556891025)); // true
```

### 手机格式化（135 **** 1025、135-****-1025）
```javascript
// 参数说明：phoneNum 需要格式化的手机号 connector 格式化的连接字符
export const formatPhoneNum = (phoneNum, connector) => {
    let arr = phoneNum.split('');
    connector = connector || ' ';
    arr.splice(3, 0, connector);
    arr.splice(8, 0, connector);
    return arr.join('');
}
// 测试结果
console.log(formatPhoneNum('135****1025')); // '135 **** 1025'
console.log(formatPhoneNum('135****1025', '-')); // '135-****-1025'
```

### input输入框手机号码实时格式化
```javascript
// 该方法应在实时监听input输入框变化的回调函数中使用
// 参数说明：prevPhoneNum为input框变化前的值， phoneNum为input当前的
// 通过这两个值的长度大小进行比较，来区分变化是删除还是增加
export const RTFormatPhoneNum = (prevPhoneNum, phoneNum) => {
    // 判断是否为删除
    if (prevPhoneNum < phoneNum) {
      // 输入第4位数字和时前面加空格
      if (phoneNum.length === 4) {
        phoneNum = phoneNum.split('');
        phoneNum.splice(3, 0, ' ');
        phoneNum = phoneNum.join('');
      }
      // 输入第8位数字和时前面加空格
      if (phoneNum.length === 9) {
        phoneNum = phoneNum.split('');
        phoneNum.splice(8, 0, ' ');
        phoneNum = phoneNum.join('');
      }
    } else {
      // 删除第4位数时同时删除前面的空格
      if (phoneNum.length === 4) {
        phoneNum = phoneNum.substr(0, 3);
      }
      // 删除第8位数时同时删除前面的空格
      if (phoneNum.length === 9) {
        phoneNum = phoneNum.substr(0, 8);
      }
    }
}
```

### 获取url参数(使用正则表达式)
```javascript
// 参数说明：name 要获取参数值的名称
// 如https://www.baidu.com/?id=123456&name=xiaoxin
export const getUrlQueryString = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  // let r = window.location.search.substr(1).match(reg);
  // 仅测试用
  let r = 'id=123456&name=xiaoxin'.match(reg);
  if (r !== null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}
// 测试结果
console.log(getUrlQueryString('id')); // '123456'
console.log(getUrlQueryString('name')); // 'xiaoxin'
```

### 获取url地址参数
```js
/** 
 * @desc 将url参数转成对象返回
 * @param url type: string (require) url字符串， 如：https://www.baidu.com/?id=123456&name=Better&age=18
 * @param name type: string (no-require) 参数的key，如：id
 * @return 参数对象或者某个参数的值
 */
export function urlParamToObj (url, name) {
  let obj = {};
  let a = document.createElement('a');
  a.href = url;
  let search = a.search;
  a = null;
  if (search.indexOf('?') === 0) {
    let str = search.substr(1);
    let arr = str.split('&');
    arr.forEach((item, index) => {
      let paramArr = item.split('=');
      // 防止url编码，把编码也解析出来
      obj[decodeURIComponent(paramArr[0])] = decodeURIComponent(paramArr[1]);
    });
  }
  return name ? obj[name] : obj;
}

// 测试结果：
console.log(urlParamToObj('https://www.baidu.com/?id=123456&name=Better&age=18')); // {id: "123456", name: "Better", age: "18"}
console.log(urlParamToObj('https://www.baidu.com/?id=123456&name=Better&age=18', 'name')); // 'Better'
```

### 在url后面增加参数
```js
/** 
 * @desc 在url上增加参数
 * @param url type: string (require) url字符串， 如：https://www.baidu.com/?id=123456&name=Better&age=18
 * @param param type: object (require)，如：{key: value}
 * @return 返回拼接好的url字符串
 */
 export function addParamToUrl (url, param) {
    let a = document.createElement('a');
    a.href = url;
    let arr = [];
    let search = a.search;
    if (param) {
        Object.keys(param).forEach((item) => {
            if (param[item] !== '' && param[item] !== null && param[item] !== undefined) {
                arr.push(encodeURIComponent(item) + '=' + encodeURIComponent(param[item]));
            }
        });
    }
    if (arr.length !== 0) {
        search += search === '' ? '?' + arr.join('&') : '&' + arr.join('&');
    }
    let resultUrl = a.origin + a.pathname + search + a.hash;
    a = null;
    return resultUrl;
 }

 // 测试结果：
 addParamToUrl('https://www.baidu.com/?id=123456&name=Better&age=18', {from: 'wx'}); // "https://www.baidu.com/?id=123456&name=Better&age=18&from=wx"
```

### 移动端判断微信浏览器、ios、Android
```javascript
export const whatDevice = () => {
  let device = '';
  let ua = window.navigator.userAgent.toLowerCase();
  if (/(Android)/i.test(ua)) {
      device = 'android';
  } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      device = 'ios';
  } else if (/MicroMessenger/i.test(ua)) { // 这样写在ios手机上微信浏览器和其他浏览器输出都是ios
      device = 'wx';
  }
  // 单独再做一次判断
  if (/MicroMessenger/i.test(ua)) {
    device = 'wx';
  }
  return device;
}
// 测试结果: 用的是PC端谷歌浏览器测试
console.log(whatDevice()); // ''
// 使用微信开发者工具测试
console.log(whatDevice()); // 'wx'
```

### cookie的获取、添加、删除
```javascript
export const addCookie = (name, value, expiresHours) => {
  let cookieStr = '';
  // 如果value为对象，进行序列化操作
  if (Object.prototype.toString.call(value) === '[object Object]') {
    value = JSON.stringify(value);
  }
  cookieStr = name + '=' + value;
  if (expiresHours) {
    let date = new Date();
    date.setTime(date.getTime() + expiresHours * 3600 * 1000);
    cookieStr = cookieStr + ';expires=' + date.toGMTString();
  }
  document.cookie = cookieStr + ';path=/';
}

export const getCookie = (name) => {
  let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr != null) {
    if ((/^\{.*\}$/g).test(arr[2])) {
      return JSON.parse(arr[2]);
    }
    return arr[2];
  }
  return null;
};

// 测试结果
let userInfo = {
  naem: 'xiaoxin',
  age: 18
};
addCookie('userInfo', userInfo);
console.log(getCookie('userInfo')); // {naem: "xiaoxin", age: 18}
let userName = 'liaoxiaoxin';
addCookie('userName', userName);
console.log(getCookie('userName')); // 'liaoxiaoxin'
```

### 生成由数字和字母组合的随机字符串
```javascript
export const getNonceStr = (num) => {
  let res = '';
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for (let i = 0; i < num; i++) {
    let index = Math.ceil(Math.random() * 35);
    res += chars[index];
  }
  return res;
};

// 测试结果
console.log(getNonceStr(28)); // 'KYN4UDPK1KXOSZ9W4UARD6RT79LE'
```

### 按自然顺序排序参数对象字符串，如连接方式userName=liaoxiaoxin&age=18
```javascript
export const getParamsStr = (paramsObj) => {
  let paramsStr = '';
  const keys = Object.keys(paramsObj).sort();
  keys.map((key) => {
    paramsStr += `&${key}=${paramsObj[key]}`;
  });
  paramsStr = paramsStr.substr(1);
  return paramsStr;
};

// 测试结果
let params = {
  userName: 'xiaoxin',
  age: 18,
  position: 'front-end engineer'
}
console.log(getParamsStr(params)); // age=18&position=front-end engineer&userName=xiaoxin
```

### 禁止输入框输入表情
```javascript
// 用苹果手机亲测好像只能防止输入部分表情
export const maskEmoji = (text) => {
  let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  if (regRule.test(text)) {
    text = text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
    alert('不能输入表情');
  }
  return text;
};
```

### 快速排序传统实现方式
```javascript
function quickSort (arr) {
	//如果数组只有一个数，就直接返回
	if (arr.length <= 1) {
		return arr;
	}
	//找到中间数的索引值，如果是浮点数，则向下取整
	let index = Math.floor(arr.length / 2);
	//找到中间数的值
	let numValue = arr.splice(index, 1);
	const left = [];
	const right = [];
	for (let i = 0; i < arr.length; i++) {
		//基准点的左边的数传到左边数组
		if (arr[i] < numValue) {
			left.push(arr[i]);
		} else {
			//基准点的右边的数传到右边数组
			right.push(arr[i]);
		}
	}
	//递归不断重复比较
	return quickSort(left).concat([numValue], quickSort(right));
}

// 测试结果
console.log(quickSort([2, 1, 3, 5, 4])); // [1, 2, 3, 4, 5]
```

### 快速排序算法ES6简洁实现
```javascript
export const quickSort = (arr) => {
  if (!arr.length) {
    return [];
  }
  const [prev, ...rest] = arr;
  return [
    ...quickSort(rest.filter(value => value < prev)),
    prev,
    ...quickSort(rest.filter(value => value >= prev))
  ];
}

// 测试结果
let arr = [6, 2, 9, 4, 7, 1, 8, 3, 5, 6, 9, 3];
console.log(quickSort(arr)); // [1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9]
```

### 数组对象排序
```js
/**
 *  @desc   对象数组排序，例如按时间倒序
 *  @param  排序字段名prop，排序方式type: 正序：positive， 倒序reverse 默认倒序
 *  @return 数组排序比较函数
 */
export const objArrayCompareByProp = (prop, type = 'reverse') => {
    return (obj1, obj2) => {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (type === 'positive') {
            if (val1 > val2) {
                return 1;
            } else if (val1 < val2) {
                return -1;
            } else {
                return 0;
            }
        } else {
            if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }
        }
    };
};
// 测试结果：
let objArr = [{name: 'wangxiaowu', age: 20}, {name: 'liaoxiaoxin', age: 18}, {name: 'Better', age: 19}];
console.log(JSON.stringify(objArr.sort(objArrayCompareByProp('name')))); // [{"name":"wangxiaowu","age":20},{"name":"liaoxiaoxin","age":18},{"name":"Better","age":19}]
console.log(JSON.stringify(objArr.sort(objArrayCompareByProp('age')))); // [{"name":"wangxiaowu","age":20},{"name":"Better","age":19},{"name":"liaoxiaoxin","age":18}]
console.log(JSON.stringify(objArr.sort(objArrayCompareByProp('age', 'positive')))); // [{"name":"liaoxiaoxin","age":18},{"name":"Better","age":19},{"name":"wangxiaowu","age":20}]

```

### 持续更新中。。。

## 公用方法JS文件链接
- [平时开发中常用的公用方法](https://github.com/liaolongdong/react-comment-demo/blob/master/src/commonTool.js '平时开发中常用的公用方法')



