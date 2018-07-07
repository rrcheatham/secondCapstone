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

const userDataSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    firstname: {type: String},
    lastname: {type: String},
    age: {type: Number},
    country: {type: String},
    city: {type: String}
});

userDataSchema.methods.serialize = function() {
    return {
        username: this.username,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        age: this.age,
        country: this.country,
        city: this.city
    };
};

const ExpenseData = mongoose.model('ExpenseData', expenseDataSchema, 'expenses');
const UserData = mongoose.model('UserData', userDataSchema, 'users');

module.exports = { ExpenseData, UserData };

