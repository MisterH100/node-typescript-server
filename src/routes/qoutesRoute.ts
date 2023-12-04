import { Router } from 'express';
import fs from 'fs';
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const router = Router();
const Qoute = require('../models/qoutes');

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb:any) =>{
      cb(null, 'qoutes')
    },
    filename: (req:any, file:any, cb:any)=> {
        const cleanString = (str:string) =>{
            return str.replace(/\s+/g, '');
        }
      cb(null, cleanString(file.originalname))
    }
})
  
const upload = multer({ storage })

router.post("/create_new_qoute",upload.single("qouteFile"),async (req,res)=>{
    const qoute_file = req.file;
    const url = req.protocol + '://' + req.get('host');
    const {name,address,qoute_number} =  req.body;

    const cleanString = (str:string | undefined) =>{
        return str?.replace(/\s+/g, '');
    }
    const toNumber =(arg: number | string)=>{
        if(typeof arg == "number"){
            return arg
        }else{
            return Number(arg)
        }
    }
    try {
        const newQoute = new Qoute({
            id:uuidv4(),
            name:name,
            address:address,
            qoute_number: toNumber(qoute_number),
            qoute_file: url+"/qoute/file/"+cleanString(qoute_file?.originalname),
            date: Date.now()
        })
        await newQoute.save()
        res.send("succsess");
    } catch (error) {
        res.send(error)
    }

})

router.get("/qoute/file/:file_name",(req,res)=>{
    const file = req.params.file_name;
    try {  
        const qouteFile = `qoutes/${file}`;
        res.download(qouteFile);
    } catch (error) {
        res.send(error)
    }
})

router.get("/qoutes",async(req,res)=>{
    try {   
        await Qoute.find().sort({date: "descending"})
        .then((qoutes:[]) => {
            res.send(qoutes);
        });
    } catch (error) {
        res.send(error)
    }
})


router.get("/qoute/number/:qoute_number", async(req,res)=>{
    const qoute_number = req.params.qoute_number;
    try {      
        await Qoute.find({qoute_number:qoute_number})
        .then((qoute:{})=>{
            res.send(qoute)
        })

    } catch (error) {
        res.send(error)
    }
})

router.get("/qoute/name/:name", async(req,res)=>{
    const name = req.params.name;
    const cleanString = (str:string) =>{
        return str.replace(/\s+/g, '');
    }

    try {      
        await Qoute.find({name:{$regex:cleanString(name)}})
        .then((qoute:{})=>{
            res.send(qoute)
        })

    } catch (error) {
        res.send(error)
    }
})

router.get("/qoute/date/:date", async(req,res)=>{
    const date = req.params.date;
    try {      
        await Qoute.find({date:{$gt:new Date(date)}})
        .then((qoute:{})=>{
            res.send(qoute)
        })

    } catch (error) {
        res.send(error)
    }
})

router.delete("/qoute/delete/:number",async(req,res)=>{
    const qoute_number = req.params.number;
    try {
        await Qoute.deleteOne({qoute_number:qoute_number})
        .then(()=>{
            res.send("deleted");
        })
    } catch (error) {
        res.send(error)
    }
})


module.exports = router;