import UserService from "./user.services";
import ProfileResource from "./resource/profileResource";
import {SuccessResponceHandle} from "../common/helper/helper"

class UserController {
    /**
     * Forgot password
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async forgotPassword(req, res) {
        await UserService.forgotPassword(req.body);
        return res.send(SuccessResponceHandle(203,"Reset password link has been sent to the email address",null));
    }

    /**
     * @description: Forgot password page
     * @param {*} req
     * @param {*} res
     */
    static async forgotPage(req, res) {
        await UserService.forgotPage(req.params.token, req, res);
    }

    /**
     * @description: Resetpassword
     * @param {*} req
     * @param {*} res
     */
    static async resetPassword(req, res) {
        await UserService.resetPassword(req.params.token, req.body, req, res);
    }

    /**
     * Edit profile api
     * @param {*} req
     * @param {*} res
     */
    static async profile(req, res) {
        const data = await UserService.profile(req.user, req.body, req.file);
        return res.send(SuccessResponceHandle(202,"Profile Updated Sucessfully",new ProfileResource(data)));
    }

    /**
     * Edit profile api
     * @param {*} req
     * @param {*} res
     */
    static async getProfile(req, res) {
        const data = await UserService.getProfile(req.user);
        return res.send(SuccessResponceHandle(203,"Profile Information",new ProfileResource(data)));
    }
}

export default UserController;
