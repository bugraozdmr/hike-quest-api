const mongoose = require("mongoose");

const connectDatabase = () => {
    
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("MongoDb connection succesfully created")
    })
    .catch(err => console.error(err))
};


module.exports = {
    connectDatabase
};