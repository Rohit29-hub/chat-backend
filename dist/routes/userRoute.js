"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = express_1.default.Router();
router.route('/add_user').post(userController_1.UserController);
router.route('/add_user_profile').post([verifyToken_1.verifyToken], userController_1.UserProfileController);
router.route('/get_all_users').get([verifyToken_1.verifyToken], userController_1.getAllUsers);
router.route('/get_user_details').get([verifyToken_1.verifyToken], userController_1.getUser);
router.route('/get_user_details/:friendId').get([verifyToken_1.verifyToken], userController_1.getUser);
router.route('/login').post(userController_1.login);
router.route('/delete_everything').get(userController_1.clearDB);
exports.default = router;
