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
