const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const ejsMate = require("ejs-mate");

const port = 3000;
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));


// Set the default layout

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs" , ejsMate);

main().then( () => {
    console.log("Connected To DataBase Successfully");
})
.catch( (err) => {
    console.log(err);
})

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/form")
}

app.use(session({
    secret: 'your-secret-key', // Replace with your actual secret
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save session even if it's not modified
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration time (e.g., 1 day)
        secure: false, // Set to `true` if using HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }
}));

  app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/" , userRouter);


app.listen(port , (req,res) => {
    console.log(`Port is Listning at http://localhost:${port}`);
})