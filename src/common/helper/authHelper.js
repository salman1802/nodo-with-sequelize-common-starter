import AccessToken from "../../../model/accessToken"
import jwt from "jsonwebtoken"
import { BCRYPT, JWT } from "../constant/constant"
import moment from "moment"
import bcrypt from "bcryptjs"
const Hours = 8760;
class authHelper{
  /**
     * JWT Token Generator
     * @param {*} data 
     * @returns 
     */
  static async tokenGenerator(data){
    return await jwt.sign(data, JWT.SECRET,{expiresIn : JWT.EXPIRES_IN})
}

/**
 * Store access token to database
 * @param {*} user 
 * @param {*} cryptoString 
 * @returns 
 */
static async storeAccessToken(user,cryptoString){
    const expiredAt = moment(new Date())
    .utc()
    .add(Hours,"hours")
    .format("YYYY-MM-DD hh:mm:ss");

   const data=  await AccessToken.create({
        token : cryptoString,
        userId : user.dataValues.id,
        expiresAt : expiredAt
    })
   
    return true
}

static async randomStringGenerator(givenLength = 70) {
    const characters = 
    givenLength > 10
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" ;

    const length = givenLength;
    let randomStr = "";

    for(let i = 0; i< length; i++){
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    return randomStr
}


/**
   * @description matched password
   * @param {*} password 
   * @param {*} userPassword 
   * @returns 
   */
static async matchHashedPassword(password, userPassword) {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.compare(password, userPassword, (err, res) => {
        if (err) reject(err);
        resolve(res);
       
      });
    });
   
    return hashedPassword;
  }


  static async randomNumberGenerator (givenLength )  {
    const characters = "123456789";
    const length = givenLength;
    let randomStr = "";
  
    for (let i = 0; i < length; i++) {
      const randomNum = Math.floor(Math.random() * characters.length);
      randomStr += characters[randomNum];
    }
    return randomStr;
  };

}

export default authHelper