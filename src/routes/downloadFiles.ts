import { Router } from 'express';
const router = Router();
const Invoice = require("../models/invoices");
const Qoute = require("../models/qoutes");


router.get("/qoutes/data/download", async(req,res)=>{
    try {
        await Qoute.find()
        .then((file:any)=>{
            res.download(file);
        })
        
    } catch (error) {
        res.send(error)
    }
})

router.get("/invoices/data/download", async(req,res)=>{
    try {
        await Invoice.find()
        .then((file:any)=>{
            res.download(file);
        })
        
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;