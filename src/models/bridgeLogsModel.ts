import mongoose, { Schema, } from 'mongoose';

const BridgeLogsSchema: Schema = new Schema({
    deviceId: {
        type: String,
        required: false,
        trim: true,
    },
    wgt: {
        type: String,
        required: false,
    },
    vib: {
        type: String,
        required: false,
    },
    temp: {
        type: String,
        required: false
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
 
}, {
    timestamps: true
}, )

export default mongoose.model('BridgeLogs', BridgeLogsSchema);