const mongoose = require("mongoose");
const schema = mongoose.Schema;
const slugify = require("slugify");

const PlacesSchema = new Schema({
    name :{
        type : String,
        required : ["true","please provide a place name"]
    },
    like :{

    },
    dislike :{
        
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
    createdAt : {
        type : Date,
        default : Date.now
    }
});

QuestionSchema.pre("save",function(next) {
    if(!this.isModified("name")){
        next();
    }
    this.slug = this.makeSlug();
    next();
})

// linki değiştirir slugify
QuestionSchema.methods.makeSlug = function(){
    return slugify(this.title,{
        replacement : "-",
        remove : /[*+~.()'"!:@]/g,
        lower : true
    });
};