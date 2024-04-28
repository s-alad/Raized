import express from 'express';
import * as projectcontroller from './projects.controller';
const router = express.Router();

router.post('/get-projects', projectcontroller.getprojects);

export default router;
