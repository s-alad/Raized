import express from 'express';
import * as projectcontroller from './projects.controller';
const router = express.Router();

router.post('/get-projects', projectcontroller.getprojects);
router.post('/start-project', projectcontroller.startproject);

export default router;
