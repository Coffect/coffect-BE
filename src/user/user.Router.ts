import router from 'express';
import { testuserInfo } from './user.Controller/user.Controller';

const route = router();

route.get('/info', testuserInfo);

export default route;