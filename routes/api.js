import express from "express"
import AuthRoute from "../src/auth/auth.router"
import UserRoute from  "../src/user/user.router"

const router = express.Router()

router.use("/auth", AuthRoute)
router.use("/user", UserRoute)
export default router
