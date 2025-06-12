import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:"./.env"
});
const PORT = process.env.PORT

connectDB()
    .then(()=>{
        app.listen(PORT,()=>console.log(`server running on port:${PORT} with mongoDB Connected`));
    })
    .catch((err)=>{
        console.error("Mongo DB connection error");
        process.exit(1)
    })