import Router from '@koa/router'
import { findList, create, del, update } from '../controllers/bloodSugar/index'

const bloodSugar = new Router();

bloodSugar.get('/', async ctx => {
    const query = ctx.request.query;
    try {
        const list = await findList(query);
        ctx.successSend(list, '获取列表成功');
    } catch (err) {
        console.log('查询记录失败', err)
        ctx.failSend(-1000013);
    }
})

bloodSugar.put('/', async ctx => {
    try {
		const body = ctx.request.body;
		const data ={
			time: body.time,
			type: body.type,
			value: body.value,
		}
        const res = await update(body._id, data)
        ctx.successSend(null, '修改成功')
    } catch (err) {
        console.log(111, err)
    }
})

bloodSugar.post('/', async ctx => {
    const body = ctx.request.body;
    try {
        const data = await create(body);
        ctx.body = ctx.successSend(data, '添加成功');
    } catch (error) {
        console.log(error)
        ctx.body = ctx.failSend(-1000012);
    }
})


bloodSugar.delete('/', async ctx => {
    const body = ctx.request.body;
    try {
        if (!body._id) {
            ctx.body = ctx.failSend(-1000014);
            return
        }
        await del(body._id);
        ctx.body = ctx.successSend(null, '删除成功');
    } catch (error) {
        console.log(error)
        ctx.body = ctx.failSend(-1000014);
    }
})

module.exports = bloodSugar