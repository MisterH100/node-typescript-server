import { Router} from 'express';
const multer  = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.MONGO_STRING;
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoClient = new MongoClient(url);
const { v4: uuidv4 } = require('uuid');
const router = Router();
const Qoute = require('../models/qoutes');


const storage = new GridFsStorage({
    url,file: (req:any, file:any) => {
        const cleanString = (str:string) =>{
            return str.replace(/\s+/g, '');
        }
      if (file.mimetype === "application/pdf") {
        return {
          bucketName: "qoutes",
          filename: cleanString(file.originalname),
        }
      } else {
        return cleanString(file.originalname)
      }
    },
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

router.get("/qoute/file/:filename", async(req,res) =>{
    const filename = req.params.filename;
    try {
        await mongoClient.connect()
        const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
          bucketName: "qoutes",
        })
    
        let downloadStream = imageBucket.openDownloadStreamByName(
          filename
        )
        downloadStream.on("data", (data:any) => {
          return res.status(200).write(data)
        })
    
        downloadStream.on("error",(data:any) => {
          return res.status(404).send({ error: "pdf not found" })
        })
    
        downloadStream.on("end", () => {
          return res.end()
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          message: "Error Something went wrong",
          error,
        })
      }
    
});

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