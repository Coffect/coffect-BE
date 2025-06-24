import Router from 'express';
import { testuserInfo } from './user.Controller/user.Controller';

const router = Router();

router.get('/info', testuserInfo);

export default router;