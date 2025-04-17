"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const app = (0, express_1.default)();
// Deklarasikan allowedOrigins SEBELUM dipakai
const allowedOrigins = [
    'http://localhost:5173',
    'https://litera9.vercel.app',
    'https://litera9-git-main-rajendrazeros-projects.vercel.app',
    'https://litera9-rajendrazeros-projects.vercel.app',
];
// CORS setup
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
// Middleware
app.use(express_1.default.json());
// Test endpoint
app.get('/', (req, res) => {
    res.send('Server berjalan!');
});
// Routes
app.use('/api/auth', auth_router_1.default);
app.use('/api/user', user_router_1.default);
exports.default = app;
