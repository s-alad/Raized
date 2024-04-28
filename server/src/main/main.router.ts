import express from 'express';
import * as maincontroller from './main.controller';
const router = express.Router();

router.get('/', maincontroller.main);
router.get('/check', maincontroller.check);

export default router;
