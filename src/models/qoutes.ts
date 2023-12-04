import mongoose from "mongoose";

//Data schema
const qouteSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    name: String,
    address: String,
    qoute_number: Number,
    qoute_file: String,
    date: {
        type: Date,
        default:Date.now()
    }
}); 

module.exports = mongoose.model("qoutations", qouteSchema);