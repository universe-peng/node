const Router = require('koa-router')
const axios = require('axios')
const Captcha = require('svg-captcha')
const Time = require('../../../api/methods/time')

const router = new Router()

// 短信验证码
router.post('/sms', async (ctx,next) => {
 const {cellphone} = ctx.request.body
    await axios({
        method: 'POST',
        url: 'https://open.ucpaas.com/ol/sms/sendsms',
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        data : {
            sid: '1316dde41c61a5794d6d0d456c77567c', //开发者账号id
            token: '3831705780cc9e3c26cb929bc3fbc783', //开发者token
            appid: 'd06a9fab383b4f23ac02b9bf17844382', //应用id
            templateid: '506396', //短信模板id
            mobile: cellphone, // 手机号
            uid: '' //透传uid 可为空
        }
    }).then(respone => {
        ctx.body = {
            data: {
                code: Number(respone.data.code),
                result: respone.data.msg
            }
        }
    }).catch(error => {
        console.log(error)
    })
    next()
})

// console.log(Time.futureTime(new Date(new Date(Time.currentTime()).getTime() + 60).getTime()))
// 图形验证码
router.get('/captcha', async (ctx, next) => {
    const createCaptcha = Captcha.create({
        inverse: false, // 是否开启翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 噪声线条数
        width: 100, // 宽度
        height: 40, // 高度
        size: 6,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color:true,
        background: '#333333'
    })
    const CaptchaText = createCaptcha.text.toLowerCase()
    const CaptchaImg = createCaptcha.data

    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes() + 1
    const second = now.getSeconds()
    const expires = `${y}-${(m < 0 ? '0' + m : m)}-${(d < 10 ? '0' + d : d)} ${(hours < 10 ? '0' + hours : hours)}:${(minutes < 10 ? '0' + minutes : minutes)}:${(second < 10 ? '0' + second : second)}`
    console.log(expires, new Date())

    ctx.cookies.set('username','hhh', {
        expires: new Date(expires),
        httpOnly: false,  // 是否只用于http请求中获取
        overwrite: false  // 是否允许重写
     })
    ctx.body = {
        data: {
            code: 200,
            message: '获取图形验证码',
            result: CaptchaImg
        }
    }
})

module.exports = router.routes()