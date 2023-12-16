const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const PlacesSchema = new Schema({
    name :{
        type : String,
        required : ["true","please provide a place name"]
    },
    city : {
        type : String,
        required : ["true","please provide a city name"]
    },
    county : {
        type : String,
        required : ["true","please provide a county name"]
    },
    slug : {
        type : String
    },
    favouriteUsers : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ],
    likes : [
        {
        type : mongoose.Schema.ObjectId,
        ref : "User"
        }
    ],
    likeCount : {
        type : Number,
        default : 0
    },
    dislikes : [
        {
        type : mongoose.Schema.ObjectId,
        ref : "User"
        }
    ],
    dislikeCount : {
        type : Number,
        default : 0
    },
    comments : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Comment"
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now
    }
});

// todo look -- bak buraya çifte eklenmiş
PlacesSchema.pre("save",function(next) {
    if(!this.isModified("name")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});

PlacesSchema.pre("save",function(next) {
    //* burda değişme olmasına rağmen değişmedi diyordu değişme oldu -- slug çalıştı
    if(this.isModified("name")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});


// linki değiştirir slugify
PlacesSchema.methods.makeSlug = function(){
    return slugify(this.name,{
        replacement : "-",
        remove : /[*+~.()'"!:@]/g,
        lower : true
    });
};



module.exports = mongoose.model("Places",PlacesSchema)