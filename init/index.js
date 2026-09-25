const mongoose=require('mongoose');
const initdata=require('./data.js');
const Listing=require("../models/listing.js");
const { init } = require('../models/user.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main().then((res)=>{
    console.log("Successfully connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj,owner:"6a5fa3a59498bdaa1c396914"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized")
}

initDB();