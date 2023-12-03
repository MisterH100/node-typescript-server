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
        cb(null, 'qoutes');
    },
    filename: function (req, file, cb) {
        var cleanString = function (str) {
            return str.replace(/\s+/g, '');
        };
        cb(null, cleanString(file.originalname));
    }
});
var upload = multer({ storage: storage });
router.post("/create_new_qoute", upload.single("qouteFile"), function (req, res) {
    var qoute_file = req.file;
    var url = req.protocol + '://' + req.get('host');
    var _a = req.body, name = _a.name, address = _a.address, qoute_number = _a.qoute_number;
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
        var file = fs_1.default.readFileSync("data/qouteData.json", "utf-8");
        var data = JSON.parse(file);
        var qouteData = {
            id: uuidv4(),
            name: name,
            address: address,
            qoute_number: toNumber(qoute_number),
            qoute_file: url + "/qoute/file/" + cleanString(qoute_file === null || qoute_file === void 0 ? void 0 : qoute_file.originalname),
            date: Date.now()
        };
        data.push(qouteData);
        var newData = JSON.stringify(data);
        fs_1.default.writeFileSync("data/qouteData.json", newData, "utf-8");
        res.send("succsess");
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoute/file/:file_name", function (req, res) {
    var file = req.params.file_name;
    try {
        var qouteFile = "qoutes/".concat(file);
        res.download(qouteFile);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoutes", function (req, res) {
    try {
        var quoteDetails = fs_1.default.readFileSync("data/qouteData.json", "utf-8");
        var data = JSON.parse(quoteDetails);
        res.send(data);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoute/number/:qoute_number", function (req, res) {
    var qoute_number = req.params.qoute_number;
    try {
        var file = fs_1.default.readFileSync("data/qouteData.json", "utf-8");
        var data = JSON.parse(file);
        var thisQoute = data.find(function (d) { return d.qoute_number == qoute_number; });
        res.send(thisQoute);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoute/name/:name", function (req, res) {
    var name = req.params.name;
    var cleanString = function (str) {
        return str.replace(/\s+/g, '');
    };
    try {
        var file = fs_1.default.readFileSync("data/qouteData.json", "utf-8");
        var data = JSON.parse(file);
        var thisQoute = data.find(function (d) { return cleanString(d.name) == cleanString(name); });
        res.send(thisQoute);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoute/date/:date", function (req, res) {
    var date = req.params.date;
    try {
        var file = fs_1.default.readFileSync("data/qouteData.json", "utf-8");
        var data = JSON.parse(file);
        var thisQoute = data.find(function (d) { return new Date(d.date) >= new Date(date); });
        res.send({ thisQoute: thisQoute });
    }
    catch (error) {
        res.send(error);
    }
});
module.exports = router;
