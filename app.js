(async () => {
    const koa = require('koa') // http 包装过http
    const Router = require('koa-router') // 路由
    const swig = require('koa-swig') // 模板引擎
    const Co = require('co')
    const StaticCache = require('koa-static-cache') // 静态文件处理
    const bodyParser = require('koa-bodyparser')  // 解析post请求正文数据处理
    const Mysql = require('mysql2/promise')
    const cookieParse = require('cookie-parser')

    const Login = require('./router/modules/user/index')

    const fs = require('fs') // 操作文件模块
    const path = require('path') // 当前文件入径模块
    const exec = require('child_process').exec // 操作子进程 如 cmd

    const app = new koa()
    const router = new Router()

// 设置模板引擎
    app.context.render = Co.wrap(swig({
        root: `${__dirname}/SwigViews`, // 模板文件入径
        autoescape: true, // 启用escape编码
        cache: false, // 是否启用缓存，memory: 把解析后的结果保存在内存中
        ext: 'vue' // 模板文件后缀名
    }))

// mysql2 初始化
    /*
    * mysql2 返回值是数组套数组
    *        第一个数组是数据库记录的值
    *        第二个数组是数据库记录中包含的信息
    * */
    const connection = await Mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'studymysql'
    })
    // const [USERS] = await connection.query('SELECT username,age,gender FROM users')

// 路由设置
/*router.post('/test', async (ctx, next) => {
    // 获取数据写入模板引擎并获取内容
    const Swigcontent = await ctx.render('index.vue', {datas: ctx.request.body.content})
    // 写入模板引擎内容
    fs.writeFileSync(`${path.dirname(__dirname)}/create-app/src/views/test/index.vue`, Swigcontent)
    // 调起cmd并执行打包命令
    exec(`${path.dirname(__dirname)}/uni-app/uniapp.bat`, (error, stdout, stderr) => {
        console.log(error,stdout, stderr)
    })

    ctx.body = {
        data: {
            code: 200,
            message: '拿到前端的数据了'
        }
    }
})*/

    // 处理静态文件
    app.use(StaticCache('./static', {
        prefix: '/static', // 前缀
        gzip: true
    }))

    // 处理请求正文中的数据
    app.use(bodyParser())

    // 路由嵌套
    router.use('/user',Login)

    // 挂在路由
    app.use(router.routes())
    // cookie
    app.use(cookieParse())

    // 监听端口以及IP
    app.listen(8081,'192.168.2.248')
})()
