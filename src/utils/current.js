// 判断当前系统
let systemType = (function () {
    var agent = navigator.userAgent.toLowerCase();
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
        //console.log("这是windows32位系统");
        return 'windows';
    }
    if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
        // console.log("这是windows64位系统");
        return 'windows';
    }
    if (isMac) {
        // console.log("这是mac系统");
        return 'mac';
    }
    return 'windows';
})();
// 时间格式转换
export function dateFormat(date, format) {
    if (systemType == 'mac') {
        // console.log(date)
        date = date.substr(0, 19);
        // console.log(date)
    }
    let time = new Date(date);
    let add0 = (m) => m < 10 ? '0' + m : m;
    let y = time.getFullYear();
    let m = add0(time.getMonth() + 1);
    let d = add0(time.getDate());
    let h = add0(time.getHours());
    let mm = add0(time.getMinutes());
    let s = add0(time.getSeconds());
    switch (format) {
        case 'MM-DD':
            return `${m}-${d}`;
        case 'h:m':
            return `${h}:${mm}`;
        case 'YY:MM:DD':
            return `${y}年${m}月${d}日`;
        case 'YY-MM-DD':
            return `${y}-${m}-${d}`;
        case 'MM-DD h:m':
            return `${m}-${d}  ${h}:${mm}`;
        case 'MM-DD h:m:d':
            return `${m}-${d}  ${h}:${mm}:${s}`;
        case 'YY-MM-DD h:m:d':
            return `${y}-${m}-${d}  ${h}:${mm}:${s}`;
        case 'YY-MM-DD h:m':
            return `${y}-${m}-${d}  ${h}:${mm}`;
        case 'M':
            return `${m}月${d}日  ${h}:${mm}:${s}`;
        case 'D':
            return `${d}天  ${h}:${mm}:${s}`;
        case 'H':
            return `${h}:${mm}:${s}`;
        case 'MM':
            return `${mm}:${s}`;
        case 's':
            return s;
        case 'd':
            return d;
        default:
            return `${y}-${m}-${d}  ${h}:${mm}:${s}`;


        // date = new Date(+new Date(date) + 8 * 3600 * 1000
        // )
        //     .toISOString()
        //     .replace(/T/g, " ")
        //     .replace(/\.[\d]{3}Z/, "");
    }
}


export function StateTree(list, switch1, obj, result) {
    list.map(item => {
        obj = {
            label: item.id, title: item.title,
            children: item.children,
            level: item.level
        };
        if (item.disabled == false) {
            result.push(obj);
        } else if (switch1 == true) {
            result.push(obj);
        }
        return result
    })
}

// 邮箱验证
export const validateEmail = (rule, value, callback) => {
    let reg = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
    if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确'));
    } else {
        callback();
    }
};
// 固定电话号码验证
export const checkTel = (rule, value, callback) => {
    if (!(/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,4}))?$/.test(value))) {
        callback(new Error('请输入正确的电话号码!'));
    } else {
    } callback();
};
// 手机号码验证
export const validatePhone = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('手机号不能为空'));
    } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback('手机号格式不正确');
    } else {
        callback();
    }
};