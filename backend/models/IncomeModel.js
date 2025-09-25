import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({ 
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    icon: { type: String, required: true },
    amount: { type: Number, required: true },
    source: { type: String, required: true }, //example : salary, freelance, etc
    date: { type: Date, required: true },
}, { timestamps: true });


export default mongoose.model('Income', incomeSchema);