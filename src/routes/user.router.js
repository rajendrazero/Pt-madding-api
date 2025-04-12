"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var validate_1 = require("../middlewares/validate");
var user_validation_1 = require("../validations/user.validation");
var router = express_1.default.Router();
// Ambil semua user
router.get('/', user_controller_1.getAllUsers);
// Ambil user dengan filter (keyword, role, isVerified, dll)
router.get('/filter', user_controller_1.getUsersWithFilters);
// Tambah user baru, divalidasi dengan schema Zod
router.post('/', (0, validate_1.validate)(user_validation_1.createUserSchema), user_controller_1.createUser);
// Update user berdasarkan ID, divalidasi juga
router.put('/:id', (0, validate_1.validate)(user_validation_1.updateUserSchema), user_controller_1.updateUser);
// Hapus user (soft delete)
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
