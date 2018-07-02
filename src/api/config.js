/*
 * @Author: ecitlm s
 * @Date: 2017-06-05 10:44:15 s
 * @Last Modified by: ecitlm
 * @Last Modified time: 2017-06-22 14:09:58
 */
import axios from 'axios'
import router from '../router'
import qs from 'qs'
import store from '../store/index'
import * as types from '../store/mutation-types'

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'https://api.it919.cn/public/api';

// POST传参序列化
axios.interceptors.request.use(
    (config) => {
        if (store.state.data.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `token ${store.state.data.token}`
        }
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config;
    },
    (error) => {
        alert('错误的传参')
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401: // 401  旌旗  灵医 , 只用[授权] 旌旗的医生 才是 灵医
                    // 返回 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        return Promise.reject(error.response)   // 返回接口返回的错误信息
    }
);

/**
 * POST 请求方式
 * @param {string} url     请求URL
 * @param {object} params  请求参数
 * @returns s
 */
export default {
    // fetchPost  请求方式
    fetchPost: function(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err);
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    // GET 请求方式
    fetchGet: function(url, params) {
        console.log(params)
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params
            })
            .then(response => {
                // resolve(response.data);
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            });
        })
    }
}

global.bird = 'https://bird.ioliu.cn/v1/?url=';

// 外网测试环境 api代理
// const Proxy = 'https://bird.ioliu.cn/v1/?url=';

// 定义api 接口
global.apiurl = {
    // zhihu: function() {
    //     var zh = Proxy + 'https://zhuanlan.zhihu.com/api/columns/wxyyxc1992';
    // }
}
