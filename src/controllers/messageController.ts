import { Request, Response } from "express";
import { User } from "../model/userModal";

export const addMessage = async (req: Request, res: Response) => {
    const data = req.body;
    try {

        const senderData = await User.findOne({
            _id: data.sender,
        })

        const reciverData = await User.findOne({
            _id: data.receiver,
        })

        if(senderData == null || reciverData == null){
            throw new Error("Invalid userId");
        } 

        const msgObj = JSON.stringify({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            timestamps: data.timestamps
        });

        if(senderData.messages.has(data.receiver) 
            && reciverData.messages.has(data.sender)){
            const sender_communication = senderData.messages.get(data.receiver);
            const reciver_communication = reciverData.messages.get(data.sender);
            sender_communication!.push(msgObj);
            reciver_communication!.push(msgObj);
        }else{
            senderData.messages.set(data.receiver, [msgObj]);
            reciverData.messages.set(data.sender, [msgObj]);
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
    const {friendId, myId} = req.params;
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
