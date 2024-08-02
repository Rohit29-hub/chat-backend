"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true
    },
    reciver: {
        type: String,
        required: true
    },
    timeStamps: {
        type: String,
        required: true
    }
});
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
