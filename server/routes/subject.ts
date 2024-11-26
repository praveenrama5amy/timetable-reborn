import { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Subject from "../app/subject"

import { authMiddleware } from "../app/auth"



import { subjectReq } from "../app/validate"
import path from "path"

const router = Router()


router.post("/", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = subjectReq.create.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
            return
        }
        const { error, status } = Subject.create(path.join(req.user?.id + "", value.department), value.subject)
        if (error) {
            res.json({ error })
            return
        }
        res.json({ status })
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    }
})
router.delete("/", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = subjectReq.remove.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
            return
        }
        const { error, status } = Subject.remove(path.join(req.user?.id + "", value.department), value.id)
        if (error) {
            res.json({ error })
            return
        }
        res.json({ status })
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    }
})
router.put("/", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = subjectReq.edit.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
            return
        }
        const { error, status } = Subject.edit(path.join(req.user?.id + "", value.department), value)
        if (error) {
            res.json({ error })
            return
        }
        res.json({ status })
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    }
})



export default router
