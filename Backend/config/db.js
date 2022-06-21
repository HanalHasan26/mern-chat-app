const mongoose = require("mongoose")

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
 
        console.log("Database connected".green.bold);
    } catch (error){
        console.log(`Error :${error}`.red.bold);
        process.exit();
    }
}

module.exports = connectDB; 