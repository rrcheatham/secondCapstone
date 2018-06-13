const mongoose = require('mongoose');

const expenseDataSchema = mongoose.Schema({
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    month: {type: String, required: true},
    type: {type: String, required: true},
    username: {type: String, require: true}
});

expenseDataSchema.methods.serialize = function() {
    return {
        id: this._id,
        category: this.category,
        amount: this.amount,
        month: this.month,
        type: this.type
    };
};

const ExpenseData = mongoose.model('ExpenseData', expenseDataSchema, 'expenses');

module.exports = {ExpenseData};

