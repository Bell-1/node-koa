import Router from '@koa/router'
import admin from './admin'
import user from './user'
import weather from './weather'
import reptile from './reptile'
import bloodSugar from './bloodSugar'

// 装载所有子路由
let router = new Router()
router.use('/api/admin', admin.routes(), admin.allowedMethods())
router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/weather', weather.routes(), weather.allowedMethods())
router.use('/api/reptile', reptile.routes(), reptile.allowedMethods())
router.use('/api/bloodSugar', bloodSugar.routes(), bloodSugar.allowedMethods())

export default router;