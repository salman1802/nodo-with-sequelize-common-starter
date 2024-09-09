import AsyncHandler from "express-async-handler";
import express from "express";
import { registerDto, verifyEmailOtpDto, loginDto , editEmail} from "./dtos/dto.auth";
import AuthController from "./auth.controller";
import Validator from "../common/config/joi-validator";
import authenticateUser from "../common/middleware/authenticate-user";
import storeFiles from "../common/middleware/store-files";

const router = express.Router();

router.post(
    "/register",
    storeFiles('media/profile', 'profileImage'),
    Validator.body(registerDto),
    AsyncHandler(AuthController.register)
);

router.post("/verify-otp", 
    Validator.body(verifyEmailOtpDto),
    AsyncHandler(AuthController.verifyEmailOTP));

router.post("/resend-otp", 
    AsyncHandler(AuthController.resendOtp));

router.post(
    "/login",
    Validator.body(loginDto),
    AsyncHandler(AuthController.login)
);


router.post(
    '/edit-email',authenticateUser,
    Validator.body(editEmail),
    AsyncHandler(AuthController.editEmail))

export default router;
