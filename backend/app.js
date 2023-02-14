const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const app = express();




if(process.env.NODE_ENV !== "production"){
dotenv.config({path : "backend/config/config.env"});
}

//using middlewars
//most important dont forget these
app.use(express.json()) ;
// we could also use body-parser in place of this 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



//importing routes
const post = require('./Routes/post');
const user = require('./Routes/user');


//using routes
app.use("/api/v1", post);   
app.use('/api/v1', user);


module.exports = app ; 