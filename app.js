
import dotenv from "dotenv"
import express from "express"; 
import { routes } from "./routes/index.js";

dotenv.config(); 
const app=express();

import { usertable,logstable } from "./model/createtable.js"; 

//create table
// usertable(); //user table
// logstable(); //worklog tale

//middelware for parsing the json data from the requst body 
app.use(express.json());
//middelware for parsing x-www-form-urlencoded from the request form data
app.use(express.urlencoded({extended:false}));

//middelware to manage seperate routes
app.use("/", routes); 


const listener=app.listen(3000,()=>{
    console.log("hi dude, I'm in",listener.address().port )
})
