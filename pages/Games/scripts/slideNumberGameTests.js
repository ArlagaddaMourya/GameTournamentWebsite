// Simple Test Runner for slideNumberGameScript.js

function assertEquals(expected, actual, message) {
    if (expected === actual) {
        console.log(`PASS: ${message}`);
    } else {
        console.error(`FAIL: ${message}. Expected: ${expected}, Actual: ${actual}`);
    }
}

function runSlideNumberGameTests() {
    console.log("Running isSolvable Tests for PuzzleGame...");

    // Test cases for 3x3 grid (Odd grid size)
    // Inversion count must be even for solvability.
    const game3x3 = new PuzzleGame(); // Instantiate once for 3x3 tests
    game3x3.gridSize = 3;
    const totalPieces3x3 = game3x3.gridSize * game3x3.gridSize;

    // Test Case 1: 3x3 Solvable (already solved, 0 inversions)
    let puzzleArray3x3_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9 is the empty piece
    game3x3.emptyIndex = 8; // Empty piece (9) is at index 8
    let result3x3_1 = game3x3.isSolvable(puzzleArray3x3_1, game3x3.gridSize);
    assertEquals(true, result3x3_1, "3x3 Solvable (0 inversions, empty at end)");

    // Test Case 2: 3x3 Solvable (different empty position, 0 inversions)
    let puzzleArray3x3_2 = [1, 2, 3, 4, 5, 6, 7, 9, 8]; // 9 is empty
    game3x3.emptyIndex = 7; // Empty piece (9) is at index 7
    // For isSolvable logic, the array passed should have numbers 1 to N-1 and one placeholder for empty (N)
    // The actual values don't matter for inversion count, only their order.
    // The function `isSolvable` filters out the `totalPieces` number.
    result3x3_1 = game3x3.isSolvable(puzzleArray3x3_2, game3x3.gridSize);
    assertEquals(true, result3x3_1, "3x3 Solvable (0 inversions, empty at index 7)");


    // Test Case 3: 3x3 Unsolvable (1 inversion)
    let puzzleArray3x3_3 = [1, 2, 3, 4, 5, 6, 8, 7, 9]; // 9 is empty, 8 and 7 swapped
    game3x3.emptyIndex = 8; // Empty piece (9) is at index 8
    let result3x3_3 = game3x3.isSolvable(puzzleArray3x3_3, game3x3.gridSize);
    assertEquals(false, result3x3_3, "3x3 Unsolvable (1 inversion, 8 and 7 swapped, empty at end)");

    // Test cases for 4x4 grid (Even grid size)
    // Solvable if:
    //   (grid width is odd) and (number of inversions is even) OR
    //   (grid width is even) and ((blank is on an odd row from bottom) XOR (number of inversions is odd))
    // Simplified:
    //   (grid width is odd) and (inversions is even)
    //   (grid width is even) and (blank on even row from bottom AND inversions is odd)
    //   (grid width is even) and (blank on odd row from bottom AND inversions is even)
    const game4x4 = new PuzzleGame(); // Instantiate once for 4x4 tests
    game4x4.gridSize = 4;
    const totalPieces4x4 = game4x4.gridSize * game4x4.gridSize;

    // Test Case 4: 4x4 Solvable (empty on odd row from bottom (1st), 0 inversions)
    let puzzleArray4x4_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // 16 is empty
    game4x4.emptyIndex = 15; // Empty piece (16) is at index 15 (row 4, or 1st from bottom)
    let result4x4_1 = game4x4.isSolvable(puzzleArray4x4_1, game4x4.gridSize);
    assertEquals(true, result4x4_1, "4x4 Solvable (0 inversions, empty on 1st row from bottom)");
    
    // Test Case 5: 4x4 Solvable (empty on even row from bottom (2nd), odd inversions)
    // Base: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16 (empty at 15)
    // Move 15 to empty: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,15 (empty at 14, row 1 from bottom, 1 inv) -> Solvable by rule.
    // For this test, let's put empty at index 11 (value 16). This is row 3 (0-indexed), so 2nd row from bottom (even).
    // We need odd inversions.
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 13, 14, 12, 11] -> empty is 16 (at index 11)
    // Array for inversions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 13, 14, 12, 11]
    // Inversions: (15,13), (15,14), (15,12), (15,11) = 4
    //             (13,12), (13,11) = 2
    //             (14,12), (14,11) = 2
    //             (12,11) = 1. Total = 4+2+2+1 = 9 (odd).
    let puzzleArray4x4_2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 13, 14, 12, 11]; // 16 is empty
    game4x4.emptyIndex = 11; // Empty piece (16) is at index 11 (row 3, or 2nd from bottom)
    let result4x4_2 = game4x4.isSolvable(puzzleArray4x4_2, game4x4.gridSize);
    assertEquals(true, result4x4_2, "4x4 Solvable (9 inversions, empty on 2nd row from bottom)");

    // Test Case 6: 4x4 Unsolvable (empty on odd row from bottom (1st), 1 inversion)
    // Standard unsolvable: 1,2,3,4,5,6,7,8,9,10,11,12,13,15,14,16 (empty at 15)
    // Inversions for [1,2,3,4,5,6,7,8,9,10,11,12,13,15,14]: (15,14) = 1 (odd)
    // Empty is at index 15 (row 4, 1st from bottom - odd).
    // Odd row from bottom + odd inversions = Unsolvable.
    let puzzleArray4x4_3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 16]; // 16 is empty
    game4x4.emptyIndex = 15; // Empty piece (16) is at index 15
    let result4x4_3 = game4x4.isSolvable(puzzleArray4x4_3, game4x4.gridSize);
    assertEquals(false, result4x4_3, "4x4 Unsolvable (1 inversion, empty on 1st row from bottom)");
    
    // Test Case 7: 4x4 Unsolvable (empty on even row from bottom (2nd), even inversions)
    // Empty at index 11 (row 3, 2nd from bottom - even).
    // We need even inversions.
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 13, 14, 15, 12] -> empty is 16 (at index 11)
    // Array for inversions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 12]
    // Inversions: (13,12), (14,12), (15,12) = 3. This is odd.
    // Need even. Let's try: [1,2,3,4,5,6,7,8,9,10,12,16,11,13,14,15] (empty at 11)
    // Array: [1,2,3,4,5,6,7,8,9,10,12,11,13,14,15]
    // Inversions: (12,11) = 1. This is odd.
    // Let's use a known configuration or a simple one:
    // [1,2,3,4,5,6,7,8,10,9,11,16,13,14,15,12] (empty at 11)
    // Array: [1,2,3,4,5,6,7,8,10,9,11,13,14,15,12]
    // Inversions: (10,9)=1, (13,12)=1, (14,12)=1, (15,12)=1. Total = 4 (even).
    // Empty on even row from bottom (2nd) + even inversions (4) = Unsolvable.
    let puzzleArray4x4_4 = [1,2,3,4,5,6,7,8,10,9,11,16,13,14,15,12]; //16 is empty
    game4x4.emptyIndex = 11;
    let result4x4_4 = game4x4.isSolvable(puzzleArray4x4_4, game4x4.gridSize);
    assertEquals(false, result4x4_4, "4x4 Unsolvable (4 inversions, empty on 2nd row from bottom)");


    console.log("isSolvable Tests Complete.");
}

// This structure assumes PuzzleGame class is available in the global scope 
// when these tests are run (e.g. by including slideNumberGameScript.js first in an HTML page)
// For now, we just define the tests.
// To manually run in a browser console after loading slideNumberGameScript.js:
// runSlideNumberGameTests();
