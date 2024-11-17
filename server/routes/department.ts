import { Router } from "express"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

import * as Department from "../app/department"
import config from "../app/config"

import { authMiddleware, sign } from "../app/auth"



import { pathValidate } from "../app/validate"
import path from "path"

const router = Router()





router.post("/create", authMiddleware, async (req, res) => {
    const { error: validationError, value } = pathValidate.validate(req.body)

    if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
        return
    }
    const department = Department.create(value.name, path.join(req.user!.id + ""))
    res.json({ status: department })
})



export default router
