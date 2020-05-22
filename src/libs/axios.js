import axios from 'axios';
import {
    Message
} from 'view-design';
import {
    Cookies
} from 'js-cookie';
import config from "@/config";
import router from "../router";
// console.log(router)
const baseUrl = config.baseUrl
// axios.defaults.timeout = 60000;
const base = ''; //process.env.VUE_APP_API_URL;
//axios.defaults.withCredentials = true;
/* 再次封装post */
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
};
/* 再次封装get */
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        baseURL: base,
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
};
/* 再次封装delete请求 */
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        baseURL: base,
        url: url,
        params: params
    });
};
/* 再次封装post */
export const postFormData = (url, params) => {
    return axios({
        method: 'post',
        baseURL: base,
        url: url,
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    });
};

export const downloadRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        responseType: 'blob',
        params: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
}

axios.interceptors.request.use(config => {
    // console.log(config, process.env.NODE_ENV);
    // let baseUrl = process.env.NODE_ENV === 'production' ? '/ict-admin/admin' : '/admin';
    config.url = baseUrl + config.url;
    return config;
});

axios.interceptors.response.use(response => {
    const data = response.data;
    // 根据返回的code值来做不同的处理(和后端约定)
    // 显示loding
    // console.log(data)
    switch (data.code) {
        case 502:
            Message.error({
                content: data.message,
                duration: 3
            })
            break;
        case 401:
            // 未登录 清除已登录状态
            Cookies.set('userInfo', '');
            setStore('accessToken', '');
            location.hash = '#/home';

            break;

        case 500:
            // 错误
            if (data.message !== null) {
                Message.error({
                    content: data.message,
                    duration: 3
                });
            } else {
                Message.error({
                    content: "未知错误",
                    duration: 3
                });
            }
            break;

        case 50201:
            // store.dispatch('delete_user_info');
            Message.error({
                content: "登录超时重新登录!",
                duration: 3
            });
            sessionStorage.clear()
            router.push({
                name: "login"
            })
            // console.log(navigator.userAgent)
            // if (navigator.userAgent.indexOf("DingTalk") > -1) {
            //     authorConfig(function () {
            //         location.hash = '#/home';
            //     });
            // } else {
            //     location.hash = '#/home';
            // }
            break;

        // case 9999100:
        //     store.dispatch('get_access_token')
        //     break;

        // default:
        //     if (data.code != 200 && data.message) {
        //         Message.error({
        //             content: data.message,
        //             duration: 3
        //         });
        //         return data;
        //     } else {
        //         return data;
        //     }
    }
    return data;
}, (err) => {
    // 返回状态码不为200时候的错误处理
    // console.log(88888888888, err);
    Message.error({
        content: err.toString(),
        duration: 3
    });
    return Promise.resolve(err);
});


// new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');