import express from 'express';
import * as maincontroller from './users.controller';
const router = express.Router();

router.get('/get-users', maincontroller.getusers);
router.post('/add-user-if-not-exists', maincontroller.adduserifnotexists);

export default router;
