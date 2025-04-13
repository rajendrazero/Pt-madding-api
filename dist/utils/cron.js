"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
node_cron_1.default.schedule('*/30 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Menjalankan scheduled tasks setiap 30 menit...');
    try {
        console.log('> Menjalankan cleanUnverified...');
        yield (0, auth_service_1.cleanUnverified)();
        console.log('> Selesai cleanUnverified');
    }
    catch (error) {
        console.error('> Gagal menjalankan cleanUnverified:', error);
    }
    try {
        console.log('> Menjalankan deleteOldSoftDeletedUsers...');
        yield (0, user_service_1.deleteOldSoftDeletedUsers)();
        console.log('> Selesai deleteOldSoftDeletedUsers');
    }
    catch (error) {
        console.error('> Gagal menjalankan deleteOldSoftDeletedUsers:', error);
    }
}));
