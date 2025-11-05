// import passport from "passport";
// import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt";
// import { JWT, ROLE } from "../constant/constant";
// import User from "../../../model/user";
// import jwt from "jsonwebtoken"
// // import {decrypt} from "../helper"

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: JWT.SECRET,
// };
// console.log("sdsadasdasd")
// passport.use(
//   new JWTstratagy(options, async (jwtPayload, done) => {

//     const decrypts = decrypt(jwtPayload.data);

//     const data = JSON.parse(decrypts)

//     try {
//       const user = await User.findOne({where :{
//         id: data.id,
//       }});
//       console.log(user);

//       if (!user) {
//         return done(null, false);
//       }
//       delete user._doc.password;
//       return done(null, { ...user._doc, jti: data.jti });
//     } catch (error) {
//       console.log(error);
//       return done(error, false);
//     }
//   })
// );

import passport from "passport";
import { JWT } from "../constant/constant";
import User from "../../../model/user";
import { ExtractJwt, Strategy as JWTstratagy } from "passport-jwt";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT.SECRET,
};

passport.use(
    new JWTstratagy(options, async (jwtPayload, done) => {
        try {
            const user = await User.findOne({where :{
                id: jwtPayload.id,
            }});
   
            if (!user) {
                return done(null, false);
            }
            delete user.password;
            return done(null, { ...user, jti: jwtPayload.jti });
        } catch (error) {
            console.log(error);
            return done(error, false);
        }
    })
);
