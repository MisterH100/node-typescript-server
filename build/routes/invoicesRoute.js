"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = __importDefault(require("fs"));
var uuidv4 = require('uuid').v4;
var multer = require('multer');
var router = (0, express_1.Router)();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'invoices');
    },
    filename: function (req, file, cb) {
        var cleanString = function (str) {
            return str.replace(/\s+/g, '');
        };
        cb(null, cleanString(file.originalname));
    }
});
var upload = multer({ storage: storage });
router.post("/create_new_invoice", upload.single("invoiceFile"), function (req, res) {
    var invoice_file = req.file;
    var url = req.protocol + '://' + req.get('host');
    var _a = req.body, name = _a.name, address = _a.address, invoice_number = _a.invoice_number;
    var cleanString = function (str) {
        return str === null || str === void 0 ? void 0 : str.replace(/\s+/g, '');
    };
    var toNumber = function (arg) {
        if (typeof arg == "number") {
            return arg;
        }
        else {
            return Number(arg);
        }
    };
    try {
        var file = fs_1.default.readFileSync("data/invoiceData.json", "utf-8");
        var data = JSON.parse(file);
        var invoiceData = {
            id: uuidv4(),
            name: name,
            address: address,
            invoice_number: toNumber(invoice_number),
            invoice_file: url + "/invoice/file/" + cleanString(invoice_file === null || invoice_file === void 0 ? void 0 : invoice_file.originalname),
            date: Date.now()
        };
        data.push(invoiceData);
        var newData = JSON.stringify(data);
        fs_1.default.writeFileSync("data/invoiceData.json", newData, "utf-8");
        res.send("succsess");
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/invoice/file/:file_name", function (req, res) {
    var file = req.params.file_name;
    try {
        var invoiceFile = "invoices/".concat(file);
        res.download(invoiceFile);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/invoices", function (req, res) {
    try {
        var invoiceDetails = fs_1.default.readFileSync("data/invoiceData.json", "utf-8");
        var data = JSON.parse(invoiceDetails);
        res.send(data);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/invoice/number/:invoice_number", function (req, res) {
    var invoice_number = req.params.invoice_number;
    try {
        var file = fs_1.default.readFileSync("data/invoiceData.json", "utf-8");
        var data = JSON.parse(file);
        var thisInvoice = data.find(function (d) { return d.invoice_number == invoice_number; });
        res.send(thisInvoice);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/invoice/name/:name", function (req, res) {
    var name = req.params.name;
    var cleanString = function (str) {
        return str.replace(/\s+/g, '');
    };
    try {
        var file = fs_1.default.readFileSync("data/invoiceData.json", "utf-8");
        var data = JSON.parse(file);
        var thisInvoice = data.find(function (d) { return cleanString(d.name) == cleanString(name); });
        res.send(thisInvoice);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/invoice/date/:date", function (req, res) {
    var date = req.params.date;
    try {
        var file = fs_1.default.readFileSync("data/invoiceData.json", "utf-8");
        var data = JSON.parse(file);
        var thisInvoice = data.find(function (d) { return new Date(d.date) >= new Date(date); });
        res.send({ thisInvoice: thisInvoice });
    }
    catch (error) {
        res.send(error);
    }
});
module.exports = router;
