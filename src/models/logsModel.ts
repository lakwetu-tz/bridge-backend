import mongoose, { Schema, Document } from 'mongoose';

const LogSchema: Schema = new Schema({
    deviceId: {
        type: String,
        required: true,
        trim: true,
    },
    wgt: {
        type: String,
        required: true,
        trim: true
    },
    vib: {
        type: String,
        required: true,
        trim: true
    },
    temp: {
        type: String,
        required: true,
        trim: true
    },
   
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },

},
{
    timestamps: true
})

export default mongoose.model('Logs', LogSchema);