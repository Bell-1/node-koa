import Koa from 'koa'
import onerror from 'koa-onerror'
import bodyParser from 'koa-bodyparser'
import router from './router'
import mongoDB from './mongodb/db'
const Send = require('./utils/res')
const jwt = require('jsonwebtoken');
const config = require('config-lite')(__dirname);
const app = new Koa();



function provingToken(req) {
    const { token } = req.header;
    if (token) {
        console.log(token)
        return jwt.decode(token);
    } else {
        ctx.failSend(-401);
    }
}

app.context.db = mongoDB.db;
app.context.successSend = Send.successSend;
app.context.failSend = Send.failSend;
app.context.provingToken = provingToken;

app.use(bodyParser());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 404
app.use(ctx => {
    ctx.status = 404;
    ctx.failSend(-404);
});

onerror(app);

//error
// app.on('error', err => {
//     console.log('app error: ', err)
//     ctx.status = 500;
//     ctx.failSend(-500);
// });

function startListen(port = config.port) {
    app.listen(port);
    console.log(`serve start-quick is starting at port ${config.port}`);
}

startListen();