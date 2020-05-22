import Router from '@koa/router'
import { getCatalog, getNovel } from '../controllers/reptile/index'

const admin = new Router();

admin.post('/catalog', getCatalog)
admin.post('/novel', getNovel)

module.exports = admin