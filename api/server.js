import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth-router.js";
import cookieParser from "cookie-parser";
import propertyRouter from "./routes/property-router.js";
import  path from 'path'
dotenv.config();


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to  mongo db successfully");
  })
  .catch((error) => {
    console.log("Error while connecting to mongodb,", error);
  });

const __dirname=path.resolve()

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);

app.use(express.static(path.join(__dirname,"/client/dist")))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, 'client','dist', 'index.html'))
  
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Issue";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`App is listening to ${PORT}`);
});
