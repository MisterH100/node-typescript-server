import mongoose from "mongoose";

//Data schema
const invoiceSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    name: String,
    address: String,
    invoice_number: Number,
    invoice_file: String,
    date: {
        type: Date,
        default:Date.now()
    }
}); 

module.exports = mongoose.model("invoices", invoiceSchema);