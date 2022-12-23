
import pg from 'pg'
const {Client}=pg;
const client=new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"root",
    database:"multivendarapi"
})

client.connect()

export const db=client

