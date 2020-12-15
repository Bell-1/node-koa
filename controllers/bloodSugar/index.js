import bloodSugarModel from '../../models/bloodSugar'

export function findList(query) {
    return new Promise(async (resolve, reject) => {
        const page = +(query.page || 1);
        const size = +(query.pageSize || 10);
        try {
            let where = {};
            if (query.type > 0) {
                where.type = query.type
            };
            const list = await bloodSugarModel.find(where).skip((page - 1) * size).sort({ 'time': -1 }).limit(size);
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


export function create(body) {
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

export async function update(_id, data) {
    return bloodSugarModel.updateOne({ _id }, data);
}


export function del(body) {
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