import express from 'express';
import { Router } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
const app = express();
const router = Router();
const qoutesRoute = require("./routes/qoutesRoute");
const invoicesRoute = require("./routes/invoicesRoute");

const homeRoute = router.get("/",(req,res)=>{
    res.setHeader("Contet-Type","text/html");
    const html = fs.readFileSync("build/index.html","utf-8");
    res.send(html);
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('build'));
app.use(homeRoute);
app.use(qoutesRoute);
app.use(invoicesRoute);

app.listen(8000,()=>{
    console.log("listening on port 8000");
})