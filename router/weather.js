import Router from '@koa/router'
import { newSeniverseV3 } from '../units/seniverse'

const router = new Router();

/**
 * 查看今天天气
 * @param {*} ctx 
 */
async function fetchNow(ctx) {
    try {
        const seniverseV3 = newSeniverseV3();
        const weatherNow = await seniverseV3.request('weather/now')
        ctx.body = ctx.successSend(weatherNow);
    } catch (error) {
        ctx.body = ctx.successSend(-500, error);
        console.error(error);
    }

}
/**
 * 查询未来几天天气
 * @param {*} ctx 
 */
async function fetchDaily(ctx) {
    try {
		const seniverseV3 = newSeniverseV3();
		const days = +ctx.query.days
		const weatherNow = await seniverseV3.request('weather/daily', {days: 15})
		console.log(weatherNow)
        ctx.body = ctx.successSend(weatherNow);
    } catch (error) {
        ctx.body = ctx.successSend(-500, error);
        console.error(error);
    }

}


router.get('/now', fetchNow);
router.get('/daily', fetchDaily);

module.exports = router;