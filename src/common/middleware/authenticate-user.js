import AccessToken from "../../../model/accessToken";
import passport from "passport";
import { HttpStatus } from "../error-exceptions";
import User from "../../../model/user";

export default (req, res, next) => {
  
  passport.authenticate("jwt", { session: false }, async (err, user) => {
   
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    const exist = await AccessToken.findOne({where :{
      token: user.jti,
      isRevoked: false,
      userId: user.dataValues.id,
    }});

    if (!exist ) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }
    const existuser = await User.findOne({where :{
      id: exist.userId,
      isVerify: true,
    }});

    if ( !existuser) {
      return res
        .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
        .send({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  })(req, res, next);
};
