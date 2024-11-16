import { Router } from "express"
import {StatusCodes,ReasonPhrases} from "http-status-codes"

import * as Department from "../app/department"

const router = Router()



router.post("/create", (req, res) => {
    const { name }:{name:string} = req.body
    if (name == null || name.trim() == "") {
        res.status(StatusCodes.BAD_REQUEST).json({error:ReasonPhrases.BAD_REQUEST})
        return
    }
    const department = Department.create(name)
    res.json({status:department})
})


export default router
