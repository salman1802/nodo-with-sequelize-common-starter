import express from "express"
import http from "http"
import session from "express-session"
import path from "path"
import fs from "fs"
require("dotenv").config()
import db from "./model/connection"
db.sync({ force: false, alter: true}) 
import routes from "./routes/index";
import flash from "connect-flash"
import passport from "passport"
import swagger from "./src/common/config/swagger.config";
import bodyParser from "body-parser"
import handleError from "./src/common/middleware/error-handler.middleware";
import "./src/common/config/jwt-strategy"

// connection()
// createDatabase("priya");
// db()
const app = express()

app.use(
    session({
        secret: "hjs89d",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "media")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(passport.initialize());
app.use(passport.session());



app.use("/api/documentation", swagger);
app.use("/", routes);
app.use(handleError)
app.get("/", (req, res) => {
    return res.render("errors/500")
})


const server = http.Server(app)
const isSecure = process.env.IS_SECURE === "true"
if(isSecure){
    var options = {
        key: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/privkey.pem`),
        cert: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
        ca: [
            fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
            fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/fullchain.pem`),
        ],
    };
    var https = require("https").Server(options, app);
    https.listen(process.env.PORT, () => {
        console.log(
            `Https server is running on ${process.env.BASE_URL}:${process.env.PORT}`
        );
    });
}else{
    server.listen(process.env.PORT, () =>{
        console.log(`listening at ${process.env.BASE_URL}:${process.env.PORT}`)
    })
}

