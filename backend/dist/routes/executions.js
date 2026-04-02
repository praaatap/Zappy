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
const models_1 = require("../models");
const router = (0, express_1.Router)();
// Get executions for a workflow
router.get('/:workflowId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workflowId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const executions = yield models_1.ExecutionLog.find({ workflowId })
            .sort({ startedAt: -1 })
            .limit(limit);
        res.json({ executions });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
