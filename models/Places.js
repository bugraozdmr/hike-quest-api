const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const PlacesSchema = new Schema({
    name :{
        type : String,
        required : ["true","please provide a place name"]
    },
    slug : {
        type : String
    },
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
    createdAt : {
        type : Date,
        default : Date.now
    }
});

PlacesSchema.pre("save",function(next) {
    if(!this.isModified("name")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});

// linki değiştirir slugify
PlacesSchema.methods.makeSlug = function(){
    return slugify(this.title,{
        replacement : "-",
        remove : /[*+~.()'"!:@]/g,
        lower : true
    });
};



module.exports = mongoose.model("Places",PlacesSchema)