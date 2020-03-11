const Router = require('@koa/router');
const admin = require('./admin')
const user = require('./user')

// 装载所有子路由
let router = new Router()
router.use('/api/admin', admin.routes(), user.allowedMethods())
router.use('/api/user', user.routes(), user.allowedMethods())

module.exports = router;