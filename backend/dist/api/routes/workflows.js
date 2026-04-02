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
const auth_1 = require("../middlewares/auth");
const errorHandler_1 = require("../middlewares/errorHandler");
const router = (0, express_1.Router)();
// Get all workflows for a user
router.get('/', auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || req.headers['x-user-id'];
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const workflows = yield models_1.Workflow.find({ userId });
    res.json({ workflows });
})));
// Get single workflow
router.get('/:id', auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workflow = yield models_1.Workflow.findById(req.params.id);
    if (!workflow)
        return res.status(404).json({ error: 'Not found' });
    res.json({ workflow });
})));
// Create workflow
router.post('/', auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId || req.headers['x-user-id'];
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    const workflowData = Object.assign(Object.assign({}, req.body), { userId, trigger: Object.assign(Object.assign({}, req.body.trigger), { webhookUrl: `http://localhost:5000/api/v1/webhooks/trigger/${Date.now()}` }) });
    const workflow = yield models_1.Workflow.create(workflowData);
    res.status(201).json({ workflow });
})));
// Update workflow
router.put('/:id', auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workflow = yield models_1.Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ workflow });
})));
// Delete workflow
router.delete('/:id', auth_1.optionalAuthMiddleware, (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Workflow.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workflow deleted successfully' });
})));
exports.default = router;
