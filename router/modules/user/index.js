const Router = require('koa-router') /// 路由
const axios = require('axios') //
const Captcha = require('svg-captcha') // 图形验证码
const crypto = require('crypto') // 加密
const Mysql = require('mysql2')

const router = new Router()
const Secretkey = 'student'

// mysql2 初始化
/*
* mysql2 返回值是数组套数组
*        第一个数组是数据库记录的值
*        第二个数组是数据库记录中包含的信息
* */
const connection = Mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'applets'
})


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

// 图形验证码
router.get('/captcha', async (ctx, next) => {
    const createCaptcha = await Captcha.create({
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
    const CaptchaText = await createCaptcha.text.toLowerCase()
    const CaptchaImg = createCaptcha.data
    const encryption = await crypto.createHmac('md5', Secretkey).update(CaptchaText).digest('hex')

    await ctx.cookies.set('captcha',encryption, {
        maxAge: 60 * 1000,
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

// 注册账号
router.post('/logging', async (ctx, next) => {
    const {validCode,cellphone,password} = ctx.request.body
    const encryption = await crypto.createHmac('md5', Secretkey).update(validCode.toLowerCase()).digest('hex')

    if (!ctx.cookies.get('captcha')) {
        ctx.body = {
            data: {
                code: 404,
                message: '验证码已过期'
            }
        }
    }

    if (ctx.cookies.get('captcha') && !(ctx.cookies.get('captcha') === encryption)) {
        ctx.body = {
            data: {
                code: 404,
                message: '您输入的验证码不正确'
            }
        }
    }

    if ((ctx.cookies.get('captcha') === encryption) && cellphone && password && cellphone !== '' && password !== '') {

        await connection.promise().query('select phone from user').then(async results => {
            const [user] = results
            const Phone = await user.filter(item => item.phone === cellphone)[0]
            Phone ? ctx.body = {
                data: {
                    code: 404,
                    message: '该手机号码已经注册过了！！！'
                }

                // 注意：当执行char型号数据时，SQL语句中的values值类型会发生改变
            } : await connection.promise().query(`insert into user(username,password,phone) values('','${password}','${cellphone}')`)
                .then(result => {
                    ctx.body = {
                        data: {
                            code: 200,
                            message: '注册成功'
                        }
                    }
                }).catch(error => {
                    console.log(error, '插入内容失败=================================')
                })
        }).catch(error => {
            console.log(error, '===================')
        })
    }
})

module.exports = router.routes()