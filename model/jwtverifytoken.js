import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { selectquery } from "./query.js";

dotenv.config();

export const Verifyjwttoken=async(token,role)=>{ 
    try {   
        const verified =await jwt.verify(token, process.env.JWT_SECRET_KEY);  
        if(verified){ 
            let query=`SELECT * FROM users WHERE email = '${verified.email}' AND userpassword='${verified.userpassword}'`;
          const dbdata= await selectquery(query).then(res=>{   
                if(res.status){  
                    if(res.data.length==0){  
                        return {status:0,err:"User Not Found"}
                    }else{  
                        if(res.data[0].userrole==role){  
                            verified.userid=res.data[0].userid
                            return {status:1,data:verified}
                        }else{    
                            return {status:0,err:"Unautherized User"}
                        }
                    }
                }else{
                    console.log(res.err)
                    return {status:0,data:"Database Error"}
                }
            }) 
            return dbdata;
        }else{ 
            console.log(error)
            return {status:0,err:"JWT verify error"} 
        }
    } catch (error) { 
        console.log(error)
        return {status:0,err:"something went wrong.please check console"} 
    }
}