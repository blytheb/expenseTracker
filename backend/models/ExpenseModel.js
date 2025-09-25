import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({ 
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    icon: { type: String, required: true },
    category: { type: String, required: true }, //example : food, rent, groceries
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });


export default mongoose.model('Expense', expenseSchema);