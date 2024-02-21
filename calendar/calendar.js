onload = function() {
    let calendar = document.getElementById('calendar');
    let date = document.getElementById('date');
    let month = document.getElementById('month');
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    date.oninput = function() {
        let targetDate = this.valueAsDate;
        if(!targetDate) {
            return;
        }
        month.innerText = `西暦${targetDate.getFullYear()}年　${targetDate.getMonth() + 1}月`;
        Array(...calendar.children).forEach(child => calendar.removeChild(child));
        let newTable = calendar.createTBody();
        let newRow = newTable.insertRow(0);
        for(let i = 0; i < 7; i++) {
            let newCell = document.createElement('th');
            newCell.innerText = days[i];
            newRow.appendChild(newCell);
        }
        let newDate = new Date(targetDate);
        newDate.setDate(1);
        newDate.setDate(1 - newDate.getDay());
        let lastDate = new Date(targetDate);
        lastDate.setDate(1);
        lastDate.setMonth(lastDate.getMonth() + 1);
        while(newDate < lastDate) {
            let newRow = newTable.insertRow(-1);
            for(let i = 0; i < 7; i++) {
                let newCell = newRow.insertCell(-1);
                newCell.innerText = newDate.getDate();
                if(newDate.getMonth() != targetDate.getMonth()) {
                    newCell.className = 'other-month';
                } else if(newDate.getDate() == targetDate.getDate()) {
                    newCell.style.backgroundColor = 'yellow';
                }
                newDate.setDate(newDate.getDate() + 1);
            }
        }
    };

    date.valueAsDate = new Date();
    date.oninput();
};

function prevYear() {
    let date = document.getElementById('date');
    let targetDate = date.valueAsDate;
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setFullYear(targetDate.getFullYear() - 1);
    targetDate.setDate(targetDate.getDate() - 1);
    date.valueAsDate = targetDate;
    date.oninput();
}

function prevMonth() {
    let date = document.getElementById('date');
    let targetDate = date.valueAsDate;
    let tmp = date.valueAsDate;
    tmp.setDate(1);
    tmp.setDate(0);
    if(targetDate.getDate() <= tmp.getDate()) {
        targetDate.setMonth(targetDate.getMonth() - 1);
    } else {
        targetDate = tmp;
    }
    date.valueAsDate = targetDate;
    date.oninput();
}

function nextMonth() {
    let date = document.getElementById('date');
    let targetDate = date.valueAsDate;
    let tmp = date.valueAsDate;
    tmp.setDate(1);
    tmp.setMonth(tmp.getMonth() + 2);
    tmp.setDate(0);
    if(targetDate.getDate() <= tmp.getDate()) {
        targetDate.setMonth(targetDate.getMonth() + 1);
    } else {
        targetDate = tmp;
    }
    date.valueAsDate = targetDate;
    date.oninput();
}

function nextYear() {
    let date = document.getElementById('date');
    let targetDate = date.valueAsDate;
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setFullYear(targetDate.getFullYear() + 1);
    targetDate.setDate(targetDate.getDate() - 1);
    date.valueAsDate = targetDate;
    date.oninput();
}