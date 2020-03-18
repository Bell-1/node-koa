import Router from '@koa/router'
import { fetchUserList, fetchUserInfo, createUser, editUser, delUser } from '../controllers/user';

const router = new Router();

router.get('/list', fetchUserList);
router.post('/create', createUser);
router.post('/edit', editUser);
router.get('/info', fetchUserInfo);
router.delete('/del', delUser)

module.exports = router;