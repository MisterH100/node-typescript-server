"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer = require('multer');
var uuidv4 = require('uuid').v4;
var router = (0, express_1.Router)();
var Qoute = require('../models/qoutes');
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
router.post("/create_new_qoute", upload.single("qouteFile"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var qoute_file, url, _a, name, address, qoute_number, cleanString, toNumber, newQoute, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                qoute_file = req.file;
                url = req.protocol + '://' + req.get('host');
                _a = req.body, name = _a.name, address = _a.address, qoute_number = _a.qoute_number;
                cleanString = function (str) {
                    return str === null || str === void 0 ? void 0 : str.replace(/\s+/g, '');
                };
                toNumber = function (arg) {
                    if (typeof arg == "number") {
                        return arg;
                    }
                    else {
                        return Number(arg);
                    }
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                newQoute = new Qoute({
                    name: name,
                    address: address,
                    qoute_number: toNumber(qoute_number),
                    qoute_file: url + "/qoute/file/" + cleanString(qoute_file === null || qoute_file === void 0 ? void 0 : qoute_file.originalname),
                    date: Date.now()
                });
                return [4 /*yield*/, newQoute.save()];
            case 2:
                _b.sent();
                res.send("succsess");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.send(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/qoute/file/:file_name", function (req, res) {
    var file = req.params.file_name;
    try {
        var qouteFile = "qoutes/".concat(file);
        res.send(qouteFile);
    }
    catch (error) {
        res.send(error);
    }
});
router.get("/qoutes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Qoute.find().sort({ date: "descending" })
                        .then(function (qoutes) {
                        res.send(qoutes);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.send(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/qoute/number/:qoute_number", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var qoute_number, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qoute_number = req.params.qoute_number;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Qoute.find({ qoute_number: qoute_number })
                        .then(function (qoute) {
                        res.send(qoute);
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.send(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/qoute/name/:name", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, cleanString, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.params.name;
                cleanString = function (str) {
                    return str.replace(/\s+/g, '');
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Qoute.find({ name: { $regex: cleanString(name) } })
                        .then(function (qoute) {
                        res.send(qoute);
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.send(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/qoute/date/:date", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = req.params.date;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Qoute.find({ date: { $gt: new Date(date) } })
                        .then(function (qoute) {
                        res.send(qoute);
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.send(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete("/qoute/delete/:number", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var qoute_number, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qoute_number = req.params.number;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Qoute.deleteOne({ qoute_number: qoute_number })
                        .then(function () {
                        res.send("deleted");
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.send(error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
