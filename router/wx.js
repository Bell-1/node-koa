import Router from '@koa/router'
import { checkSignature } from '../controllers/wx/index'
const config = require('config-lite')(__dirname);
const wx = new Router();

wx.get('/callback', async (ctx) => {
  const query = ctx.request.query;
  try {
    const res = await checkSignature(query);
    ctx.body = res; //(res, '验证通过');
    } catch (error) {
    
  }
})

export default wx