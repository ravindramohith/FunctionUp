const helper = require('./helper');
const Sudoku = require('../models/Sudoku')
const User = require('../models/User')

function Count(board) {
    let [row, col] = find_empty_cell(board);

    // If there are no more empty cells, the puzzle is solved
    if (row == -1 && col == -1) {
        return 1;
    }

    let count = 0;

    // Try each digit from 1 to 9 in the empty cell
    for (let digit = 1; digit <= 9; digit++) {
        if (is_valid_move(board, row, col, digit)) {
            // Place the digit in the empty cell
            board[row][col] = digit;

            // Recursively solve the puzzle with the updated board
            count += Count(board);

            // Remove the digit from the cell
            board[row][col] = 0;
        }
    }

    return count;
}
function find_empty_cell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] == 0) {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}
function is_valid_move(board, row, col, digit) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] == digit) {
            return false;
        }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] == digit) {
            return false;
        }
    }

    // Check subgrid
    let subgrid_row = Math.floor(row / 3) * 3;
    let subgrid_col = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[subgrid_row + i][subgrid_col + j] == digit) {
                return false;
            }
        }
    }

    return true;
}

exports.solve = async (req, res) => {
    if (req.user) {
        // console.log(solveSudoku(req.body.string));
        const board = req.body.string.split("\n").map(row => row.split(""));
        d = []
        for (let i = 0; i < 9; i++) {
            d.push(board[i].map(num => parseInt(num)))
        }
        const question = d;
        // console.log(question, d)
        // d = [[2, 9, 5, 7, 4, 3, 8, 6, 1], [4, 3, 1, 8, 6, 5, 9, 0, 0], [8, 7, 6, 1, 9, 2, 5, 4, 3], [3, 8, 7, 4, 5, 9, 2, 1, 6], [6, 1, 2, 3, 8, 7, 4, 9, 5], [5, 4, 9, 2, 1, 6, 7, 3, 8], [7, 6, 3, 5, 3, 4, 1, 8, 9], [9, 2, 8, 6, 7, 1, 3, 5, 4], [1, 5, 4, 9, 3, 8, 6, 0, 0]]
        const startTime = performance.now();
        const solution = helper.solve_puzzle(d);
        const endTime = performance.now();
        const count = Count(d);
        const sudoku = await Sudoku.create({ UserId: req.user._id, question: req.body.string, time: endTime - startTime });
        sudoku.save();
        const thisUser = await User.findByIdAndUpdate(req.user._id, { score: req.user.score + 30 }, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            success: 'true',
            time: `Solved in ${endTime - startTime} ms`,
            count,
            question,
            solution
        })
    } else {
        res.status(403).json({ success: 'fail', message: 'please login to continue' })
    }
}

exports.getFastest = async (req, res) => {
    const sudokus = await Sudoku.find({}, null, { sort: { time: 1 } });
    res.status(200).json({
        status: 'success',
        sudokus
    });
}