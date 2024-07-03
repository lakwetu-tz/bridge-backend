"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bridge_controllers_1 = require("../controllers/bridge.controllers");
const router = express_1.default.Router();
router.post('/create', bridge_controllers_1.createBridge);
router.put('/update', bridge_controllers_1.updateBridge);
router.get('/get/:id', bridge_controllers_1.getBridgeById);
router.get('/all', bridge_controllers_1.getAllBridges);
router.delete('/delete/:id', bridge_controllers_1.deleteBridge);
router.post('/entries', bridge_controllers_1.entries);
exports.default = router;
