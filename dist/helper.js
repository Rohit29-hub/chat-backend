"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.signJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = "rohitkohli@1977";
const signJwtToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: '1d'
    });
    return token;
};
exports.signJwtToken = signJwtToken;
// check the user in map and update their status
const updateUser = (map, profile, newSocketId) => {
    for (let [key, value] of map.entries()) {
        if (value._id === profile._id) {
            map.delete(key); // delete the previous user connection
            break;
        }
    }
    // change the status and set in the map
    profile.status = 'online';
    map.set(newSocketId, profile);
};
exports.updateUser = updateUser;
