"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// ==================
// Middleware umum
// ==================
router.use(auth_middleware_1.verifyToken);
// ==================
// Route untuk user & admin
// ==================
router.get('/', (0, auth_middleware_1.checkRoles)('user', 'admin'), (req, res) => {
    const user = req.user;
    res.status(200).json({ message: 'Profile user', user });
});
router.post('/upload', (0, auth_middleware_1.checkRoles)('user', 'admin'), upload_middleware_1.upload.single('photo'), user_controller_1.uploadProfileImage);
router.put('/profile', (0, auth_middleware_1.checkRoles)('user', 'admin'), user_controller_1.updateOwnProfile);
router.get('/:id', (0, auth_middleware_1.checkRoles)('user', 'admin'), user_controller_1.getUserByIdHandler);
router.delete('/:id', (0, auth_middleware_1.checkRoles)('user', 'admin'), user_controller_1.deleteUser);
// ==================
// Route khusus admin
// ==================
router.use((0, auth_middleware_1.checkRoles)('admin')); // Semua route di bawah ini hanya untuk admin
router.get('/users', user_controller_1.getAllUsers);
router.get('/users/deleted', user_controller_1.getDeletedUsers);
router.get('/users/search', user_controller_1.getUsersPaginated);
router.patch('/users/:id/recover', user_controller_1.recoverUser);
router.get('/users/:id', user_controller_1.getUserByIdHandler);
router.put('/users/:id', user_controller_1.updateUser);
router.delete('/users/:id', user_controller_1.deleteUser);
// ==================
// Auth umum
// ==================
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/logout', (_req, res) => {
    res.status(200).json({ message: 'Logout berhasil' });
});
exports.default = router;
