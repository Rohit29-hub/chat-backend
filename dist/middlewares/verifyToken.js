"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = "rohitkohli@1977";
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access",
                success: false,
                status: false
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        // @ts-ignore
        req['user'] = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Token expired",
            success: false,
            status: false
        });
    }
};
exports.verifyToken = verifyToken;
