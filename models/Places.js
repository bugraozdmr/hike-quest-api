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

PlacesSchema.pre("save",function(next) {
    if(!this.isModified("name")){
        next();
    }
    this.slug = this.makeSlug();
    next();
});

// todo -- slug ifadesi değişecek !!!!
PlacesSchema.pre("findOneAndUpdate",async function(){
    // Güncelleme öncesindeki belgeye ulaşmak için sorgu nesnesini al
    const query = this.getQuery();
    
    console.log(query.name)
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