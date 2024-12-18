import { Router } from "express"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

import * as Department from "../app/department"
import config from "../app/config"

import { authMiddleware, sign } from "../app/auth"



import { departmentReq, pathValidate } from "../app/validate"
import path from "path"

const router = Router()





router.post("/create", authMiddleware, async (req, res) => {
    const { error: validationError, value } = pathValidate.validate(req.body)

    if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: { name: "ValidationError", message: validationError.message } })
        return
    }
    const department = Department.create(value.name, path.join(req.user!.id + ""))
    res.json(department)
})

router.get("/all", authMiddleware, (req, res) => {
    const { error, departments } = Department.getUserDepartments(path.join(req.user!.id + ""))
    if (error) {
        res.status(StatusCodes.BAD_GATEWAY).json({ error })
        return
    }
    res.json({ departments })
})
router.put("/config", authMiddleware, (req, res) => {
    const { error: pathValidationError } = pathValidate.validate({ name: req.body.name })
    if (pathValidationError) {
        res.json({ error: pathValidationError })
        return
    }
    const validation = departmentReq.config.validate(req.body)
    if (validation.error) {
        res.json({ error: validation.error })
        return
    }
    const { error, department } = Department.get(path.join(req.user?.id + '', validation.value.name))
    if (error) {
        res.json({ error: error })
        return
    }

    Department.setConfig(path.join(req.user?.id + "", department.name), validation.value)
    res.json({ status: { success: "ConfigUpdated", message: "configuration has been updated successfully" } })
})

router.delete("/:name", authMiddleware, (req, res) => {
    const { error } = pathValidate.validate(req.params)
    if (error) {
        res.json({ error })
        return
    }
    const dept = Department.get(path.join(req.user!.id + "", req.params.name))
    if (dept.error) {
        res.json({ error: dept.error })
        return
    }
    const result = Department.remove(path.join(req.user!.id + "", req.params.name))
    if (result) res.json({ status: result, message: "department deleted" })
    else res.json({ status: { status: result, message: "department delete failed" } })
})

router.get("/:name", authMiddleware, (req, res) => {
    const { error: validationError } = pathValidate.validate(req.params)
    if (validationError) {
        res.json({ error: validationError })
        return
    }
    const { error, department } = Department.get(path.join(req.user!.id + "", req.params.name))
    if (error) {
        res.json({ error })
        return
    }
    res.json({ department })
})


export default router
