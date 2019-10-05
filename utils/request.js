const axios = require('axios')
const service = axios.create({
    timeout: 500000,
    responseType: 'json',
    // 向后端发送请求数据
    transformRequest: [requestData => {
        return requestData
    }],
    // 后端返回数据
    transformResponse: [responseData => {
        return responseData
    }],
})

// 请求前拦截
service.interceptors.request.use(config => {
    // 发送请求之前做某事
    return config
}, error => {
    // 请求错误时做某事
    return Promise.reject(error)
})

// 请求响应后拦截
service.interceptors.response.use(respone => {
    return respone
},error => {
    return error
})

module.exports = service