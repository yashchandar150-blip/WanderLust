if(process.env.NODE_ENV != "rpoduction"){
    require("dotenv").config();
}
//console.log(process.env.SECRET)

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const ExpressError=require("./util/ExpressError.js")
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User = require("./models/user.js");


const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");

app.use(methodOverride("_method"));

//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const dburl = process.env.ATLASDB_URL;
//const dburl=process.env.ATLASDB_URL

main().then(() => {
    console.log("Successfully connected");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: dburl,
    secret:process.env.SECRET,
    touchAfter: 24 * 3600,
});



const sessionOptions={
    store ,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.get("/",(req,res)=>{
    console.log("server is working");
    res.render("listings/home.ejs");
})




app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    //console.log(res.locals.success);
    next();
})


app.get("/demoUser",async(req,res)=>{
    let fakeUser=({email:"studen@gmail.com",
    username:"delta-student"
    })
    let newUser= await User.register(fakeUser,"helloword");//register user and check uniqueness of username
    res.send(newUser);
})

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)
//Cutrom error handling

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    let message = err.message || "Something went wrong";

    res.status(statusCode).render("error", { message, statusCode });
});

app.listen(8080,()=>{
    console.log(`server is listening to port 8080`);
})

