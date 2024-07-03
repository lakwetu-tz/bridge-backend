import mongoose, { Schema, Document } from 'mongoose';

const BridgeSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: false,
    },
    average_wgt: {
        type: Number,
        required: false,
    },
    average_vib: {
        type: Number,
        required: false,
    },
    average_temp: {
        type: Number,
        required: false
    },
    location: {
        ward: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        }
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },

},)

export default  mongoose.model('Bridge', BridgeSchema);