import { Message } from 'view-design'

export function orderDownload(url, callback) {
    var xhh = new XMLHttpRequest();
    xhh.open("get", url);
    xhh.responseType = "blob";
    xhh.onreadystatechange = function () {
        if (xhh.readyState === 4 && xhh.status === 200) {
            // console.log(xhh)
            // if (xhh.response.indexOf('"code":502') > -1) {
            //     // console.log(JSON.parse(xhh.response).message)
            //     Message.error(JSON.parse(xhh.response).message)
            // }
            // else {
            var name = xhh.getResponseHeader("Content-disposition");
            var filename = name.substring(22, name.length - 1);
            var blob = new Blob([xhh.response], { type: "text/xls" });
            var csvUrl = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = csvUrl;
            // console.log(name)
            // link.download = "健康申报数据.xlsx";
            link.download = filename;
            link.click();
            callback(false)
            // }
        }
    };
    xhh.send();
}