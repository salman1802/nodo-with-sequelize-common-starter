import User from "../../model/user";
import {
    PreconditionFailedException
} from "../common/error-exceptions";
import bcrypt from "bcryptjs";
import { BCRYPT, JWT } from "../common/constant/constant";
import authHelper from "../common/helper/authHelper";
import { sendMail } from "../common/middleware/sendMail";
import { baseUrl } from "../common/config/constant.config";
import jwt from "jsonwebtoken";
import path from "path"
import fs from "fs"
import ProfileResource from "./resource/profileResource"

class UserService {

    /**
     * @description: Forgot password
     * @param {*} token
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async forgotPassword(data, headers) {
        const { email } = data;
        const findUser = await User.findOne({ where: { email: email } });
        if (!findUser) {
            throw new PreconditionFailedException(
                "Account not exist with this email address"
            );
        } else {
            const randomString = await authHelper.randomStringGenerator();

            const token = await authHelper.tokenGenerator({
                id: findUser.id,
                jti: randomString,
            });
            const link = baseUrl(`/api/v1/user/forgotPage/${token}`);

            const obj = {
                to: email,
                subject: `Forgot password`,
                data: { link },
            };

            await findUser.update({
                refKey: true,
            });

            sendMail(obj, "forgotPassword");
        }
    }

    /**
     * @description: Forgot page
     * @param {*} token
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */

    static async forgotPage(token, req, res) {
        try {
            const verifyToken = jwt.verify(token, JWT.SECRET);
            const forgotRefKey = await User.findOne({
                where: { id: verifyToken.id },
            });
            if (verifyToken) {
                return res.render("forgotPassword/resetPassword", {
                    forgotPassRefKey: forgotRefKey,
                });
            }
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res
                    .status(403)
                    .send({ message: "Your link has been expired" });
            }
            return res.status(403).send({ message: "Invalid token" });
        }
    }

    /**
     * @description: Resetpassword
     * @param {*} token
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async resetPassword(token, data, req, res) {
        const { newPassword, confirmPassword } = data;
        const isValid = jwt.verify(token, JWT.SECRET);
        if (isValid) {
            if (newPassword == "" || confirmPassword == "") {
                req.flash(
                    "error",
                    "New Password and Confirm Password are required"
                );
                return res.redirect("back");
            } else if (newPassword.length < 8) {
                req.flash(
                    "error",
                    "Your password needs to be at least 8 characters long"
                );
                return res.redirect("back");
            } else if (!/[A-Z]/.test(newPassword)) {
                req.flash(
                    "error",
                    "Your password must contain at least one uppercase letter"
                );
                return res.redirect("back");
            } else if (!/[0-9]/.test(newPassword)) {
                req.flash(
                    "error",
                    "Your password must contain at least one number"
                );
                return res.redirect("back");
            } else if (newPassword !== confirmPassword) {
                req.flash(
                    "error",
                    "Password and Confirm Password do not match"
                );
                return res.redirect("back");
            } else {
                const hashPass = await bcrypt.hash(
                    newPassword,
                    BCRYPT.SALT_ROUND
                );
                const findId = await User.findOne({
                    where: { id: isValid.id },
                });
                const update = await findId.update({
                    password: hashPass,
                    refKey: false,
                });

                if (update) {
                    req.flash("success", "Password has been changed");
                    return res.redirect("back");
                }
            }
        } else {
            req.flash("error", "Link has expired");
            return res.redirect("back");
        }
    }

     /**
     * Edit profile of tasker
     * @param {*} auth
     * @param {*} data
     */
     static async profile(auth, data, file) {
     
        const find = await User.findOne({where : { id: auth.dataValues.id }});
        const updateData = {};

        if (file){
            const imagePath = find.profileImage;

                const fullPath = path.join(
                    __dirname,
                    "../../media/profile",
                    imagePath
                );
                await fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error(`Error deleting ${fullPath}:`, err);
                    }
                });

                updateData.profileImage = file.filename;
        } 

        const fields = [
            "firstname",
            "lastname",
            "countrycode",
            "mobilenumber",
            "zipcode",
            "location",
            "language",
            "email",
            "lat",
            "long",
        ];

        fields.forEach((field) => {
            if (data[field]) updateData[field] = data[field];
        });

        if (Object.keys(updateData).length > 0) {
            const userUpdate = await find.update(updateData);
            return userUpdate;
        }

        return find;
    }

    /**
     * Get profile detail service
     * @param {*} auth
     * @returns
     */
    static async getProfile(auth) {
        const profile = await User.findOne({where : { id: auth.dataValues.id }});
        return profile
    }



}

export default UserService;
