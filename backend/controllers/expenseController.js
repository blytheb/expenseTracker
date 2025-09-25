import Expense from '../models/ExpenseModel.js';
import xlsx from 'xlsx';

//add expense source
export const addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const {icon, category, amount, date} = req.body;

        //validation: check for missing fields
        if(!icon || !category || !amount || !date) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        return res.status(201).json({message: 'Expense source added successfully', Expense: newExpense});
    } catch (error) {
        res.status(500).json({message: 'Add Expense Server error', error: error.message});

    };
};
//get all expense sources
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try{
        const expense = await Expense.find({ userId }).sort({ date: -1});
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server error in getallExpense"});
    }
};

//delete expense source
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully"}); 
    } catch (error) {
        res.status(500).json({message: "Server error in delete expense"});
    }
};

//download expense data as excel
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        //prepare date for excel
        const data = expense.map((item) => ({
            Source: item.source,
            Category: item.category,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Expense");
        xlsx.writeFile(wb, 'expense_details.xlsx');
        res.download('expense_details.xlsx');
    } catch (error) {
        res.status(500).json({message: "server error in download expense excel"})
    }
};  