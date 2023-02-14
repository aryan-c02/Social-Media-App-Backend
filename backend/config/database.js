const mongoose = require('mongoose');


exports.connectDatabase =  async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Db CONNECTED"); 
  } catch (error) {
    console.log("failed to connect", err);  
  }
};