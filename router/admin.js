import Router from '@koa/router'
import { findAdmin, logout, createAdmin, userInfo } from '../controllers/admin/index'
import md5 from 'md5'
const config = require('config-lite')(__dirname);
const admin = new Router();

admin.post('/login', async (ctx) => {
    const body = ctx.request.body;
    if (!body.name && !body.phone) {
        ctx.failSend(-100001);
        return
    }
    if (!body.pwd) {
        ctx.failSend(-100002);
        return
    }
    try {
        let info = await findAdmin(body);
        if (!info) {
            //没有此有用户
            ctx.failSend(-100005);
            return
        }
        if (info.pwd !== md5(body.pwd + config.pwdSecret)) {
            //密码验证
            ctx.failSend(-100007);
            return
        }
        delete info.pwd;
        ctx.successSend(info, '登陆成功');
    } catch (error) {
        console.log('login error', error);
        ctx.req.status = 500;
    }

})

admin.post('/register', async (ctx) => {
    const body = ctx.request.body;
    if (!body.name) {
        ctx.failSend(-100001);
        return
    }
    if (!body.phone) {
        ctx.failSend(-100002);
        return
    }
    if (!body.email) {
        ctx.failSend(-100003);
        return
    }
    if (!body.pwd) {
        ctx.failSend(-100004);
        return
    }
    try {
        const has = await findAdmin(body);
        if (has) {
            ctx.failSend(-100006);
            return
        }
        const info = await createAdmin(body);
        ctx.successSend(info, '注册成功');
    } catch (error) {
        console.log('error error', error);
        ctx.req.status = 500;
    }

})

admin.post('/logout', async ctx => { ctx.successSend('已退出') })

admin.get('/info', async ctx => {
    ctx.successSend(userInfo);
    // const userInfo = ctx.provingToken(ctx.request);
    // if (!userInfo) return;
    // const userInfo = await findAdmin(ctx.userInfo);
})

module.exports = admin