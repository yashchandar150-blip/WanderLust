const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js")
const user = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("user/signup.ejs")
};

module.exports.signup = async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let newUser=new user({email,username});
        let registeredUser=await user.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust!")
        res.redirect("/listings")
    })
        
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login = async (req,res)=>{
    
    req.flash("success","Welcoeme back to WanderLust! ")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
    
    
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You're logged out!");
        res.redirect("/listings")
    })
}