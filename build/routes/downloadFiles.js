"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
router.get("/qoutes/data/download", function (req, res) {
    var file = "data/qouteData.json";
    res.download(file);
});
router.get("invoices/data/download", function (req, res) {
    var file = "data/invoiceData.json";
    res.download(file);
});
module.exports = router;
