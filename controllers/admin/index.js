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


export function findAdmin(data) {
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


export function createAdmin(data) {
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
