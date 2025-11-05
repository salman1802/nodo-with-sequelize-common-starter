import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

export const sendMail = async (obj, template) => {
    let transporter = nodemailer.createTransport({
        service: process.env.MAIL_MAILER,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const data = {
        ...obj.data,
        APP_NAME: process.env.APP_NAME,
    
    }
   
     const htmlText = await ejs.renderFile(path.join(`${__dirname}/../../../views/${template}/index.ejs`), data);
    
    let mailOpts = {
        from: `${process.env.APP_NAME} <${process.env.MAIL_USERNAME}>`,
        to: obj.to,
        subject: obj.subject,
        html: htmlText
    };
    return transporter.sendMail(mailOpts, function (err, response) {
        if (err) {
            console.log(`Mail not sent`,err);
        } else {
            console.log(`Mail sent :- ${obj.to}`);
        }
    });
}
