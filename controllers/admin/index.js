import adminModel from '../../models/admin'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
const config = require('config-lite')(__dirname);

/**
 * 生产token
 * @param {*} info 
 */
function genToken(info = {}) {
    return jwt.sign(info, config.secretOrPrivateKey, { expiresIn: 60 * 60 * 24 * 7 }); // 或expiresIn : '7 days'
}


function findAdmin(data) {
    return new Promise((resolve, reject) => {
        adminModel.findOne({ phone: data.phone }, function (err, userInfo) {
            if (err) return reject(err);
            if (userInfo) {
                userInfo = userInfo.toObject();
                userInfo.token = genToken(userInfo);
            }
            resolve(userInfo)
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

const login = async (ctx) => {
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
            //没有此有用户
            ctx.body = ctx.failSend(-100005);
            return
        }
        if (info.pwd !== md5(body.pwd + config.pwdSecret)) {
            //密码验证
            ctx.body = ctx.failSend(-100007);
            return
        }
        delete info.pwd;
        ctx.body = ctx.successSend(info, '登陆成功');
    } catch (error) {
        console.log('login error', error);
        ctx.req.status = 500;
    }

}

const register = async (ctx) => {
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
        console.log('error error', error);
        ctx.req.status = 500;
    }

}

const logout = async ctx => { ctx.body = ctx.successSend('已退出') }

const userInfo = async ctx => {
    const userInfo = await findAdmin(ctx.loginUser);
    ctx.body = ctx.successSend(userInfo);
}

module.exports = {
    login,
    register,
    logout,
    userInfo,
}