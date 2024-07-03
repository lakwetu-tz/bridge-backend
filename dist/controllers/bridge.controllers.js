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
exports.entries = exports.deleteBridge = exports.updateBridge = exports.getBridgeById = exports.getAllBridges = exports.createBridge = void 0;
const bridgeModel_1 = __importDefault(require("../models/bridgeModel"));
const bridgeLogsModel_1 = __importDefault(require("../models/bridgeLogsModel"));
// create bridge
const createBridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, ward, city, status, lastMaintenanceDate, maintenanceFrequency } = req.body;
        // Check if a bridge with the same name already exists
        const existingBridge = yield bridgeModel_1.default.findOne({ id });
        if (existingBridge) {
            return res.status(400).json({ message: 'Bridge with this name already exists' });
        }
        // crete a bridge id as ref number using random pattern
        const refNumber = Math.floor(100000 + Math.random() * 900000);
        // Create a new bridge
        const newBridge = new bridgeModel_1.default({
            id: refNumber,
            name,
            location: {
                ward: ward,
                city: city,
            },
            status: "operational",
            lastMaintenanceDate,
            maintenanceFrequency,
        });
        // Save the bridge to the database
        const savedBridge = yield newBridge.save();
        // Create a log entry for the bridge creation
        const logEntry = new bridgeLogsModel_1.default({
            bridgeId: savedBridge._id,
            action: 'Created',
            timestamp: new Date(),
        });
        // Save the log entry to the database
        yield logEntry.save();
        res.status(201).json(savedBridge);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createBridge = createBridge;
// get all bridges
const getAllBridges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bridges = yield bridgeModel_1.default.find();
        res.status(200).json(bridges);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getAllBridges = getAllBridges;
// get bridge by id
const getBridgeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bridge = yield bridgeModel_1.default.findById(req.params.id);
        if (!bridge) {
            return res.status(404).json({ message: 'Bridge not found' });
        }
        res.status(200).json(bridge);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getBridgeById = getBridgeById;
// update bridge
const updateBridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location, status, lastMaintenanceDate, maintenanceFrequency } = req.body;
        // Find the bridge by ID
        const bridge = yield bridgeModel_1.default.findById(req.params.id);
        if (!bridge) {
            return res.status(404).json({ message: 'Bridge not found' });
        }
        // Update the bridge properties
        bridge.name = name || bridge.name;
        bridge.location = location || bridge.location;
        bridge.status = status || bridge.status;
        bridge.lastMaintenanceDate = lastMaintenanceDate || bridge.lastMaintenanceDate;
        bridge.maintenanceFrequency = maintenanceFrequency || bridge.maintenanceFrequency;
        // Save the updated bridge to the database
        const updatedBridge = yield bridge.save();
        // Create a log entry for the bridge update
        const logEntry = new bridgeLogsModel_1.default({
            bridgeId: updatedBridge._id,
            action: 'Updated',
            timestamp: new Date(),
        });
        // Save the log entry to the database
        yield logEntry.save();
        res.status(200).json(updatedBridge);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateBridge = updateBridge;
// delete bridge
const deleteBridge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the bridge by ID
        const bridge = yield bridgeModel_1.default.findById(req.params.id);
        if (!bridge) {
            return res.status(404).json({ message: 'Bridge not found' });
        }
        // Delete the bridge from the database
        yield bridgeModel_1.default.findByIdAndDelete(req.params.id);
        // Create a log entry for the bridge deletion
        const logEntry = new bridgeLogsModel_1.default({
            bridgeId: bridge._id,
            action: 'Deleted',
            timestamp: new Date(),
        });
        // Save the log entry to the database
        yield logEntry.save();
        res.status(200).json({ message: 'Bridge deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.deleteBridge = deleteBridge;
// get entries using sockets
const entries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceId, wgt, vib, temp } = req.body;
        // // Find the bridge by ID
        //  const bridge = await Bridge.findById(id);
        //  if (!bridge) {
        //      return res.status(404).json({ message: 'Bridge not found' });
        //  }
        // create entries on Log model
        const entry = new bridgeLogsModel_1.default({
            deviceId,
            timestamp: new Date(),
            weight: wgt,
            vibration: vib,
            temperature: temp,
        });
        // save entries to the database
        yield entry.save();
        // open socket and emit data
        if (entry) {
            req.app.get('io').emit('data-logs', entry);
        }
        res.status(200).json({ status: "Ok", message: "entry successfully sent", data: entry });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.entries = entries;
