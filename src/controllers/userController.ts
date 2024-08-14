import { Request, Response } from "express";
import { User, UserProfile } from "../model/userModal";
import { signJwtToken } from "../helper";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        const users_profiles = await UserProfile.find();

        return res.status(200).json({
            message: 'User and thier profiles',
            users,
            users_profiles,
            success: true,
            status: true,
        })
    } catch (err) {

    }
}

export const UserProfileController = async (req: Request, res: Response) => {
    const userId = req.user._id;
    try {
        const user = await User.findById({ _id: userId }, '-password');
        if (!user) {
            return res.status(401).json({
                message: 'User not found !',
                success: false,
                status: false,
            })
        }

        const userProfile = await UserProfile.create({
            user: user._id,
            username: req.body.username,
            img: req.body.img,
            desc: req.body.desc
        })

        user.profile = userProfile._id;

        await user.save();

        const token = signJwtToken({
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
        })

    } catch (err: any) {
        res.status(500).json({
            message: err.message ?? "Internel error",
            success: false,
            status: false
        })
    }
}

export const UserController = async (req: Request, res: Response) => {

    try {
        const isUser = await User.findOne({ email: req.body.email });

        if (isUser) {
            return res.status(401).json({
                message: "Email already registered !",
                success: false,
                status: false
            })
        }

        const user_data = await User.create({
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        })

        const payloadInfo = {
            _id: user_data._id,
            fullname: user_data.fullname,
            email: user_data.email,
            profile: null
        }

        const token = signJwtToken(payloadInfo);

        res.status(200).json({
            message: 'user added successfully',
            token,
            success: true,
            status: true
        })

    } catch (err) {
        console.log(err);
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('profile');
        if (!user) {
            return res.status(302).json({
                message: "user not find.",
                success: false,
                status: true
            })
        }

        if (user.password != password) {
            return res.status(302).json({
                message: "Invalid credentials.",
                success: false,
                status: true
            })
        }

        const token = signJwtToken({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profile: user.profile
        })

        res.status(200).json({
            message: "Log in successfully",
            token,
            success: true,
            status: true
        })

    } catch (err: any) {
        res.status(500).json({
            message: err.message ?? "Internel server error",
            success: false,
            status: true
        })
    }
}

export const getUser = async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { friendId } = req.params;

    try {
        const user_details = await User.findOne({ _id: friendId ? friendId : userId }, '-password -messages').populate('profile')

        if (!user_details) {
            return res.status(401).json({
                message: "User not found !",
                success: false,
                status: false
            })
        }

        res.status(200).json({
            message: 'user get successfully',
            body: user_details,
            success: true,
            status: true
        })

    } catch (err: any) {
        res.status(500).json({
            message: err.message ?? "Internel server error",
            success: false,
            status: true
        })
    }
}

export const clearDB = async (req: Request, res: Response) => {
    console.log("Hello world");
    try{
        await User.deleteMany({});
        return res.status(200).json({
            status: true,
            success: true,
            message: "Database clear successfully.."
        })
    }catch(err: any){
        return res.status(500).json({
            status: false,
            success: false,
            message: err.message,
        })
    }
}