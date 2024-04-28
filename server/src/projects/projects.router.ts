import express from 'express';
import * as projectcontroller from './projects.controller';
import { middleware } from '../middleware/middleware';
const router = express.Router();

/* router.use(middleware); */
router.get('/get-projects', projectcontroller.getprojects);
router.get('/get-projects-by-search', projectcontroller.getprojectsbysearch);
router.get('/get-project', projectcontroller.getproject);
router.get('/get-featured-project', projectcontroller.getfeaturedproject);
router.get('/get-stats', projectcontroller.getstats);

router.post('/start-project', middleware, projectcontroller.startproject);
router.get('/get-my-projects', middleware, projectcontroller.getmyprojects);
router.post('/upload-project', middleware, projectcontroller.uploadproject);
router.post('/update-project-fund',middleware, projectcontroller.updateprojectfund);

export default router;
