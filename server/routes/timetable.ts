import { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Conflict from "../app/conflict"
import * as Timetable from "../app/timetable"

import { authMiddleware } from "../app/auth"
import path from "path"
import { timetableReq } from "../app/validate"

const router = Router()


Timetable


router.put("/assign", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = timetableReq.assign.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ validationError })
            return
        }
        const { error, status } = Timetable.assign(path.join(req.user?.id + "", value.name), value.classId, value.day, value.hour, value.subjectId);
        if (error) {
            res.json({ error })
            return
        }
        res.json({ status })
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
    }
})
router.delete("/assign", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = timetableReq.unassign.validate(req.body)
        if (validationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ validationError })
            return
        }
        const { error, status } = Timetable.unassign(path.join(req.user?.id + "", value.name), value.classId, value.day, value.hour)
        if (error) {
            res.status(StatusCodes.NOT_MODIFIED).json({ error })
            return
        }
        res.json({ status })
    }
    catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
    }
})


router.put("/autogenerate", authMiddleware, (req, res) => {
    try {
        // const { error: validationError, value } = timetableReq.unassign.validate(req.body)
        // if (validationError) {
        //     res.status(StatusCodes.BAD_REQUEST).json({ validationError })
        //     return
        // }
        const r = Timetable.autoGenerate(path.join(req.user?.id + "", req.body.name), req.body.hours)

        res.json(r)
    }
    catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err })
    }
})


export default router
