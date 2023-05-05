const mongoose = require('mongoose');


const sudokuSchema = new mongoose.Schema(
    {
        question: String,
        UserId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        time: Number
    }
)


const Sudoku = mongoose.model('Sudoku', sudokuSchema);
module.exports = Sudoku;
