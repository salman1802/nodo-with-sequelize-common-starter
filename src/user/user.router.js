import AsyncHandler from "express-async-handler";
import express from "express";
import {  forgot,editProfile} from "./dto/user.dto";
import UserController from "./user.controller";
import Validator from "../common/config/joi-validator";
import authenticateUser from "../common/middleware/authenticate-user";
import storeFiles from "../common/middleware/store-files";

const router = express.Router();


router.post(
    "/forgot-password",
    Validator.body(forgot),
    AsyncHandler(UserController.forgotPassword)
);
router.get("/forgotPage/:token", 
    AsyncHandler(UserController.forgotPage));

router.post("/forgotPage/:token", 
    AsyncHandler(UserController.resetPassword));

router.put('/profile', 
    authenticateUser,
    storeFiles('media/profile', 'profileImage'),
    Validator.body(editProfile), 
    AsyncHandler(UserController.profile));

router.get('/profile',
    authenticateUser,
    AsyncHandler(UserController.getProfile)) 

export default router;
