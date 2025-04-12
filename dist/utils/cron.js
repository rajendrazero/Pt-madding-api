"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
node_cron_1.default.schedule('*/3 * * * *', async () => {
    console.log('Menjalankan scheduled tasks setiap 30 menit...');
    try {
        console.log('> Menjalankan cleanUnverified...');
        await (0, auth_service_1.cleanUnverified)();
        console.log('> Selesai cleanUnverified');
    }
    catch (error) {
        console.error('> Gagal menjalankan cleanUnverified:', error);
    }
    try {
        console.log('> Menjalankan deleteOldSoftDeletedUsers...');
        await (0, user_service_1.deleteOldSoftDeletedUsers)();
        console.log('> Selesai deleteOldSoftDeletedUsers');
    }
    catch (error) {
        console.error('> Gagal menjalankan deleteOldSoftDeletedUsers:', error);
    }
});
