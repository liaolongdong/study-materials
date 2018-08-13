## 总结工作当中遇到的各种坑

### 1、移动端点击穿透问题
- [移动端大坑之点击穿透](https://blog.csdn.net/kao5585682/article/details/69529430 "移动端大坑之点击穿透")
- [点击穿透原理及解决](https://blog.csdn.net/qq_17746623/article/details/55805425 "点击穿透原理及解决")

## 2、上传图片格式转换(react)
```html
<input className='photo-upload-tip'
        type='file'
        ref={(input) => { this.fileInput = input; }}
        onChange={this.handleUploaderImgChangeTest} />
```
```javascript
// base64格式转成blob格式
function dataURItoBlob (dataURI) {
    let byteString = window.atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split('')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    console.log('blob', new Blob([ab], {type: mimeString}));
    return new Blob([ab], {type: mimeString});
}

// 把base64格式转成formData格式
function base64toFormData (imageBase64) {
    let blob = dataURItoBlob(imageBase64);
    // let canvas = document.createElement('canvas');
    // let dataURL = canvas.toDataURL('image/png', 0.5);
    let fd = new FormData();
    fd.append('file', blob);
    return fd;
}

handleUploaderImgChangeTest = () => {
    let formData = new FormData();
    formData.append('file', this.fileInput.files[0]);
    fetch('http://dev-wxuser-api.wanshifu.com/common/upload/uploadimage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
    }).then((res) => {
        console.log('success', res.status);
    }).catch((e) => {
        console.log('error', e);
    });
 }
```
## 3、阻止浏览器当前页面回退操作
```javascript
window.history.pushState('forward', null, window.location.href); // 首先在当前页面创建一个新的history实体
window.addEventListener('popstate', () => { // 监听状态变化
    window.history.forward(1); // 跳转到下一个history
});
```
## 4、移动端动态节点绑定事件ios点击失效
原因是:
- 在ios系统中,例如document,div,body这些本身并没有可以被点击的属性的元素不能作为托管点击事件的父元素。所以,用这样的方法进行事件托管，ios会获取不到你的document的点击事件，自然无法获取到你想要绑定的元素身上。
- 解决办法就是把document换成你想要绑定元素的父元素上可以是最大的那个div，然后在最大元素的样式中加入cursor:pointer; 这个属性可以让父元素变成拥有可被点击属性的盒子，这样就可以解决动态数据无法绑定事件的问题。

参考博客：
- [利用js实现 禁用浏览器后退](https://blog.csdn.net/zc474235918/article/details/53138553)
- [用（SPA）前端javascript如何阻止按下返回键页面回退](https://blog.csdn.net/cjd6568358/article/details/70077935)
- [防止页面后退（使浏览器后退按钮失效）](https://www.cnblogs.com/webzwf/p/5714385.html)
- [移动端动态节点绑定事件ios点击失效](https://blog.csdn.net/lunhui1994_/article/details/73801411)

## 5、图片加载出现403错误
原因：在http中请求https图片可能会出现403错误  

解决方案：在`html`的`head`标签中加入`<meta name="referrer" content="no-referrer" />`

## 6、在移动端中使用css3部分动画时可能会出现加载页面宽度抖动问题
解决方案：在html顶级div中加入样式`overflow-x: hidden;`或者`overflow-x: hidden;`
