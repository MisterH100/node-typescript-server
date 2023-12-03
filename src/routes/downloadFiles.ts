import { Router } from 'express';
const router = Router();


router.get("/qoutes/data/download", (req,res)=>{
    const file = "data/qouteData.json";
    res.download(file);
})

router.get("/invoices/data/download", (req,res)=>{
    const file = "data/invoiceData.json";
    res.download(file);
})

module.exports = router;