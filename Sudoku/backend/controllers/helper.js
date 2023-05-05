exports.solve_puzzle = (puzzle) => {
	const size = puzzle.length;

	// Helper function to find an empty cell in the puzzle
	function find_empty_cell() {
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				if (puzzle[row][col] === 0) {
					return [row, col];
				}
			}
		}
		return null;
	}

	// Helper function to check if a given move is valid
	function is_valid_move(row, col, num) {
		// Check row and column constraints
		for (let i = 0; i < size; i++) {
			if (puzzle[row][i] === num || puzzle[i][col] === num) {
				return false;
			}
		}

		// Check 3x3 box constraints
		const box_row = Math.floor(row / 3) * 3;
		const box_col = Math.floor(col / 3) * 3;
		for (let i = box_row; i < box_row + 3; i++) {
			for (let j = box_col; j < box_col + 3; j++) {
				if (puzzle[i][j] === num) {
					return false;
				}
			}
		}

		// Move is valid
		return true;
	}

	// Main solve function using backtracking algorithm
	function solve() {
		const empty_cell = find_empty_cell();
		if (!empty_cell) {
			// Puzzle is solved
			return puzzle;
		}

		const [row, col] = empty_cell;
		for (let num = 1; num <= size; num++) {
			if (is_valid_move(row, col, num)) {
				// Try this move
				puzzle[row][col] = num;

				// Recursively solve the rest of the puzzle
				const solved_puzzle = solve();
				if (solved_puzzle) {
					return solved_puzzle;
				}

				// Undo this move and try the next number
				puzzle[row][col] = 0;
			}
		}

		// No solution found
		return null;
	}

	// Call the main solve function
	return solve();
}
