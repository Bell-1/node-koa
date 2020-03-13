const Router = require('@koa/router');
const userModal = require('../model/userModal')

const user = new Router();

function validateQueryCondition(query) {
    console.log(query);
    let condition = {};
    return condition
}

function findUser(condition) {
    return new Promise((resolve, reject) => {
        userModal.find(condition, function(err, list) {
            if (err) return reject(err);
            const page = 1;
            const totalPage = 2;
            const size = 10;
            resolve({
                list,
                page,
                totalPage,
                size
            });
        });
    })
}

function validateCreate(body, ctx) {

    if (!body.name) {
        ctx.body = ctx.failSend("-100001");
        throw new Error('用户名不能为空')
    }

    if (!body.phone) {
        ctx.body = ctx.failSend("-100002");
        throw new Error('手机号不能为空')
    }

    if (!body.email) {
        ctx.body = ctx.failSend("-100003");
        throw new Error('邮箱不能为空')
    }
    const info = {
        name: body.name,
        phone: body.phone,
        email: body.email,
        gender: body.gender || 1,
        pwd: body.pwd,
        pid: body.pid,
        status: 1,
    };

    return info
}

function createUser(info) {
    return new Promise((resovle, reject) => {
        const user = new userModal(info);
        user.save((err) => {
            console.log(err)
            err ? reject(err) : resovle();
        });
    })
}

user.get('/list', async (ctx) => {
    try {
        const condition = validateQueryCondition(ctx.query);
        const data = await findUser(condition);
        ctx.body = ctx.successSend(data, '获取成功');
    } catch (error) {
        console.log(error);
        ctx.body = ctx.failSend('-400');
    }
})

function hasUser({ name, phone, email, pid }, ctx) {
    return new Promise(async (resolve, reject) => {
        let has = null,
            code;
        try {
            if (await findOne({ name, pid })) {
                code = '-100009';
            } else if (await findOne({ phone, pid })) {
                code = '-1000010';
            } else if (await findOne({ email, pid })) {
                code = '-1000011';
            }
            resolve(code);
        } catch (error) {
            reject(error)
        }
    })
}

user.post('/create', async (ctx) => {
    const body = ctx.request.body;
    try {
        const info = await validateCreate(body, ctx);
        console.log(info)
        const code = await hasUser(info, ctx);
        console.log(code)
        if (code) {
            ctx.body = ctx.failSend(code);
            return;
        }
        await createUser(info);
        console.log('success')
        ctx.body = ctx.successSend({}, '创建用户成功');
    } catch (error) {
        ctx.body = ctx.failSend('-500');
        console.log('create user: ', error)
    }
})


user.post('/edit', async (ctx) => {
    ctx.body = 'get info'
})

function genFindOne(query) {
    const { name, id } = query;
    if (!name && !id) {
        throw new Error('查询条件为空');
    }

    return id ? { id } : { name };
}

function findOne(condition) {
    return new Promise((resovle, reject) => {
        userModal.findOne(condition, (err, data) => {
            if (err) return reject(err);
            resovle(data);
        })
    })
}

user.get('/info', async (ctx) => {
    try {
        console.log('condition', ctx.query)
        const condition = genFindOne(ctx.query);
        const user = await findOne(condition);
        if (user) {
            ctx.body = ctx.successSend(user, '创建用户成功');
        } else {
            ctx.body = ctx.failSend('-100008');
        }
    } catch (error) {
        console.log('user info:', error);
    }
})

function delUser(condition) {
    return new Promise((resolve, reject) => {
        userModal.remove(condition, err => {
            if (err) return reject(err);
            resolve();
        })
    })
}

user.delete('/del', async (ctx) => {
    try {
        const { _id } = ctx.request.body;
        if (!_id) {
            ctx.body = ctx.failSend('-100008');
            return;
        }
        await delUser({ _id });
        ctx.body = ctx.successSend(user, '用户已删除');
    } catch (error) {
        console.log('user info:', error)
    }
})

module.exports = user;