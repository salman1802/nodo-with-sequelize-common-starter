import { DataTypes } from "sequelize";
import db from "./connection"

const EmailVerification = db.define('EmailVerification',{
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    otp : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
},{
    tablename : 'emailVerification',
    timestamps : true
})

module.exports = EmailVerification