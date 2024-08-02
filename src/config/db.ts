import mongoose from "mongoose";

export const connect_to_db = async () => {
    try {
        await mongoose.connect('mongodb+srv://rohitk29032005:nMRiYFe56MzWZrrN@cluster0.wli7c2c.mongodb.net/');
        console.log("database connected !");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}