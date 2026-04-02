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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../../data/models");
const router = (0, express_1.Router)();
// Get Dashboard Analytics/Stats
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
        // Get total users, total zaps, total executions (Aggregations)
        const [totalWorkflows, activeWorkflows, recentExecutions] = yield Promise.all([
            models_1.Workflow.countDocuments({ userId }),
            models_1.Workflow.countDocuments({ userId, status: 'active' }),
            models_1.ExecutionLog.find().sort({ startedAt: -1 }).limit(5).populate('workflowId', 'name')
        ]);
        // Calculate success rate over the last 100 executions
        const last100 = yield models_1.ExecutionLog.find().sort({ startedAt: -1 }).limit(100);
        const successful = last100.filter((log) => log.status === 'success').length;
        const successRate = last100.length > 0 ? (successful / last100.length) * 100 : 100;
        res.json({
            stats: {
                totalWorkflows,
                activeWorkflows,
                successRate: Math.round(successRate),
                totalExecutions: last100.length,
            },
            recentExecutions
        });
    }
    catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: 'Server error retrieving stats' });
    }
}));
exports.default = router;
