import {Router} from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addMessage , getMessage} from '../controllers/messageController';
const router = Router();

router.route('/add_message').post([verifyToken],addMessage);
router.route('/getMessage/:friendId/:myId').get([verifyToken],getMessage);

export default router;