import express from 'express';
import * as maincontroller from './users.controller';
const router = express.Router();

router.get('/get-users', maincontroller.getusers);
router.post('/add-user', maincontroller.adduser);

export default router;
