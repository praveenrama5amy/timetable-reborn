import { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Conflict from "../app/conflict"
import * as Timetable from "../app/timetable"

import { authMiddleware } from "../app/auth"
import path from "path"
import { pathValidate } from "../app/validate"
import { TIMEOUT } from "dns"

const router = Router()


Timetable

router.get("/:name", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = pathValidate.validate(req.params)
        if (validationError) {
            res.json({ error: validationError })
            return
        }
        res.json({})
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    }
})


export default router
