import mongoose, { Schema, } from 'mongoose';

const BridgeLogsSchema: Schema = new Schema({
    deviceId: {
        type: String,
        required: true,
        trim: true,
    },
    wgt: {
        type: Number,
        required: false,
    },
    vib: {
        type: Number,
        required: false,
    },
    temp: {
        type: Number,
        required: false
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
 
}, {
    timestamps: true
}, )

export default mongoose.model('BridgeLogs', BridgeLogsSchema);