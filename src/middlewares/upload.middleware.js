"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer_1 = require("multer");
var path_1 = require("path");
// Fungsi untuk sanitasi nama file
var sanitizeFilename = function (filename) {
    return filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
};
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (_req, file, cb) {
        var sanitizedFilename = sanitizeFilename(file.originalname);
        var uniqueName = "".concat(Date.now(), "-").concat(sanitizedFilename);
        cb(null, uniqueName);
    },
});
var fileFilter = function (_req, file, cb) {
    var allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    var ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        cb(new Error('Hanya file gambar yang diperbolehkan.'));
    }
    else {
        cb(null, true);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
});
