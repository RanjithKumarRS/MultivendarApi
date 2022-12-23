import { createquery } from "./query.js";
  
export const usertable=()=>{ 
    let query="CREATE TABLE users (userid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,managerid UUID NULL,username VARCHAR(255), email VARCHAR(255)  ,userpassword TEXT, userrole INT ,createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    createquery(query).then(result => {
        if (result) {
            console.log('Table created');
        }
    });
}

export const logstable=()=>{
    let query="CREATE TABLE worklog(logid UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,userid UUID NOT NULL,starttime TIMESTAMP NOT NULL,endtime TIMESTAMP NOT NULL,remark VARCHAR(250) NOT NULL ,createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
    createquery(query).then(result => {
        if (result) {
            console.log('Table created');
        }
    });
}