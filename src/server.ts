import express from 'express';
import { Router } from 'express';
import bodyParser from 'body-parser';
const app = express();
const router = Router();
const qoutesRoute = require("./routes/qoutesRoute");
const invoicesRoute = require("./routes/invoicesRoute");
const downloadFiles = require("./routes/downloadFiles");

const homeRoute = router.get("/",(req,res)=>{
    res.send("welcome to c and c data server");
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(homeRoute);
app.use(qoutesRoute);
app.use(invoicesRoute);
app.use(downloadFiles);

app.listen(8000,()=>{
    console.log("listening on port 8000");
})