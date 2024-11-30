import e, { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Class from "../app/class"

import { authMiddleware } from "../app/auth"



import { classReq } from "../app/validate"
import path from "path"

const router = Router()


router.post("/", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = classReq.create.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
            return
        }
        const { error, status } = Class.create(path.join(req.user?.id + "", value.department), value)
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
        const { error: validationError, value } = classReq.edit.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
            return
        }
        const { error, status } = Class.edit(path.join(req.user?.id + "", value.department), value)
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
router.put("/subject", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = classReq.addSubject.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
            return
        }
        const { error, status } = Class.addSubject(path.join(req.user?.id + "", value.department), value.classId, value.subjectId, value.facultyIds)
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
        const { error: validationError, value } = classReq.remove.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
            return
        }
        const { error, status } = Class.remove(path.join(req.user?.id + "", value.department), value.id)
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
router.delete("/subject", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = classReq.removeSubject.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "ValidationError", message: validationError.message })
            return
        }
        const { error, status } = Class.removeSubject(path.join(req.user?.id + "", value.department), value.classId, value.subjectId)
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
