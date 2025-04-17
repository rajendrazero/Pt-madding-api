"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Semua route hanya bisa diakses oleh admin
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.checkRole)('admin'));
// Upload avatar user (admin)
router.post('/upload', upload_middleware_1.upload.single('photo'), user_controller_1.uploadProfileImage);
// Dapatkan semua user
router.get('/', user_controller_1.getAllUsers);
// Dapatkan user berdasarkan ID
router.get('/:id', user_controller_1.getUserByIdHandler);
// Update user berdasarkan ID
router.put('/:id', user_controller_1.updateUser);
// Soft-delete user
router.delete('/:id', user_controller_1.deleteUser);
// Get user yang sudah dihapus
router.get('/users/deleted', user_controller_1.getDeletedUsers);
// Recover user
router.patch('/users/:id/recover', user_controller_1.recoverUser);
// Pagination + filter
router.get('/search', user_controller_1.getUsersPaginated);
// Auth
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout berhasil' });
});
exports.default = router;
