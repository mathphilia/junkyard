onload = function() {
    let sudoku = document.getElementById('sudoku');
    let solveBtn = document.getElementById('solve-btn');
    let undoBtn = document.getElementById('undo-btn');
    let resetBtn = document.getElementById('reset-btn');
    let randomBtn = document.getElementById('random-btn');
    let copyBtn = document.getElementById('copy-image');
    let JSONInput = document.getElementById('JSON-input');
    let toJSON = document.getElementById('to-JSON');
    let toBoard = document.getElementById('to-board');
    let sudokuStyle = document.getElementById('sudoku-style');

    let copyCanvas = document.createElement('canvas');
    copyCanvas.width = copyCanvas.height = 1024;
    let copyContext = copyCanvas.getContext('2d');
    copyContext.textAlign = 'center';
    copyContext.textBaseline = 'middle';
    copyContext.translate(32, 32);

    let status = "solve";
    let size = 3;
    let inputArray = [];
    let sudokuLog = [];

    function addLog(arr) {
        sudokuLog.push(arr);
        if(1 < sudokuLog.length) {
            undoBtn.disabled = false;
        }
    }

    function readSudoku() {
        result = [];
        for(let i = 0; i < size ** 2; i++) {
            result.push([]);
            for(let j = 0; j < size ** 2; j++) {
                let cell = inputArray[i * size ** 2 + j].value.trim();
                result[i].push(cell);
            }
        }
        return result;
    }

    function writeSudoku(arr) {
        let arrSize = Math.round(arr.length ** 0.5);
        if(arr.length != arrSize ** 2) {
            throw new Error('improper input');
        }
        for(let i = 0; i < arrSize ** 2; i++) {
            if(arr[i].length != arrSize ** 2) {
                throw new Error('improper input');
            }
        }
        if(arrSize < 2 || 3 < arrSize) {
            throw new Error('improper size (size must be 2⁴ or 3⁴)');
        }
        if(size != arrSize) {
            document.getElementsByName('sudoku-size')[arrSize - 2].checked = true;
            size = arrSize;
            resetBtn.onclick();
        }
        for(let i = 0; i < arrSize ** 2; i++) {
            for(let j = 0; j < arrSize ** 2; j++) {
                inputArray[i * arrSize ** 2 + j].value = arr[i][j];
            }
        }
        addLog(arr);
    }

    solveBtn.onclick = function() {
        this.disabled = true;
        setTimeout(() => {
            let problem = readSudoku();
            try {
                writeSudoku(solve(problem, size));
            } catch (err) {
                alert(err.message);
            }
            this.disabled = false;
        }, 1);
    };

    undoBtn.onclick = function() {
        sudokuLog.pop();
        writeSudoku(sudokuLog.pop());
        if(sudokuLog.length <= 1) {
            undoBtn.disabled = true;
        }
    };

    resetBtn.onclick = function() {
        sudoku.innerHTML = '';
        let inputElem;
        inputArray = Array(size ** 4);
        for(let i = 0; i < size ** 2; i++) {
            let sudokuBlock = document.createElement('div');
            sudokuBlock.className = 'sudoku-block';
            sudoku.appendChild(sudokuBlock);
            for(let j = 0; j < size ** 2; j++) {
                inputElem = document.createElement('input');
                sudokuBlock.append(inputElem);
                inputElem.maxLength = (size ** 2).toString().length;
                inputElem.oninput = function() {
                    addLog(readSudoku());
                };
                let index = (i + (size ** 2 - size) * Math.floor(i / size)) * size;
                index += (j + (size ** 2 - size) * Math.floor(j / size));
                inputArray[index] = inputElem;
            }
        }
        sudokuStyle.innerHTML = `div#sudoku {\n    grid-template-columns: repeat(${size}, calc(99%/${size}));\n    grid-template-rows: repeat(${size}, calc(99%/${size}));\n    column-gap: ${1 / (size - 1)}%;\n    row-gap: ${1 / (size - 1)}%;\n}\n\ndiv#sudoku div.sudoku-block {\n    grid-template-columns: repeat(${size}, calc(100%/${size}));\n    grid-template-rows: repeat(${size}, calc(100%/${size}));\n}`;
        let fontSize = getComputedStyle(inputElem).height;
        fontSize = Number(fontSize.slice(0, -2)) * 4 / 5 + 'px';
        sudokuStyle.innerHTML += `\n\ndiv#sudoku input {\n    font-size: ${fontSize};\n}`;
    };

    randomBtn.onclick = function() {
        this.disabled = true;
        this.innerText = 'please wait…';
        setTimeout(() => {
            writeSudoku(generateProblem(size).problem);
            this.disabled = false;
            this.innerText = 'random';
        }, 1);
    };

    copyBtn.onclick = function() {
        copyContext.fillStyle = 'white';
        copyContext.fillRect(-32, -32, copyCanvas.width, copyCanvas.height);
        copyContext.fillStyle = 'black';
        copyContext.lineWidth = 10;
        copyContext.strokeRect(0, 0, 960, 960);
        for(let i = 1; i < size ** 2; i++) {
            if(i % size == 0) {
                copyContext.lineWidth = 10;
            } else {
                copyContext.lineWidth = 3;
            }
            copyContext.beginPath();
            copyContext.moveTo(i * 960 / size ** 2, 0);
            copyContext.lineTo(i * 960 / size ** 2, 960);
            copyContext.moveTo(0, i * 960 / size ** 2);
            copyContext.lineTo(960, i * 960 / size ** 2);
            copyContext.stroke();
        }
        copyContext.font = 720 / size ** 2 + 'px Consolas';
        let arr = readSudoku();
        for(let i = 0; i < size ** 2; i++) {
            for(let j = 0; j < size ** 2; j++) {
                let x = ((2 * i + 1) * 480) / size ** 2;
                let y = ((2 * j + 1) * 480 + 72) / size ** 2;
                copyContext.fillText(arr[j][i], x, y);
            }
        }
        copyCanvas.toBlob(blob => {
            let data = {
                [blob.type]: blob
            };
            navigator.clipboard.write([new ClipboardItem(data)]);
        });
        this.innerText = 'copied!';
        setTimeout(() => {
            this.innerText = 'copy image';
        }, 1000);
    };

    for(let btn of document.getElementsByName('sudoku-size')) {
        btn.onchange = function() {
            size = Number(this.value);
            resetBtn.onclick();
        };
        btn.checked = true;
    }

    toJSON.onclick = function() {
        let outputValue = JSON.stringify(readSudoku());
        JSONInput.value = outputValue;
        let length = outputValue.length;
        JSONInput.focus();
        JSONInput.setSelectionRange(0, length);
    };

    toBoard.onclick = function() {
        let inputValue = JSONInput.value;
        writeSudoku(JSON.parse(inputValue));
    };

    onkeydown = function() {
        if(!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            return;
        }
        let focused = document.activeElement;
        let index = inputArray.indexOf(focused);
        if(index == -1) {
            return;
        }
        let row = Math.floor(index / size ** 2);
        let col = index % size ** 2;
        switch(event.code) {
            case 'ArrowUp':
                row = (row - 1 + size ** 2) % size ** 2;
                break;
            case 'ArrowDown':
                row = (row + 1 + size ** 2) % size ** 2;
                break;
            case 'ArrowLeft':
                col = (col - 1 + size ** 2) % size ** 2;
                break;
            case 'ArrowRight':
                col = (col + 1 + size ** 2) % size ** 2;
                break;
        }
        inputArray[row * size ** 2 + col].focus();
    };

    onkeyup = function() {
        if(event.code == 'Enter' && !solveBtn.disabled) {
            solveBtn.onclick();
        }
        let focused = document.activeElement;
        if(!inputArray.includes(focused)) {
            return;
        }
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
            let length = focused.value.length;
            focused.setSelectionRange(length, length);
        }
    };

    resetBtn.onclick();
    writeSudoku(readSudoku());
    inputArray[0].focus();
};