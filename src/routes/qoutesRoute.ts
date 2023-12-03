import { Router } from 'express';
import fs from 'fs';
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
const router = Router();

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

router.post("/create_new_qoute",upload.single("qouteFile"),(req,res)=>{
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
        
        const file = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(file);
        const qouteData = {
            id: uuidv4(),
            name:name,
            address:address,
            qoute_number: toNumber(qoute_number),
            qoute_file: url+"/qoute/file/"+cleanString(qoute_file?.originalname),
            date: Date.now()
        }
        data.push(qouteData);
        const newData = JSON.stringify(data);
        fs.writeFileSync("data/qouteData.json",newData,"utf-8");
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

router.get("/qoutes",(req,res)=>{
    try {   
        const quoteDetails = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(quoteDetails);
        res.send(data)
    } catch (error) {
        res.send(error)
    }
})


router.get("/qoute/number/:qoute_number", (req,res)=>{
    const qoute_number = req.params.qoute_number;
    try {      
        const file = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(file);
    
        const thisQoute = data.find((d:any)=>d.qoute_number == qoute_number);
        res.send(thisQoute);

    } catch (error) {
        res.send(error)
    }
})

router.get("/qoute/name/:name", (req,res)=>{
    const name = req.params.name;
    const cleanString = (str:string) =>{
        return str.replace(/\s+/g, '');
    }

    try {      
        const file = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(file);
        const thisQoute = data.find((d:any)=>cleanString(d.name) == cleanString(name));
        res.send(thisQoute);

    } catch (error) {
        res.send(error)
    }
})

router.get("/qoute/date/:date", (req,res)=>{
    const date = req.params.date;
    try {      
        const file = fs.readFileSync("data/qouteData.json","utf-8");
        const data = JSON.parse(file);
        const thisQoute = data.find((d:any)=> new Date(d.date) >=  new Date(date));
        res.send({thisQoute});

    } catch (error) {
        res.send(error)
    }
})


module.exports = router;