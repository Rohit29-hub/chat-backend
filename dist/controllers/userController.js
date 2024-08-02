"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.login = exports.UserController = exports.UserProfileController = exports.getAllUsers = void 0;
const userModal_1 = require("../model/userModal");
const helper_1 = require("../helper");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModal_1.User.find();
        const users_profiles = yield userModal_1.UserProfile.find();
        return res.status(200).json({
            message: 'User and thier profiles',
            users,
            users_profiles,
            success: true,
            status: true,
        });
    }
    catch (err) {
    }
});
exports.getAllUsers = getAllUsers;
const UserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    try {
        const user = yield userModal_1.User.findById({ _id: userId }, '-password');
        if (!user) {
            return res.status(401).json({
                message: 'User not found !',
                success: false,
                status: false,
            });
        }
        const userProfile = yield userModal_1.UserProfile.create({
            user: user._id,
            username: req.body.username,
            img: req.body.img,
            desc: req.body.desc
        });
        user.profile = userProfile._id;
        yield user.save();
        const token = (0, helper_1.signJwtToken)({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profile: userProfile
        });
        res.status(200).json({
            message: 'Profile created successfully',
            success: true,
            token: token,
            status: true
        });
    }
    catch (err) {
        res.status(500).json({
            message: (_a = err.message) !== null && _a !== void 0 ? _a : "Internel error",
            success: false,
            status: false
        });
    }
});
exports.UserProfileController = UserProfileController;
const UserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUser = yield userModal_1.User.findOne({ email: req.body.email });
        if (isUser) {
            return res.status(401).json({
                message: "Email already registered !",
                success: false,
                status: false
            });
        }
        const user_data = yield userModal_1.User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        });
        const payloadInfo = {
            _id: user_data._id,
            fullname: user_data.fullname,
            email: user_data.email,
            profile: null
        };
        const token = (0, helper_1.signJwtToken)(payloadInfo);
        res.status(200).json({
            message: 'user added successfully',
            token,
            success: true,
            status: true
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.UserController = UserController;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const user = yield userModal_1.User.findOne({ email }).populate('profile');
        if (!user) {
            return res.status(302).json({
                message: "user not find.",
                success: false,
                status: true
            });
        }
        if (user.password != password) {
            return res.status(302).json({
                message: "Invalid credentials.",
                success: false,
                status: true
            });
        }
        const token = (0, helper_1.signJwtToken)({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profile: user.profile
        });
        res.status(200).json({
            message: "Log in successfully",
            token,
            success: true,
            status: true
        });
    }
    catch (err) {
        res.status(500).json({
            message: (_a = err.message) !== null && _a !== void 0 ? _a : "Internel server error",
            success: false,
            status: true
        });
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { friendId } = req.params;
    try {
        const user_details = yield userModal_1.User.findOne({ _id: friendId ? friendId : userId }, '-password -messages').populate('profile');
        if (!user_details) {
            return res.status(401).json({
                message: "User not found !",
                success: false,
                status: false
            });
        }
        res.status(200).json({
            message: 'user get successfully',
            body: user_details,
            success: true,
            status: true
        });
    }
    catch (err) {
        res.status(500).json({
            message: (_a = err.message) !== null && _a !== void 0 ? _a : "Internel server error",
            success: false,
            status: true
        });
    }
});
exports.getUser = getUser;
