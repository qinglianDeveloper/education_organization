let state = process.env.NODE_ENV === 'production';
// 判断是开发环境还是生成环境，如果是开发环境需要代理转发
export function getBlob(url) {
    let URL
    if (!state) {
        URL = url.split('http://172.16.200.204:8888').join('')
    } else {
        URL = url
    }
    // console.log(URL)
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", URL, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };
        xhr.send();
    });
}