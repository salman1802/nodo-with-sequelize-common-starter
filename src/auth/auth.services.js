import User from "../../model/user";
import {
    ConflictException,
    PreconditionFailedException,
    UnauthorizedException,
    NotFoundException,
} from "../common/error-exceptions";
import bcrypt from "bcryptjs";
import { BCRYPT, JWT } from "../common/constant/constant";
import authHelper from "../common/helper/authHelper";
import EmailVerification from "../../model/emailVerification";
import { sendMail } from "../common/middleware/sendMail";
import AccessToken from "../../model/accessToken";
import { baseUrl } from "../common/config/constant.config";
import jwt from "jsonwebtoken";
import getUserResource from "./resources/userResource";
const expiresInSeconds = 31536000;

class AuthService {
    static async register(data,file) {
      
        const email = data.email.toLowerCase();
        const alreadyExist = await User.findOne({
            where: { email: email },
        });
        if (alreadyExist)
            throw new PreconditionFailedException("Email already exists");

        const hashedPassword = await bcrypt.hash(
            data.createpassword,
            BCRYPT.SALT_ROUND
        );
        data.profileImage = file.filename;
        data.password = hashedPassword
        const register = await User.create(data);
        const otp = await authHelper.randomNumberGenerator(4);
        await EmailVerification.create({
            email: email,
            otp: otp,
        });
        const obj = {
            to: email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");

        const randomString = await authHelper.randomStringGenerator();
        const token = await authHelper.tokenGenerator({
            id: register.dataValues.id,
            jti: randomString,
        });

        await authHelper.storeAccessToken(register, randomString);
        register.setDataValue("token", token);

        return {
            data: new getUserResource(register),
            auth: {
                tokenType: "Bearer",
                accessToken: register.dataValues.token,
                refreshToken: null,
                expiresIn: expiresInSeconds,
            },
        };
    }

    /**
     * @description: Email OTP verification
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async verifyEmailOTP(data) {
        const { email, otp } = data;
        const findUser = await User.findOne({ where: { email: email } });
        if (findUser) {
            const findone = await EmailVerification.findOne({
                where: { email: email },
            });

            if (findone) {
                const currentTime = new Date(
                    findone.updatedAt.getTime() + 60000
                );
                const time = Date.now();
                if (otp == findone.otp) {
                    if (time < currentTime) {
                        const update = await findUser.update({
                            isVerify: true,
                        });
                        await findone.destroy();

                        const randomString =
                            await authHelper.randomStringGenerator();

                        const token = await authHelper.tokenGenerator({
                            id: findUser.dataValues.id,
                            jti: randomString,
                        });

                        await authHelper.storeAccessToken(update, randomString);
                        update.setDataValue("token", token);

                        return {
                            data: new getUserResource(update),
                            auth: {
                                tokenType: "Bearer",
                                accessToken: update.dataValues.token,
                                refreshToken: null,
                                expiresIn: expiresInSeconds,
                            },
                        };
                    } else {
                        throw new PreconditionFailedException(
                            "OTP has expired"
                        );
                    }
                } else {
                    throw new PreconditionFailedException("Invalid OTP");
                }
            } else {
                throw new PreconditionFailedException("Invalid OTP");
            }
        } else {
            throw new NotFoundException("User not found");
        }
    }

    /**
     * Resend OTP
     * @param {*} data
     */
    static async resendOtp(data) {
        const email = data.email.toLowerCase();
        const alreadyExistCode = await EmailVerification.findOne({
            where: {
                email: email,
            },
        });
        const otp = await authHelper.randomNumberGenerator(4);
        if (alreadyExistCode) {
            const update = await alreadyExistCode.update({
                otp: otp,
            });
        }

        const obj = {
            to: email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");

        return;
    }

    static async login(data) {
        const email = data.email.toLowerCase();
        const getExistingUser = await User.findOne({ where: { email: email } });

        if (!getExistingUser) {
            throw new NotFoundException(
                "Account not exist with this email address"
            );
        }

        const matchedPassword = await authHelper.matchHashedPassword(
            data.password,
            getExistingUser.password
        );

        if (!matchedPassword) {
            throw new PreconditionFailedException("Invalid Password");
        }
        if (getExistingUser.isVerify == false) {
            const otp = await authHelper.randomNumberGenerator(4);
            await EmailVerification.create({
                email: email,
                otp: otp,
            });
            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { otp },
            };

            sendMail(obj, "sendotp");
        }
        const randomString = await authHelper.randomStringGenerator();

        const token = await authHelper.tokenGenerator({
            id: getExistingUser.id,
            jti: randomString,
        });

        await authHelper.storeAccessToken(getExistingUser, randomString);

        getExistingUser.setDataValue("token", token);
        return {
            data: new getUserResource(getExistingUser),
            auth: {
                tokenType: "Bearer",
                accessToken: getExistingUser.dataValues.token,
                refreshToken: null,
                expiresIn: expiresInSeconds,
            },
        };
    }

    /**
     * User logout
     * @param {*} authUser
     * @param {*} deviceId
     * @returns
     */
    static async logout(authUser) {
        const token = await AccessToken.findOne({
            where: { token: authUser.jti },
        });
        token.update({
            isRevoked: true,
        });
        return;
    }

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
            const link = baseUrl(`/api/v1/auth/forgotPage/${token}`);

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
     * Edit email service
     * @param {*} auth
     * @param {*} data
     */
    static async editEmail(auth, data) {
        const find = await User.findOne({ where: { id: auth.dataValues.id } });
        if (!find) throw new NotFoundException("User not registered");
        const exist = await User.findOne({ where: { email: data.email } });
        if (exist)
            throw new PreconditionFailedException(
                "This email is already registered"
            );

        const update = await find.update({
            email: data.email,
        });

        const otp = await authHelper.randomNumberGenerator(4);
        await EmailVerification.create({
            email: data.email,
            otp: otp,
        });

        const obj = {
            to: data.email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");
    }
}

export default AuthService;
