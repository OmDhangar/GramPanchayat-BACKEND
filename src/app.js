import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import healthCheckRoutes from "./routes/healthCheck.routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'})) //used to configure json data
app.use(express.urlencoded({extended: true}))//used to configure url properties

app.use(cookieParser({limit:"16kb"}))// used to configure cookies and their limit 
app.use(express.static("public"))//used to store images,files publically
//middlewares 

// routes imported
import userRouter from "./routes/auth.routes.js"
import applicationRouter from "./routes/application.routes.js"

//routes declaration
app.use("/api",healthCheckRoutes);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/applications", applicationRouter);
export default app