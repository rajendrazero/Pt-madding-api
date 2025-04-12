"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var router = (0, express_1.Router)();
router.post('/', user_controller_1.createUser);
router.get('/', user_controller_1.getAllUsers);
router.put('/:id', user_controller_1.updateUser); // Untuk edit user
router.delete('/:id', user_controller_1.deleteUser); // Untuk hapus user (soft delete)
exports.default = router;
