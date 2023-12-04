"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_2 = require("express");
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
var app = (0, express_1.default)();
var router = (0, express_2.Router)();
var cors = require("cors");
var qoutesRoute = require("./routes/qoutesRoute");
var invoicesRoute = require("./routes/invoicesRoute");
var downloadFiles = require("./routes/downloadFiles");
mongoose_1.default.connect(process.env.MONGO_STRING)
    .then(function () { return console.log("Connected to DataBase"); })
    .catch(function (err) {
    console.log(err + "Failed to Connect to DataBase");
});
var homeRoute = router.get("/", function (req, res) {
    res.send("welcome to candc data server");
});
app.use(express_1.default.json());
app.use(cors());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static('build'));
app.use(homeRoute);
app.use(qoutesRoute);
app.use(invoicesRoute);
app.use(downloadFiles);
app.listen(process.env.PORT, function () {
    console.log("listening on port 8080");
});
