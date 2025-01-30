function solve(sudoku, size) {
    if(sudoku.length != size ** 2) {
        throw new Error('improper input size');
    }
    for(let i = 0; i < size ** 2; i++) {
        if(sudoku[i].length != size ** 2) {
            throw new Error('improper input size');
        }
    }
    let used = [];
    for(let i = 0; i < size ** 2; i++) {
        for(let j = 0; j < size ** 2; j++) {
            let cell = sudoku[i][j];
            if(!used.includes(cell) && cell != '') {
                used.push(cell);
            }
        }
    }
    if(size ** 2 < used.length) {
        throw new Error('too many kinds of numbers');
    } else if(used.length < size ** 2 - 1) {
        throw new Error('too few kinds of numbers');
    }else if(used.length == size ** 2 - 1){
        for(let i = 1; i <= 10; i++){
            if(!used.includes(i) && !used.includes(i.toString())){
                used.push((i % 10).toString());
                break;
            }
        }
    }
    let err = findInconsistency(sudoku, size)
    if(err) {
        throw new Error(`inconsistent input; (${err[0]},${err[1]})-element, ${err[2]}`);
    }
    let unavailable = getUnavailableNumbers(sudoku, size);
    let solution = findOneSolution(sudoku, size, used);
    if(solution == null){
        throw new Error('no solutions exist');
    }
    for(let i = 0; i < 4; i++) {
        if(solution.toString() != findOneSolution(sudoku, size, used).toString()) {
            throw new Error('multiple solutions exist');
        }
    }
    return solution;
}

function findInconsistency(sudoku, size) {
    for(let i = 0; i < size ** 2; i++) {
        for(let j = 0; j < size ** 2; j++) {
            if(sudoku[i][j] == '') {
                continue;
            }
            for(let k = 0; k < size ** 2; k++) {
                let xBlock = Math.floor(i / size) * size + Math.floor(k / size);
                let yBlock = Math.floor(j / size) * size + (k % size);
                if(j != k && sudoku[i][j] == sudoku[i][k]) {
                    return [i, j, 'row'];
                }else if(i != k && sudoku[i][j] == sudoku[k][j]){
                    return [i, j, 'column'];
                }else if(!(i == xBlock && j == yBlock) && sudoku[i][j] == sudoku[xBlock][yBlock]){
                    return [i, j, 'block'];
                }
            }
        }
    }
    return false;
}

function getUnavailableNumbers(sudoku, size) {
    let result = [];
    for(let i = 0; i < size ** 2; i++) {
        result.push([]);
        for(let j = 0; j < size ** 2; j++) {
            result[i].push(new Set());
        }
    }
    for(let i = 0; i < size ** 2; i++) {
        let blockIndexRow = Math.floor(i / size) * size;
        let blockIndexColumn = (i % size) * size;
        for(let j = 0; j < size ** 2; j++) {
            if(sudoku[i][j] != '') {
                for(let k = 0; k < size ** 2; k++) {
                    result[i][k].add(sudoku[i][j]);
                }
            }
            if(sudoku[j][i] != '') {
                for(let k = 0; k < size ** 2; k++) {
                    result[k][i].add(sudoku[j][i]);
                }
            }
            let row = blockIndexRow + Math.floor(j / size);
            let col = blockIndexColumn + (j % size);
            if(sudoku[row][col] != '') {
                for(let k = 0; k < size ** 2; k++) {
                    let rowFor = blockIndexRow + Math.floor(k / size);
                    let colFor = blockIndexColumn + (k % size);
                    result[rowFor][colFor].add(sudoku[row][col]);
                }
            }
        }
    }
    return result;
}

function findOneSolution(sudoku, size, used) {
    let iNext, jNext, maximumUnavailable = -1;
    let unavailable = getUnavailableNumbers(sudoku, size);
    for(let i = 0; i < size ** 2; i++) {
        for(let j = 0; j < size ** 2; j++) {
            if(sudoku[i][j] == '' && maximumUnavailable < unavailable[i][j].size) {
                [iNext, jNext] = [i, j];
                maximumUnavailable = unavailable[i][j].size;
            }
        }
    }
    if(maximumUnavailable == size ** 2) {
        return null;
    }else if(iNext === undefined) {
        return sudoku;
    }
    let available = used.filter(x => !unavailable[iNext][jNext].has(x));
    available.sort(() => Math.random() * 2 - 1);
    for(let i = 0; i < available.length; i++) {
        let sudokuCopy = sudoku.map(row => Array.from(row));
        sudokuCopy[iNext][jNext] = available[i];
        let solution = findOneSolution(sudokuCopy, size, used);
        if(solution != null) {
            return solution;
        }
    }
}

function generateProblem(size) {
    let answer = Array(size ** 2).fill('');
    answer = answer.map(row => Array(size ** 2).fill(''));
    used = Array.from(Array(size ** 2).keys()).map(val => val + 1);
    answer = findOneSolution(answer, size, used);
    let arr = answer.map(row => Array.from(row));
    let coordinates = [];
    for(let i = 0; i < size ** 2; i++){
        for(let j = 0; j < size ** 2; j++){
            if(Math.random() < 1 / 2) {
                arr[i][j] = '';
            } else {
                coordinates.push([i, j]);
            }
        }
    }
    for(let i = 0; i < 5; i++) {
        let sol = findOneSolution(arr, size, used);
        if(answer.toString() != sol.toString()) {
            return generateProblem(size);
        }
    }
    coordinates.sort(() => Math.random() * 2 - 1);
    let count = 0;
    while(coordinates.length) {
        let [x, y] = coordinates[0];
        coordinates = coordinates.slice(1);
        arr[x][y] = '';
        let flag = true;
        for(let i = 0; i < 5; i++) {
            let sol = findOneSolution(arr, size, used);
            if(answer.toString() != sol.toString()) {
                flag = false;
                break;
            }
        }
        if(!flag) {
            arr[x][y] = answer[x][y];
            coordinates.push([x, y]);
            count++;
        }else{
            coordinates.sort(() => Math.random() * 2 - 1);
            count = 0;
        }
        if(coordinates.length == count){
            break;
        }
    }
    for(let i = 0; i < 10; i++) {
        let sol = findOneSolution(arr, size, used);
        if(answer.toString() != sol.toString()) {
            return generateProblem(size);
        }
    }
    return {problem: arr, answer: answer};
}