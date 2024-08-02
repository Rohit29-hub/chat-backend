import { Request, Response } from "express";
import { User } from "../model/userModal";

export const addMessage = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const senderData = await User.findOne({
            _id: data.senderId,
        })

        const reciverData = await User.findOne({
            _id: data.reciverId,
        })
        
        if(senderData == null || reciverData == null){
            console.log("i am in the error");
            throw new Error("Invalid userId");
        } 

        const msgObj = JSON.stringify({
            sender: data.senderId,
            reciver: data.reciverId,
            message: data.message,
            timestamps: data.message.createdAt
        });

        if(senderData.messages.has(data.reciverId) 
            && reciverData.messages.has(data.senderId)){
            const sender_communication = senderData.messages.get(data.reciverId);
            const reciver_communication = reciverData.messages.get(data.senderId);
            sender_communication!.push(msgObj);
            reciver_communication!.push(msgObj);
        }else{
            senderData.messages.set(data.reciverId, [msgObj]);
            reciverData.messages.set(data.senderId, [msgObj]);
        }

        await senderData.save();
        await reciverData.save();

        return res.json({
            message: 'Message saved!',
            success: true,
            status: true,
        })

    } catch (err: any) {
        res.json({
            message: err.message,
            success: false,
            status: false,
        })
    }
}


export const getMessage = async (req: Request, res: Response) => {
    const {friendId,myId} = req.params;
    try{
        const myFriend = await User.findOne({
            _id: friendId
        })

        if(myFriend!.messages.has(myId)){
            const all_msg = myFriend!.messages.get(myId);
            return res.json({
                messages_data: all_msg,
                message: 'messages found !',
                success: true,
                status: true,
            })
        }

        return res.json({
            messages_data: null,
            message: 'No messages found !',
            success: false,
            status: false
        })

    }catch(err: any){

    }
}
