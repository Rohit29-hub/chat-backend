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
exports.getMessage = exports.addMessage = void 0;
const userModal_1 = require("../model/userModal");
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const senderData = yield userModal_1.User.findOne({
            _id: data.senderId,
        });
        const reciverData = yield userModal_1.User.findOne({
            _id: data.reciverId,
        });
        if (senderData == null || reciverData == null) {
            console.log("i am in the error");
            throw new Error("Invalid userId");
        }
        const msgObj = JSON.stringify({
            sender: data.senderId,
            reciver: data.reciverId,
            message: data.message,
            timestamps: data.message.createdAt
        });
        if (senderData.messages.has(data.reciverId)
            && reciverData.messages.has(data.senderId)) {
            const sender_communication = senderData.messages.get(data.reciverId);
            const reciver_communication = reciverData.messages.get(data.senderId);
            sender_communication.push(msgObj);
            reciver_communication.push(msgObj);
        }
        else {
            senderData.messages.set(data.reciverId, [msgObj]);
            reciverData.messages.set(data.senderId, [msgObj]);
        }
        yield senderData.save();
        yield reciverData.save();
        return res.json({
            message: 'Message saved!',
            success: true,
            status: true,
        });
    }
    catch (err) {
        res.json({
            message: err.message,
            success: false,
            status: false,
        });
    }
});
exports.addMessage = addMessage;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { friendId, myId } = req.params;
    try {
        const myFriend = yield userModal_1.User.findOne({
            _id: friendId
        });
        if (myFriend.messages.has(myId)) {
            const all_msg = myFriend.messages.get(myId);
            return res.json({
                messages_data: all_msg,
                message: 'messages found !',
                success: true,
                status: true,
            });
        }
        return res.json({
            messages_data: null,
            message: 'No messages found !',
            success: false,
            status: false
        });
    }
    catch (err) {
    }
});
exports.getMessage = getMessage;
