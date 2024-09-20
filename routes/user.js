const express = require("express");
const app = express();
const  router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const path = require("path");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));

//SIGNUP
router.get("/" , (req,res) => {
  res.render("user/signup.ejs");
});

router.get("/signup" , (req,res) => {
    res.render("user/signup.ejs");
});

router.post("/signup" , async (req,res) => {
    let {username , email , mobile , password} = req.body;
    const newUser = new User({email,username,mobile});
    const registerdUser = await User.register(newUser , password);
    req.flash('success', 'You Have Successfully Registerd');
    res.redirect("/signup");
});



//LOGIN
router.get("/login" , (req,res) => {
    res.render("user/login.ejs");
 });
 
 router.post("/login" , passport.authenticate("local" , {failureRedirect : "/login" , failureFlash: true,}) , async(req,res) => {
    req.flash("success" , "You Have Been Logged In Successfully");
    res.redirect("/signup");
 });


 //FORGOT
 router.get("/forgot" , (req,res) => {
    res.render("user/forgot.ejs");
 });

 //CHANGE
 router.get("/change" , (req,res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to be logged in to change your password.");
        return res.redirect("/login");
      }
     res.render("user/change.ejs");
 });

 router.post("/change", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    if (!req.isAuthenticated()) {
      req.flash("error", "You need to be logged in to change your password.");
      return res.redirect("/login");
    }
  
    try {
      const user = await User.findById(req.user._id);
  
      // Check if the old password is correct
      user.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          req.flash("error", "Incorrect old password or new password is invalid.");
          return res.redirect("/change");
        }
  
        req.flash("success", "Password has been successfully updated.");
        res.redirect("/signup"); // Redirect to dashboard after successful password change
      });
    } catch (error) {
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/change");
    }
  });

module.exports = router;