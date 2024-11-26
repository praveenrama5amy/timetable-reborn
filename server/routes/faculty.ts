import { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Faculty from "../app/faculty"

import { authMiddleware } from "../app/auth"



import { facultyReq } from "../app/validate"
import path from "path"

const router = Router()


router.post("/", authMiddleware, (req, res) => {
    const { error: validationError, value } = facultyReq.create.validate(req.body)
    if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
        return
    }
    const { error, status } = Faculty.create(path.join(req.user?.id + "", value.department), value.faculty)
    if (error) {
        res.json({ error })
        return
    }
    res.json({ status })
})
router.delete("/", authMiddleware, (req, res) => {
    const { error: validationError, value } = facultyReq.remove.validate(req.body)
    if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
        return
    }
    const { error, status } = Faculty.remove(path.join(req.user?.id + "", value.department), value.id)
    if (error) {
        res.json({ error })
        return
    }
    res.json({ status })
})
router.put("/", authMiddleware, (req, res) => {
    const { error: validationError, value } = facultyReq.edit.validate(req.body)
    if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
        return
    }
    const { error, status } = Faculty.edit(path.join(req.user?.id + "", value.department), value)
    if (error) {
        res.json({ error })
        return
    }
    res.json({ status })
})



export default router
