const mongoose=require('mongoose');
const Schema=mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose").default;

console.log(passportLocalMongoose);   // <-- Add this line here

const UserSchema=new Schema({
    email:{
        type:String,
        require:true
    }
});

UserSchema.plugin(passportLocalMongoose); // automatically create username and password
module.exports=mongoose.model("User",UserSchema)