const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDb = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then(()=>console.log("DB Conection Successfully..."))
    .catch((error) =>{
        console.log("DB Connection Failed...")
        console.error(error);
        process.exit(1);
    })
}