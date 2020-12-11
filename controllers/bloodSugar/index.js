import bloodSugarModel from '../../models/bloodSugar'

function findAll(query) {
	return new Promise(async (resolve, reject) => {
		console.log(query.page, query.pageSize)
		const page = +(query.page || 1);
		const size = +(query.pageSize || 2);
		try {
			const list = await bloodSugarModel.find().skip((page - 1) * size).sort({ 'time': -1 }).limit(size);
			const total = await bloodSugarModel.find().countDocuments();
			resolve({
				list,
				total
			})
		} catch (error) {
			console.log('err', error);
			reject();
		}

	})
}

export const findList = async ctx => {
	const query = ctx.request.query;
	try {
		const list = await findAll(query);
		ctx.body = ctx.successSend(list, '获取列表成功');
	} catch (err) {
		console.log('查询记录失败', err)
		ctx.body = ctx.failSend(-1000013);
	}
}

function add(body) {
	return new Promise((resolve, reject) => {
		const data = {
			value: body.value,
			time: body.time,
			type: body.type
		}
		const model = new bloodSugarModel(data);
		model.save(async (err, info) => {
			if (err) return reject();
			resolve(info);
		});
	})
}

export const create = async ctx => {
	const body = ctx.request.body;
	try {
		const data = await add(body);
		ctx.body = ctx.successSend(data, '添加成功');
	} catch (error) {
		console.log(error)
		ctx.body = ctx.failSend(-1000012);
	}
}

function delItem(body) {
	return new Promise((resolve, reject) => {
		const data = {
			_id: body.id,
		}
		bloodSugarModel.deleteOne(data, async err => {
			if (err) return reject();
			resolve();
		});
	})
}

export const del = async ctx => {
	const body = ctx.request.body;
	try {
		if (!body.id) {
			ctx.body = ctx.failSend(-1000014);
			return
		}
		await delItem(body);
		ctx.body = ctx.successSend(null, '删除成功');
	} catch (error) {
		console.log(error)
		ctx.body = ctx.failSend(-1000014);
	}
}