import { Router } from "express"

const router = Router()


router.post("/", (req, res) => {
    const { name, email } = req.body
    const msg = "Hello " + name + " email : " + email
    res.json({ msg })
})





export default router

