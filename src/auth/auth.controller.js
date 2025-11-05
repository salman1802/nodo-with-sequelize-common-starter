import AuthService from "./auth.services";
import {SuccessResponceHandle} from "../common/helper/helper"
class AuthController {

    /**
     * Register user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async register(req, res) {
        const data = await AuthService.register(req.body,req.file);
        return res.send(SuccessResponceHandle(201,"OTP sent to you email address",data));
    }

    /**
     * Login user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(req, res) {
        const data = await AuthService.login(req.body);
        return res.send(SuccessResponceHandle(200,"Success",data));
    }

       /**
     * Edit email of user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
       static async editEmail(req, res) {
        const data = await AuthService.editEmail(req.user,req.body)
        return res.send(SuccessResponceHandle(203,"OTP sent to your mail",null))
    }

    /**
     * Verify email otp
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async verifyEmailOTP(req, res) {
        const data = await AuthService.verifyEmailOTP(req.body);
        return res.send(SuccessResponceHandle(202,"Email Verified sucessfully"));
    }

    /**
     * Resend OTP
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async resendOtp(req, res) {
        const data = await AuthService.resendOtp(req.body);
        return res.send(SuccessResponceHandle(203,"OTP sent to your mail",null));
    }

    /**
     * Logout user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async logout(req, res) {
        await AuthService.logout(req.user);
        return res.send(SuccessResponceHandle(202,"Loged out successfully",null));
    }

     
}

export default AuthController;
