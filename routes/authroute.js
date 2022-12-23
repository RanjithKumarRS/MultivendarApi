import { Router } from "express";
import { selectquery,insertquery } from "../model/query.js";
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
 
export const authroute=Router()


//to generate jwt Token
const GenerateToken=(data)=>{
    const token=jwt.sign(data, process.env.JWT_SECRET_KEY);
    return token;
}


//function for Send the response as Json type
const SendJsonres=(res,code,data)=>{
   return res.status(code).json(data)
}

//signup route base_url/auth/signup
authroute.post("/signup",(req,res)=>{ 
    if(!req.body || !req.body.username || !req.body.email || !req.body.userpassword || !req.body.userrole){
        return SendJsonres(res,400,{message:"Invalid Data"}) ; 
    }
    
    if(req.body.userrole!=process.env.WORKER_ROLE && req.body.userrole!=process.env.MANAGER_ROLE){
        return SendJsonres(res,400,{message:" UserRole Invalid"}) ; 
    }

    let query=`SELECT * FROM users WHERE email = '${req.body.email}'`;
    selectquery(query).then(result=>{
        if(result.status){  
            if(result.data.length!=0){ 
                result.data.map(value=>{ 
                    let comparepass=bcrypt.compareSync(req.body.userpassword,value.userpassword)
                    if(comparepass){   
                        return SendJsonres(res,400,{message:"User Already Have An account"}) ; 
                    } 
                })
            }else{
                let password = bcrypt.hashSync(req.body.userpassword,5); 
                if(!req.body.managerid){
                    req.body.managerid=null;
                }
                console.log(req.body.managerid)
                let sql=`INSERT INTO users (managerid,username,email,userpassword,userrole) VALUES (${req.body.managerid},'${req.body.username}','${req.body.email}','${password}','${req.body.userrole}')`
                insertquery(sql).then(result=>{
                    if(result.status){
                        let data={
                            time:Date(), 
                            email:req.body.email,
                            userrole:req.body.userrole,
                            userpassword:password,
                            managerid:req.body.managerid
                        };
                        let token= GenerateToken(data);
                        return SendJsonres(res,200,{token:token,message:"User Added Successfully"}) ;  
                    }else{
                        console.log(result.err) 
                        return SendJsonres(res,200,{message:"Database Error"});  
                    }
                }) 
            }
        }else{
            console.log(result.err) 
          return SendJsonres(res,400,{message:"Database Error"}) ; 
        }
    })     
})

//login route base_url/auth/login
authroute.post("/login",(req,res)=>{
    if(!req.body || !req.body.email || !req.body.userpassword){  
        return SendJsonres(res,400,{message:"Invalid Data"}) ;  
    }
    let query=`SELECT * FROM users WHERE email = '${req.body.email}'`;
     selectquery(query).then(result=>{
        if(result.status){
            if(result.data.length!=0){
                result.data.map(value=>{ 
                    let comparepass=bcrypt.compareSync(req.body.userpassword,value.userpassword)
                    if(comparepass){  
                        let data={
                            time:Date(), 
                            email:req.body.email,
                            userrole:value.userrole,
                            userpassword:value.userpassword,
                            managerid:value.managerid
                        };
                        let token= GenerateToken(data);
                       return SendJsonres(res,200,{token:token,message:"User logged successfully"})
                    }else{ 
                      return SendJsonres(res,400,{message:"Invalid password"}) ; 
                    }
                })
            }else{
                return SendJsonres(res,400,{message:"User Not Found"}) ;  
            }
        }else{
            console.log(result.err)
            return SendJsonres(res,400,{message:"Database Error"}) ; 
        }
    })
})