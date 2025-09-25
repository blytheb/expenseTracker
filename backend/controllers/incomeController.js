import Income from '../models/IncomeModel.js';
import xlsx from 'xlsx';

//add income source
export const addIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const {icon, source, amount, date} = req.body;

        //validation: check for missing fields
        if(!icon || !source || !amount || !date) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        return res.status(201).json({message: 'Income source added successfully', income: newIncome});
    } catch (error) {
        res.status(500).json({message: 'Add Income Server error', error: error.message});

    };
};
//get all income sources
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({ userId }).sort({ date: -1});
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server error in getallIncome"});
    }
};

//delete income source
export const deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income deleted successfully"}); 
    } catch (error) {
        res.status(500).json({message: "Server error in delete income"});
    }
};

//download income data as excel
export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});
        //prepare date for excell
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({message: "server error in download income excel"})
        
    }
};  