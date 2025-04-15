"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Terapkan middleware untuk semua route di bawahnya
router.use(auth_middleware_1.verifyToken); // Semua route membutuhkan token yang valid
// Route untuk mendapatkan profile user (hanya bisa diakses oleh user itu sendiri)
router.get('/', (0, auth_middleware_1.checkRole)('user'), (req, res) => {
    const user = req.user;
    res.status(200).json({ message: 'Profile user', user });
});
router.get('/', user_controller_1.getAllUsers);
// Route untuk update profile user (hanya bisa diakses oleh user itu sendiri)
router.put('/profile', (0, auth_middleware_1.checkRole)('user'), user_controller_1.updateOwnProfile);
// Route untuk menghapus user (Hanya bisa dihapus oleh admin atau user itu sendiri)
router.delete('/:id', (0, auth_middleware_1.checkRole)('user'), user_controller_1.deleteUser);
// Route untuk logout
router.post('/logout', (req, res) => {
    // Tidak perlu melakukan apapun di server karena token JWT bersifat stateless
    // Hanya mengembalikan response logout berhasil
    res.status(200).json({ message: 'Logout berhasil' });
});
router.post('/refresh-token', auth_controller_1.refreshToken);
exports.default = router;
