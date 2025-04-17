"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer_1 = require("multer");
var storage = multer_1.default.memoryStorage();
var allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
var fileFilter = function (_req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error('Hanya file gambar (JPEG, PNG, WEBP) yang diperbolehkan.'));
    }
    else {
        cb(null, true);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // Maksimal 2MB
    },
});
