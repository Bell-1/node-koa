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

bloodSugar.get('/change', async ctx => {
    try {
		const {list} = await findList({});
        for (let v of list) {
            ++v.type;
            await update(v._id, v)
		}
		ctx.successSend(list, 'sss')
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


// bloodSugar.put('', bloodsugar)
bloodSugar.delete('/', async ctx => {
    const body = ctx.request.body;
    try {
        if (!body.id) {
            ctx.body = ctx.failSend(-1000014);
            return
        }
        await del(body);
        ctx.body = ctx.successSend(null, '删除成功');
    } catch (error) {
        console.log(error)
        ctx.body = ctx.failSend(-1000014);
    }
})

module.exports = bloodSugar