import Koa from 'koa'
import onerror from 'koa-onerror'
import bodyParser from 'koa-bodyparser'
import router from './router'
import mongoDB from './mongodb/db'
const Send = require('./res/genSend')
const jwt = require('jsonwebtoken');
const config = require('config-lite')(__dirname);
const app = new Koa();


onerror(app);

function checkLogin(...arg) {
    const { token } = this.request.header;
    let loginUser = token && jwt.decode(token);
    return !!loginUser
}

app.context.db = mongoDB.db;
app.context.successSend = Send.successSend;
app.context.failSend = Send.failSend;
app.context.checkLogin = checkLogin;
app.use(bodyParser());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.use(ctx => {
    console.log(ctx.request.path)
    ctx.status = 404;
    ctx.body = {
        status: 404,
        msg: '接口不存在'
    }
});

app.on('error', err => {
    console.log('app error: ', err)
    ctx.status = 500;
    ctx.body = {
        status: -500,
        msg: '服务器错误'
    }
});

function startListen(port = config.port) {
    app.listen(port);
    console.log(`[node-koa] start-quick is starting at port ${config.port}`);
}

startListen();