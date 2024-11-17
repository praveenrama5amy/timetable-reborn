import jwt from "jsonwebtoken"
import fs from "fs"
import { Request,Response,NextFunction} from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { UserPayload } from "../types/interface"

export const PUBLIC_KEY = fs.readFileSync("./keys/accessToken/public.key",{encoding:"utf-8"})
const PRIVATE_KEY = fs.readFileSync("./keys/accessToken/private.key", { encoding: "utf-8" })


declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

export const verify = (token: string) => {
    try {
        const payload:any = jwt.verify(token, PUBLIC_KEY)
        if (typeof payload == "string") return {
            error: "Invalid Token",
            message:"invalid token"
        }
        const data:UserPayload = payload
        return {user:data}
    } catch (err) {
        console.log(err);
        return {error:"InvalidToken",message:"invalid token"}
    }
}

export const sign = (payload:any) => {
    return jwt.sign(payload, PRIVATE_KEY, { expiresIn: "10d",algorithm:"RS256" })
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token);
    if (token == null || token == "") {
        res.status(StatusCodes.UNAUTHORIZED).json({error:"UnAuthorized",message : ReasonPhrases.UNAUTHORIZED})
        return
    }
    const { error, message, user } = verify(token)
    if (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({error,message})
        return
    }
    if (typeof user == "string") {
        res.status(StatusCodes.UNAUTHORIZED).json({error,message})
        return
    }
    req.user = user
    next()
}