import userModal from '../../model/userModal'

function validateQueryCondition(query) {
    let condition = {};
    return condition
}

function findList(condition) {
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

function validateUserInfo(body, ctx) {
    const { _id, name, phone, email, gender = 1, pwd, status = 1, } = body;
    if (!body.name) {
        ctx.body = ctx.failSend(-100001);
        throw new Error('用户名不能为空')
    }

    if (!body.phone) {
        ctx.body = ctx.failSend(-100002);
        throw new Error('手机号不能为空')
    }

    if (!body.email) {
        ctx.body = ctx.failSend(-100003);
        throw new Error('邮箱不能为空')
    }
    const info = { _id, name, phone, email, gender, pwd, status };

    return info
}

function create(info) {
    return new Promise((resovle, reject) => {
        const user = new userModal(info);
        user.save((err) => {
            err ? reject(err) : resovle();
        });
    })
}

function update({ _id, ...info }) {
    return new Promise(async (resovle, reject) => {
        console.log('update find  ', await findOne({ _id }))
        userModal.updateOne({ _id }, info, {}, (err, info) => {
            if (err) return reject(err);
            console.log('info', info);
            resovle(info);
        });
    })
}


function hasUser({ name, phone, email }, ctx) {
    return new Promise(async (resolve, reject) => {
        const { _id } = ctx.loginUser;
        let has = null,
            code;
        try {
            if (await findOne({ name, pid: _id })) {
                code = -100009;
            } else if (await findOne({ phone, pid: _id })) {
                code = -1000010;
            } else if (await findOne({ email, pid: _id })) {
                code = -1000011;
            }
            resolve(code);
        } catch (error) {
            reject(error)
        }
    })
}



function genFindOne(query) {
    const { name, id } = query;
    if (!name && !id) {
        throw new Error('查询条件为空');
    }

    return id ? { id } : { name };
}

function findOne(condition) {
    return new Promise((resovle, reject) => {
        const _id = condition._id;
        const findApi = _id ? 'findById' : 'findOne';
        userModal.findById(_id, (err, data) => {
            if (err) return reject(err);
            resovle(data);
        })
    })
}



function del(condition) {
    return new Promise((resolve, reject) => {
        userModal.deleteOne(condition, err => {
            if (err) return reject(err);
            resolve();
        })
    })
}

/**
 * 查询用户列表
 * @param {*} ctx 
 */
const fetchUserList = async (ctx) => {
    try {
        const { _id } = ctx.loginUser;
        const condition = validateQueryCondition(ctx.query);
        const data = await findList({ ...condition, pid: _id });
        ctx.body = ctx.successSend(data, '获取成功');
    } catch (error) {
        console.log(error);
        ctx.body = ctx.failSend(-500);
    }
}

/**
 * 新建用户
 * @param {*} ctx 
 */
const createUser = async (ctx) => {
    const body = ctx.request.body;
    try {
        const info = await validateUserInfo(body, ctx);
        const pid = ctx.loginUser._id;
        const code = await hasUser({ info, pid }, ctx);
        if (code) {
            ctx.body = ctx.failSend(code);
            return;
        }
        await create({ ...info, pid });
        console.log('success')
        ctx.body = ctx.successSend({}, '创建用户成功');
    } catch (error) {
        ctx.body = ctx.failSend();
        console.log('create user: ', error)
    }
}


/**
 * 编辑用户
 * @param {*} ctx 
 */
const editUser = async (ctx) => {
    const body = ctx.request.body;
    try {
        const info = await validateUserInfo(body, ctx);
        const { _id, name, phone, email } = info;
        await update(info);
        ctx.body = ctx.successSend({}, '修改用户成功');
    } catch (error) {
        ctx.body = ctx.failSend();
        console.error('create user: ', error)
    }
}

/**
 * 查询单个用户
 * @param {*} ctx 
 */
const fetchUserInfo = async (ctx) => {
    try {
        const condition = genFindOne(ctx.query);
        const user = await findOne(condition);
        if (user) {
            ctx.body = ctx.successSend(user, '查询用户成功');
        } else {
            ctx.body = ctx.failSend(-100008);
        }
    } catch (error) {
        console.error('user info:', error);
    }
}

/**
 * 删除用户
 * @param {*} ctx 
 */
const delUser = async (ctx) => {
    try {
        const { _id } = ctx.request.body;
        if (!_id) {
            ctx.body = ctx.failSend(-100008);
            return;
        }
        await del({ _id });
        ctx.body = ctx.successSend('成功删除用户');
    } catch (error) {
        ctx.body = ctx.failSend(-500);
        console.error('user info:', error)
    }
}


module.exports = {
    createUser,
    editUser,
    fetchUserList,
    fetchUserInfo,
    delUser,
}