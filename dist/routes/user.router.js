"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validate_1 = require("../middlewares/validate");
const user_validation_1 = require("../validations/user.validation");
const router = express_1.default.Router();
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
