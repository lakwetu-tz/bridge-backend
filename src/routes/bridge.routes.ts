import express from 'express';
import { createBridge, deleteBridge, entries, getAllBridges, getBridgeById, updateBridge, } from "../controllers/bridge.controllers";

const router = express.Router();

router.post('/create', createBridge);

router.put('/update', updateBridge);

router.get('/get/:id', getBridgeById);

router.get('/all', getAllBridges);

router.delete('/delete/:id', deleteBridge);

router.post('/entries', entries);

export default router