import Router from '@koa/router'
import { login, logout, register, userInfo } from '../controllers/admin/index'

const admin = new Router();

admin.post('/login', login)

admin.post('/register', register)

admin.post('/logout', logout)

admin.get('/info', userInfo)

module.exports = admin