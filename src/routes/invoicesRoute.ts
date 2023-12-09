import { Router } from 'express';
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.MONGO_STRING;
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoClient = new MongoClient(url);
const router = Router();
const Invoice = require("../models/invoices");

const storage = new GridFsStorage({
    url,file: (req:any, file:any) => {
        const cleanString = (str:string) =>{
            return str.replace(/\s+/g, '');
        }
      if (file.mimetype === "application/pdf") {
        return {
          bucketName: "invoices",
          filename: cleanString(file.originalname),
        }
      } else {
        return {
            bucketName: "invoices",
            filename: cleanString(file.originalname),
        }
      }
    },
})
const upload = multer({ storage })
  
router.post("/create_new_invoice",upload.single("invoiceFile"),async(req,res)=>{
    const invoice_file = req.file;
    const url = req.protocol + '://' + req.get('host');
    const {name,address,invoice_number} =  req.body;

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
        
        const newInvoice = new Invoice({
            id: uuidv4(),
            name:name,
            address:address,
            invoice_number:toNumber(invoice_number),
            invoice_file: url+"/invoice/file/"+cleanString(invoice_file?.originalname),
            date: Date.now()
        });
        await newInvoice.save();
        res.send("succsess");
    } catch (error) {
        res.send(error)
    }

})

router.get("/invoice/file/:filename", async(req,res) =>{
    const filename = req.params.filename;
    try {
        await mongoClient.connect()
        const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
            bucketName: "invoices",
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

router.get("/invoices",async (req,res)=>{
    try {   
        await Invoice.find().sort({date: "descending"})
        .then((invoices:[]) => {
            res.send(invoices);
        });
    } catch (error) {
        res.send(error)
    }
})


router.get("/invoice/:id", async(req,res)=>{
    const invoice_id = req.params.id;
    try {      
        await Invoice.findById(invoice_id)
        .then((invoice:{})=>{
            res.send(invoice)
        })
    } catch (error) {
        res.send(error)
    }
})

router.get("/invoice/name/:name", async(req,res)=>{
    const name = req.params.name;
    const cleanString = (str:string) =>{
        return str.replace(/\s+/g, '');
    }

    try {      
        await Invoice.find({name:{$regex:cleanString(name)}})
        .then((invoice:{})=>{
            res.send(invoice)
        })
    } catch (error) {
        res.send(error)
    }
})

router.get("/invoice/date/:date", async(req,res)=>{
    const date = req.params.date;
    try {      
        await Invoice.find({date:{$gt:new Date(date)}})
        .then((invoice:{})=>{
            res.send(invoice)
        })

    } catch (error) {
        res.send(error)
    }
})

router.delete("/invoice/delete/:number",async(req,res)=>{
    const invoice_number = req.params.number;
    try {
        await Invoice.deleteOne({invoice_number:invoice_number})
        .then(()=>{
            res.send("deleted");
        })
    } catch (error) {
        res.send(error)
    }
})


module.exports = router;