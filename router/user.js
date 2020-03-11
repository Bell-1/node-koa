const Router = require('@koa/router');

const user = new Router();

user.get('/info', async (ctx) => {
	ctx.body = 'get info'
})

module.exports = user;