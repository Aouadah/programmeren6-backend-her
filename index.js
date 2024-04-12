import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import songsRouter from "./routes/songRoutes.js";

mongoose.connect('mongodb://127.0.0.1:27017/songs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/songs", songsRouter);

app.get("/", (req, res)=>{
  res.send("Hello World")
});

app.listen(process.env.EXPRESS_PORT,()=>{
  console.log(`Webserver started at port ${process.env.EXPRESS_PORT}`);
});