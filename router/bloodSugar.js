import Router from '@koa/router'
import { findList, create, del } from '../controllers/bloodSugar/index'

const bloodSugar = new Router();


bloodSugar.get('/', findList)
bloodSugar.post('/', create)
// bloodSugar.put('', bloodsugar)
bloodSugar.delete('/', del)

module.exports = bloodSugar

