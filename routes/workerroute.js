import { Router } from "express"; 
import { Verifyjwttoken } from "../model/jwtverifytoken.js";
import { insertquery, selectquery } from "../model/query.js";


export const workerroute=Router();

workerroute.use("/",(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({message:"Auth Token Not Found"})
     }
    let token =req.headers.authorization.split(' ')[1];
     Verifyjwttoken(token,process.env.WORKER_ROLE).then(result=>{ 
        if(result.status){
            req.userdata=result.data;
            next();
        }else{
            return res.status(400).json({message:result.err})
        }
     });
})

workerroute.post("/createlog",(req,res)=>{
     if(!req.body || !req.body.starttime || !req.body.endtime || !req.body.remark){
        return res.status(400).json({message:"Invalid Data"})
     } 
     let query=`INSERT INTO worklog(userid,starttime,endtime,remark) VALUES('${req.userdata.userid}','${req.body.starttime}','${req.body.endtime}','${req.body.remark}')`;
     insertquery(query).then(result=>{
        if(result.status){
            res.status(200).json({message:"Log Added successfully"})
        }else{
            console.log(result.err)
            res.status(400).json({message:"Database Error"})
        }
     }) 
})

workerroute.put("/createlog",(req,res)=>{
    if(!req.body || !req.body.starttime || !req.body.endtime || !req.body.remark || !req.body.logid){
        return res.status(400).json({message:"Invalid Data"})
     } 
     let query=`UPDATE worklog SET starttime='${req.body.starttime}', endtime='${req.body.endtime}' , remark='${req.body.remark}' WHERE logid='${req.body.logid}'`;
     insertquery(query).then(result=>{
        if(result.status){
            res.status(200).json({message:"Log Updated successfully"})
        }else{
            console.log(result.err)
            res.status(400).json({message:"Database Error"})
        }
     }) 
})

workerroute.get("/mylog",(req,res)=>{
    let query=`SELECT * FROM worklog WHERE userid='${req.userdata.userid}'`;
    selectquery(query).then(result=>{
        if(result.status){
            res.status(200).json({data:result.data})
        }else{
            console.log(result.err);
            res.status(400).json({message:"Database Error"})
        }
    })
})




