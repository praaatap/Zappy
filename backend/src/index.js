"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Connect to Database
(0, db_1.default)();
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const workflows_1 = __importDefault(require("./routes/workflows"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const executions_1 = __importDefault(require("./routes/executions"));
const zap_1 = __importDefault(require("./routes/zap"));
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/workflows', workflows_1.default);
app.use('/api/v1/webhooks', webhooks_1.default);
app.use('/api/v1/executions', executions_1.default);
app.use('/api/v1/zap', zap_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Zappy API is running' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map