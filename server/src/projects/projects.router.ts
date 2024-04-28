import express from 'express';
import * as projectcontroller from './projects.controller';
import { middleware } from '../middleware/middleware';
const router = express.Router();

router.use(middleware);
router.get('/get-projects', projectcontroller.getprojects);
router.get('/get-projects-by-search', projectcontroller.getprojectsbysearch);
router.post('/start-project', projectcontroller.startproject);
router.get('/get-project', projectcontroller.getproject);
router.get('/get-my-projects', projectcontroller.getmyprojects);
router.post('/upload-project', projectcontroller.uploadproject);
router.get('/get-featured-project', projectcontroller.getfeaturedproject);
router.post('/update-project-fund', projectcontroller.updateprojectfund);

export default router;
