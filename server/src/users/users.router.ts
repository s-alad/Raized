import express from 'express';
import * as maincontroller from './users.controller';
const router = express.Router();

router.post('/get-user', maincontroller.getuser);
router.get('/get-users', maincontroller.getusers);
router.post('/add-user-if-not-exists', maincontroller.adduserifnotexists);
router.post('/onboard-user', maincontroller.onboarduser);

export default router;
