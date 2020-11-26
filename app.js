import Koa from 'koa'
import router from './router'
import bodyParser from 'koa-bodyparser'
import mongoDB from './mongodb/db'
const Send = require('./res/genSend')
const jwt = require('jsonwebtoken');
const config = require('config-lite')(__dirname);
const app = new Koa();

app.context.db = mongoDB.db;
app.context.successSend = Send.successSend;
app.context.failSend = Send.failSend;
app.use(bodyParser());

app.use(async (ctx, next) => {
    let noLogin = ['/api/admin', '/api/weather'];
    const { token } = ctx.header;
    const { path } = ctx.request;
    let loginUser = token && jwt.decode(token);
    if (!noLogin.some(item => path.indexOf(item) === 0)) {
        if (loginUser) {
            app.context.loginUser = loginUser;
            await next();
        } else {
            ctx.body = ctx.failSend(-401);
        }
    } else {
        await next();
    }
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.use(ctx => {
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