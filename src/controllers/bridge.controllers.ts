// bridge controller CRUD
import express, { Request, Response } from 'express'

import Bridge from '../models/bridgeModel';
import Logs from '../models/logsModel';

// create bridge

export const createBridge = async (req: Request, res: Response) => {
    try {
        const { id, name, ward, city, status, lastMaintenanceDate, maintenanceFrequency } = req.body;

        // Check if a bridge with the same name already exists
        const existingBridge = await Bridge.findOne({ id });
        if (existingBridge) {
            return res.status(400).json({ message: 'Bridge with this name already exists' });
        }

        // crete a bridge id as ref number using random pattern

        const refNumber = Math.floor(100000 + Math.random() * 900000);

        // Create a new bridge
        const newBridge = new Bridge({
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
        const savedBridge = await newBridge.save();

        // Create a log entry for the bridge creation
        const logEntry = new Logs({
            bridgeId: savedBridge._id,
            action: 'Created',
            timestamp: new Date(),
        });

        // Save the log entry to the database
        await logEntry.save();

        res.status(201).json(savedBridge);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

};

// get all bridges

export const getAllBridges = async (req: Request, res: Response) => {
    try {
        const bridges = await Bridge.find();
        res.status(200).json(bridges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// get bridge by id

export const getBridgeById = async (req: Request, res: Response) => {
    try {
        const bridge = await Bridge.findById(req.params.id);
        if (!bridge) {
            return res.status(404).json({ message: 'Bridge not found' });
        }
        res.status(200).json(bridge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// update bridge

export const updateBridge = async (req: Request, res: Response) => {
    try {
        const { name, location, status, lastMaintenanceDate, maintenanceFrequency } = req.body;

        // Find the bridge by ID
        const bridge = await Bridge.findById(req.params.id);
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
        const updatedBridge = await bridge.save();

        // Create a log entry for the bridge update
        const logEntry = new Logs({
            bridgeId: updatedBridge._id,
            action: 'Updated',
            timestamp: new Date(),
        });

        // Save the log entry to the database
        await logEntry.save();

        res.status(200).json(updatedBridge);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

};

// delete bridge

export const deleteBridge = async (req: Request, res: Response) => {
    try {
        // Find the bridge by ID
        const bridge = await Bridge.findById(req.params.id);
        if (!bridge) {
            return res.status(404).json({ message: 'Bridge not found' });
        }

        // Delete the bridge from the database
        await Bridge.findByIdAndDelete(req.params.id);

        // Create a log entry for the bridge deletion
        const logEntry = new Logs({
            bridgeId: bridge._id,
            action: 'Deleted',
            timestamp: new Date(),
        });

        // Save the log entry to the database
        await logEntry.save();

        res.status(200).json({ message: 'Bridge deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

};

// get entries using sockets

export const entries = async (req: Request, res: Response) => {
    try {
        const { id, wgt, vib, temp } = req.body;

        // Log the request body for debugging
        console.log('Request Body:', req.body);

        // Create a new log entry
        const entry = new Logs({
            id,
            wgt,
            vib: vib,
            temp: temp,
            createAt: new Date()
        });

        // Log the entry before saving
        // console.log('Log Entry Before Save:', entry);

        // Save the log entry to the database
        const savedEntry = await entry.save();

        // console.log('jksjdks:', savedEntry);

        // Emit the new log entry via WebSocket
        if (savedEntry) {
            req.app.get('io').emit('data-logs', savedEntry);
        }

        // Send a success response
        res.status(200).json({ status: "Ok", message: "Entry successfully sent", data: savedEntry });
    } catch (error) {
        console.error('Error Saving Log Entry:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};