import { Router } from "express"
import { StatusCodes } from "http-status-codes"


import { authMiddleware } from "../app/auth"


const router = Router()

router.get("/me", authMiddleware, (req, res) => {
    res.json(req.user)
})




export default router
