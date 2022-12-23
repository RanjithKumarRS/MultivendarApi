import { Router } from "express";  
import { Verifyjwttoken } from "../model/jwtverifytoken.js";
import { insertquery, selectquery } from "../model/query.js";
  
export const managerroute=Router();
 
managerroute.use("/",(req,res,next)=>{ 
    if(!req.headers.authorization){
        return res.status(400).json({message:"Auth Token Not Found"})
     }
    let token =req.headers.authorization.split(' ')[1]; 
     Verifyjwttoken(token,process.env.MANAGER_ROLE).then(result=>{ 
        if(result.status){
            console.log(result.data)
            req.userdata=result.data;
            next();
        }else{
            return res.status(400).json({message:result.err})
        }
     });  
})

managerroute.get("/workerlog",(req,res)=>{  
    let query=`SELECT worklog.logid,worklog.userid,worklog.starttime,worklog.endtime,worklog.remark,worklog.createdat FROM worklog LEFT JOIN users ON users.userid=worklog.userid WHERE users.managerid='${req.userdata.userid}' `;
    selectquery(query).then(result=>{
        if(result.status){
            res.status(200).json({data:result.data})
        }else{
            console.log(result.err);
            res.status(400).json({message:"Database Error"})
        }
    })
})

managerroute.get("/getworkers",(req,res)=>{
    let query=`SELECT * FROM users WHERE users.managerid='${req.userdata.userid}' `;
    selectquery(query).then(result=>{
        if(result.status){
            res.status(200).json({data:result.data})
        }else{
            console.log(result.err);
            res.status(400).json({message:"Database Error"})
        }
    })
})

managerroute.put("/updateworklog",(req,res)=>{
    if(!req.body || !req.body.starttime || !req.body.endtime || !req.body.remark || !req.body.userid){
        return res.status(400).json({message:"Invalid Data"})
     } 
     let query=`UPDATE worklog SET starttime='${req.body.starttime}', endtime='${req.body.endtime}' , remark='${req.body.remark}' WHERE userid='${req.body.userid}'`;
     insertquery(query).then(result=>{
        if(result.status){
            res.status(200).json({message:"Log Updated successfully"})
        }else{
            console.log(result.err)
            res.status(400).json({message:"Database Error"})
        }
     }) 
})



