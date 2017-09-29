# 总结一下平时开发中经常使用到的公用方法 #

## 这些公用函数方法都使用es6语法 ##

## 毫秒数转换成日期（格式：yyyy-mm-dd、yyyy-mm-dd hh:mm、yyyy-mm-dd hh:mm:ss） ##
```javascript```
// 参数说明：timeStamp为时间戳毫秒数，type：1 对应日期格式yyyy-mm-dd hh:mm  2 对应日期格式yyyy-mm-dd hh:mm:ss
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
## 距离当前时间多久（几秒前、几分钟前、几小时前） ##
```javascript```
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

## 手机格式化（135 **** 1025、135-****-1025）##
```javascript```
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

## 获取url参数 ##
```javascript````
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

## 移动端判断微信浏览器、ios、Android ##
```javascript```
export const whatDevice = () => {
  let device = '';
  let ua = window.navigator.userAgent.toLowerCase();
  if (/MicroMessenger/i.test(ua)) {
    device = 'wx';
  } else if (/(Android)/i.test(ua)) {
    device = 'android';
  } else if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
    device = 'ios';
  }
  return device;
}
// 测试结果: 用的是PC端谷歌浏览器测试
console.log(whatDevice()); // 'ios'
```

## cookie的获取、添加、删除 ##
```javascript```
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

