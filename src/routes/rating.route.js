"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ratingController = require("../controllers/rating.controller");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, ratingController.createRating);
exports.default = router;
