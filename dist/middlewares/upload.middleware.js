"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Fungsi untuk sanitasi nama file
const sanitizeFilename = (filename) => {
    return filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
};
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        const uniqueName = `${Date.now()}-${sanitizedFilename}`;
        cb(null, uniqueName);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        cb(new Error('Hanya file gambar yang diperbolehkan.'));
    }
    else {
        cb(null, true);
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
});
