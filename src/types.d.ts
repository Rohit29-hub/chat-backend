import { AnyKeys } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
