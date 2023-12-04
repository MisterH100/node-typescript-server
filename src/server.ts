import express from 'express';
import { Router } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
require('dotenv').config();
const app = express();
const router = Router();
const cors = require("cors");
const qoutesRoute = require("./routes/qoutesRoute");
const invoicesRoute = require("./routes/invoicesRoute");
const downloadFiles = require("./routes/downloadFiles");


mongoose.connect(process.env.MONGO_STRING as string)
.then(()=>console.log("Connected to DataBase")) 
.catch((err) => {
    console.log(err + "Failed to Connect to DataBase") 
});


const homeRoute = router.get("/",(req,res)=>{
    res.send("welcome to candc data server");
})

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(homeRoute);
app.use(qoutesRoute);
app.use(invoicesRoute);
app.use(downloadFiles);

app.listen(process.env.PORT || 3000,()=>{
    console.log("listening on port 8080");
})