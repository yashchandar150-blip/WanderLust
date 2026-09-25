const Listing=require("../models/listing.js");
const mapGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const { search } = req.query;

    let allListings;

    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs")
};

module.exports.createListing = async (req, res, next) => {

    console.log(req.body);
    console.log(req.file);
    let response = await geocodingClient.forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send()
    
        
       
        
  

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    newListing.geometry = response.body.features[0].geometry;

    
    await newListing.save();
    console.log(newListing);

    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
};
module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings")
    }
    let originalImageURL = listing.image.url.replace("/upload","/upload/w_250,e_blur:300");
    res.render("listings/edit.ejs",{listing,originalImageURL})
};

module.exports.updateListing = async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id}=req.params;
   let newListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file !== "undefined"){
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await newListing.save();
   }

   req.flash("success","Listing Updated!!");
   res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
   
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!!");
     res.redirect("/listings");
};