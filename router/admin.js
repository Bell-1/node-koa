const Router = require('@koa/router')
const admin = new Router();
const adminModel = require('../model/adminModel')
const config = require('config-lite')(__dirname)
const _ = require('lodash')
const chalk = require('chalk')
const md5 = require('md5')
var jwt = require('jsonwebtoken');

function findAdmin(data) {
    return new Promise((resolve, reject) => {
        adminModel.findOne({ phone: data.phone }, function(err, info) {
            if (err) return reject(err);
            resolve(info)
        });
    })
}

function createAdmin(data) {
    return new Promise((resolve, reject) => {
        const adminData = {
            name: data.name,
            phone: data.phone,
            email: data.email,
            gender: Number.parseInt(data.gender || 1),
            pwd: md5(data.pwd + config.pwdSecret)
        }
        const newAdmin = new adminModel(adminData);

        newAdmin.save(async (err) => {
            if (err) return reject();
            const info = await findAdmin(data)
            resolve(info);
        });
    })
}

admin.post('/login', async (ctx) => {
    const body = ctx.request.body;
    if (!body.name && !body.phone) {
        ctx.body = ctx.failSend(-100001);
        return
    }
    if (!body.pwd) {
        ctx.body = ctx.failSend(-100002);
        return
    }
    try {
        let info = await findAdmin(body);
        if (!info) {
            ctx.body = ctx.failSend(-100005);
            return
        }
        if (info.pwd !== md5(body.pwd + config.pwdSecret)) {
            ctx.body = ctx.failSend(-100007);
            return
        }
        info = info.toObject();
        let token = jwt.sign(info, config.secretOrPrivateKey, { expiresIn: 60 * 60 * 24 * 7 }); // 或expiresIn : '7 days'
        info.token = token;
        delete info.pwd;
        ctx.body = ctx.successSend(info, '登陆成功');
    } catch (error) {
        console.log(error);
        ctx.req.status = 500;
    }

})

admin.post('/register', async (ctx) => {
    const body = ctx.request.body;
    if (!body.name) {
        ctx.body = ctx.failSend(-100001);
        return
    }
    if (!body.phone) {
        ctx.body = ctx.failSend(-100002);
        return
    }
    if (!body.email) {
        ctx.body = ctx.failSend(-100003);
        return
    }
    if (!body.pwd) {
        ctx.body = ctx.failSend(-100004);
        return
    }
    try {
        const has = await findAdmin(body);
        if (has) {
            ctx.body = ctx.failSend(-100006);
            return
        }
        const info = await createAdmin(body);
        ctx.body = ctx.successSend(info, '注册成功');
    } catch (error) {
        console.log(error);
        ctx.req.status = 500;
    }

})



admin.post('/logout', ctx => {
    ctx.body = ctx.successSend('已退出');
})

admin.get('/info', ctx => {

})

module.exports = admin