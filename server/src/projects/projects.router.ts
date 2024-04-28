import express from 'express';
import * as projectcontroller from './projects.controller';
import { middleware } from '../middleware/middleware';
const router = express.Router();

router.use(middleware);
router.post('/get-projects', projectcontroller.getprojects);
router.post('/start-project', projectcontroller.startproject);
router.post('/get-project', projectcontroller.getproject);
router.get('/get-my-projects', projectcontroller.getmyprojects);

export default router;
