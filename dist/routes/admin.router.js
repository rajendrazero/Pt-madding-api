"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Semua route di bawah hanya bisa diakses admin
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.checkRole)('admin'));
// Route untuk mendapatkan semua user
router.get('/', user_controller_1.getAllUsers);
// Route untuk mendapatkan user berdasarkan ID (admin bisa melihat semua user)
router.get('/:id', user_controller_1.getUserByIdHandler); // Menambahkan route baru
// Route untuk update user berdasarkan ID
router.put('/:id', user_controller_1.updateUser);
// Route untuk menghapus user berdasarkan ID (admin bisa hapus user lain)
router.delete('/:id', user_controller_1.deleteUser);
// Route untuk mencari user dengan pagination
router.get('/search', user_controller_1.getUsersPaginated);
// Route untuk mengembalikan user yang telah dihapus (admin bisa recover user)
router.patch('/users/:id/recover', user_controller_1.recoverUser);
// Route untuk mendapatkan daftar user yang terhapus (soft delete)
router.get('/users/deleted', user_controller_1.getDeletedUsers);
// Route untuk logout
router.post('/logout', (req, res) => {
    // Tidak perlu melakukan apapun di server karena token JWT bersifat stateless
    // Hanya mengembalikan response logout berhasil
    res.status(200).json({ message: 'Logout berhasil' });
});
router.post('/refresh-token', auth_controller_1.refreshToken);
exports.default = router;
