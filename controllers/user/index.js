import userModal from '../../model/userModal'

function validateQueryCondition(query) {
    const { name, phone, email } = query
    let condition = [];
    if (name) {
        condition.push({ name: new RegExp(name) })
    }
    if (phone) {
        condition.push({ phone: new RegExp(phone) })
    }
    if (email) {
        condition.push({ email: new RegExp(email) })
    }
    return condition.length ? {
        $or: condition,
    } : {}
}

function findList(condition, { page = 1, pageSize = 10, pid } = filter) {
    return new Promise((resolve, reject) => {
        userModal.count({ ...condition, pid }, function(err, count) {
            if (err) return reject;
            if (count === 0) {
                //没有数据
                resolve({
                    list: [],
                    page: 1,
                    totalPage: 1,
                })
                return;
            }
            const totalPage = Math.ceil(count / pageSize);
            if (page > totalPage) page = totalPage;
            userModal.find({ ...condition, pid })
                .skip((page - 1) * pageSize)
                .limit(+pageSize)
                .exec(function(err, list) {
                    if (err) return reject(err);
                    resolve({
                        list,
                        page: +page,
                        totalPage,
                    });
                })
        });
    })
}

function validateUserInfo(body, ctx) {
    const { _id, name, phone, email, gender = 1, pwd, status = 1, } = body;
    if (!name) {
        ctx.body = ctx.failSend(-100001);
        throw new Error('用户名不能为空');
    }

    if (!phone) {
        ctx.body = ctx.failSend(-100002);
        throw new Error('手机号不能为空');
    }

    if (!email) {
        ctx.body = ctx.failSend(-100003);
        throw new Error('邮箱不能为空');
    }
    if (!pwd || pwd.length < 6 || pwd.length > 32) {
        ctx.body = ctx.failSend(-100004);
        throw new Error('密码不能为空');
    }
    let info = {
        name,
        phone,
        email,
        gender,
        pwd,
        status
    };
    if (_id) { info._id = _id }
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
        userModal.updateOne({ _id }, info, {}, (err, info) => {
            if (err) return reject(err);
            resovle(info);
        });
    })
}


function hasUser({ name, phone, email }, ctx) {
    return new Promise(async (resolve, reject) => {
        const { _id } = ctx.loginUser;
        if (await findOne({ name, pid: _id })) {
            ctx.body = ctx.failSend(-100009);
            reject();
            throw new Error('用户名已存在');
        } else if (await findOne({ phone, pid: _id })) {
            ctx.body = ctx.failSend(-1000010);
            reject();
            throw new Error('手机号已存在');
        } else if (await findOne({ email, pid: _id })) {
            ctx.body = ctx.failSend(-1000011);
            reject();
            throw new Error('邮箱已存在');
        }
        resolve();
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
        const { page = 1, pageSize = 10 } = ctx.query;
        const data = await findList({ ...condition }, { page, pageSize, pid: _id });
        ctx.body = ctx.successSend(data, '获取成功');
    } catch (error) {
        ctx.body = ctx.failSend();
    }
}

/**
 * 新建用户
 * @param {*} ctx 
 */
const createUser = async (ctx) => {
    const body = ctx.request.body;
    const pid = ctx.loginUser._id;
    let info = null;
    try {
        info = validateUserInfo(body, ctx);
        await hasUser({ info, pid }, ctx);
    } catch (error) {
        return
    }
    try {
        await create({ ...info, pid });
        ctx.body = ctx.successSend({}, '创建用户成功');
    } catch (error) {
        console.error('create', error)
        ctx.body = ctx.failSend();
    }
}


/**
 * 编辑用户
 * @param {*} ctx 
 */
const editUser = async (ctx) => {
    const body = ctx.request.body;
    try {
        const info = validateUserInfo(body, ctx);
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