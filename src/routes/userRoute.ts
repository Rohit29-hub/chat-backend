import express from 'express';
import { UserController, UserProfileController ,getAllUsers, login, getUser} from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';
const router = express.Router();

router.route('/add_user').post(UserController);
router.route('/add_user_profile').post([verifyToken],UserProfileController);
router.route('/get_all_users').get([verifyToken],getAllUsers);
router.route('/get_user_details').get([verifyToken],getUser);
router.route('/get_user_details/:friendId').get([verifyToken],getUser);
router.route('/login').post(login);

export default router;