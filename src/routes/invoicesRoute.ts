import { Router } from 'express';
import fs from 'fs';
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
const router = Router();

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb:any) =>{
      cb(null, 'invoices')
    },
    filename: (req:any, file:any, cb:any)=> {
        const cleanString = (str:string) =>{
            return str.replace(/\s+/g, '');
        }
        cb(null, cleanString(file.originalname))
    }
})
  
const upload = multer({ storage })

router.post("/create_new_invoice",upload.single("invoiceFile"),(req,res)=>{
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
        
        const file = fs.readFileSync("data/invoiceData.json","utf-8");
        const data = JSON.parse(file);
        const invoiceData = {
            id: uuidv4(),
            name:name,
            address:address,
            invoice_number:toNumber(invoice_number),
            invoice_file: url+"/invoice/file/"+cleanString(invoice_file?.originalname),
            date: Date.now()
        }
        data.push(invoiceData);
        const newData = JSON.stringify(data);
        fs.writeFileSync("data/invoiceData.json",newData,"utf-8");
        res.send("succsess");
    } catch (error) {
        res.send(error)
    }

})

router.get("/invoice/file/:file_name",(req,res)=>{
    const file = req.params.file_name;
    try {  
        const invoiceFile = `invoices/${file}`;
        res.download(invoiceFile);
    } catch (error) {
        res.send(error)
    }
})

router.get("/invoices",(req,res)=>{
    try {   
        const invoiceDetails = fs.readFileSync("data/invoiceData.json","utf-8");
        const data = JSON.parse(invoiceDetails);
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})


router.get("/invoice/number/:invoice_number", (req,res)=>{
    const invoice_number = req.params.invoice_number;
    try {      
        const file = fs.readFileSync("data/invoiceData.json","utf-8");
        const data = JSON.parse(file);
    
        const thisInvoice = data.find((d:any)=>d.invoice_number == invoice_number);
        res.send(thisInvoice);

    } catch (error) {
        res.send(error)
    }
})

router.get("/invoice/name/:name", (req,res)=>{
    const name = req.params.name;
    const cleanString = (str:string) =>{
        return str.replace(/\s+/g, '');
    }

    try {      
        const file = fs.readFileSync("data/invoiceData.json","utf-8");
        const data = JSON.parse(file);
        const thisInvoice = data.find((d:any)=>cleanString(d.name) == cleanString(name));
        res.send(thisInvoice);

    } catch (error) {
        res.send(error)
    }
})

router.get("/invoice/date/:date", (req,res)=>{
    const date = req.params.date;
    try {      
        const file = fs.readFileSync("data/invoiceData.json","utf-8");
        const data = JSON.parse(file);
        const thisInvoice = data.find((d:any)=> new Date(d.date) >=  new Date(date));
        res.send({thisInvoice});

    } catch (error) {
        res.send(error)
    }
})

router.delete("/invoice/delete/:number",(req,res)=>{
    const invoice_number = req.params.number;
    try {
        const file = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(file);
        const remainingInvoices = data.filter((d:any)=> d.invoice_number != invoice_number);
        const newData = JSON.stringify(remainingInvoices);
        fs.writeFileSync("data/qouteData.json",newData,"utf-8");
        res.send("deleted");
    } catch (error) {
        res.send(error)
    }
})


module.exports = router;