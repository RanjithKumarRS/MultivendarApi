import { db } from "../db.js";

export const createquery = async (query) => {
    try {      
        await db.query(query);   
        return true;
    } catch (error) {
        console.error(error.stack,"table");
        return false;
    } finally {
        await db.end();         
    }
}; 

export const selectquery=async(query)=>{ 
    try{
        const res = await db.query(query);   
        return {status:1,data:res.rows}
    }catch(error){ 
        console.log(error)
        return {status:0,err:error.stack} 
    }
      
}

export const insertquery=async(query)=>{ 
    try{
        await db.query(query);
        return {status:1}
    }catch(error){
        return {status:0,err:error.stack}  
    } 
}
