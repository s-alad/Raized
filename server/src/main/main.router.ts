import express from 'express';
import * as maincontroller from './main.controller';
const router = express.Router();

router.get('/main', maincontroller.mainfxn);
router.get('/checkdb', maincontroller.checkdb);

export default router;
