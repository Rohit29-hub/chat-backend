"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middlewares/verifyToken");
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.route('/add_message').post([verifyToken_1.verifyToken], messageController_1.addMessage);
router.route('/getMessage/:friendId/:myId').get([verifyToken_1.verifyToken], messageController_1.getMessage);
exports.default = router;
