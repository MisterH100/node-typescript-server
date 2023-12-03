"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_2 = require("express");
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
var router = (0, express_2.Router)();
var cors = require("cors");
var qoutesRoute = require("./routes/qoutesRoute");
var invoicesRoute = require("./routes/invoicesRoute");
var downloadFiles = require("./routes/downloadFiles");
var homeRoute = router.get("/", function (req, res) {
    res.send("welcome to c and c data server");
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
app.listen(8080, function () {
    console.log("listening on port 8080");
});
