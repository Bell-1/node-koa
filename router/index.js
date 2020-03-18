import Router from '@koa/router'
import admin from './admin'
import user from './user'

// 装载所有子路由
let router = new Router()
router.use('/api/admin', admin.routes(), admin.allowedMethods())
router.use('/api/user', user.routes(), user.allowedMethods())

export default router;