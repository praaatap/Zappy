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
const errorHandler_1 = require("../middlewares/errorHandler");
const router = (0, express_1.Router)();
// Get all available templates
router.get('/', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield models_1.Workflow.find({ isTemplate: true }).select('name description trigger actions');
    res.json({ templates });
})));
// Get single template
router.get('/:id', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const template = yield models_1.Workflow.findById(req.params.id);
    if (!template || !template.isTemplate) {
        return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ template });
})));
// Create workflow from template
router.post('/:id/use', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers['x-user-id'] || '60c72b2f9b1d8b3a4c8e4d1f';
    const template = yield models_1.Workflow.findById(req.params.id);
    if (!template || !template.isTemplate) {
        return res.status(404).json({ error: 'Template not found' });
    }
    const newWorkflow = yield models_1.Workflow.create({
        userId,
        name: `${template.name} - Copy`,
        description: template.description,
        trigger: template.trigger,
        actions: template.actions,
        status: 'draft'
    });
    res.status(201).json({ workflow: newWorkflow });
})));
// Create new template (admin only)
router.post('/', (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, trigger, actions } = req.body;
    const template = yield models_1.Workflow.create({
        name,
        description,
        trigger,
        actions,
        isTemplate: true,
        status: 'active'
    });
    res.status(201).json({ template });
})));
exports.default = router;
