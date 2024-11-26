import { Router } from "express"
import { StatusCodes } from "http-status-codes"

import * as Conflict from "../app/conflict"

import { authMiddleware } from "../app/auth"
import path from "path"
import { pathValidate } from "../app/validate"

const router = Router()


console.log(Conflict.validateEntries("1/mca"));

router.get("/:name", authMiddleware, (req, res) => {
    try {
        const { error: validationError, value } = pathValidate.validate(req.params)
        if (validationError) {
            res.json({ error: validationError })
            return
        }
        const stat = Conflict.validateEntries(path.join(req.user?.id + '', value.name))
        res.json(stat)
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    }
})


export default router
