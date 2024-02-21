onload = function() {
    let canvas, context, pi, r, timeDiff, width;

    function displayTime() {
        let time = document.getElementById('time');
        let unix = document.getElementById('unix');
        let date = new Date();
        time.innerText = date.getFullYear() + '年';
        time.innerText += date.getMonth() + 1 + '月';
        time.innerText += date.getDate() + '日';
        time.innerText += ' ' + '日月火水木金土' [date.getDay()] + '曜日';
        time.innerText += '　' + date.getHours().toString().padStart(2, 0);
        time.innerText += ':' + date.getMinutes().toString().padStart(2, 0);
        time.innerText += ':' + date.getSeconds().toString().padStart(2, 0);
        time.innerText += '.' + date.getMilliseconds().toString().padStart(3, 0);
        timeDiff = -date.getTimezoneOffset();
        let timeZone = 'UTC';
        if(timeDiff < 0) {
            timeZone += Math.ceil(timeDiff / 60);
        } else if(0 < timeDiff) {
            timeZone += '+' + Math.floor(timeDiff / 60);
        }
        if(timeDiff % 60) {
            timeZone += ':' + Math.abs(timeDiff) % 60;
        }
        time.innerText += ' (' + timeZone + ')';
        unix.innerText = Math.floor(date.getTime() / 1000).toLocaleString();
        unix.innerText += '.' + date.getMilliseconds().toString().padStart(3, 0);
    }

    function makeCanvas() {
        canvas = document.getElementById('clock');
        let ratio = window.devicePixelRatio;
        let em = parseInt(getComputedStyle(document.getElementById('time')).height);
        width = Math.min(window.innerWidth, window.innerHeight);
        canvas.width = width * ratio;
        canvas.height = width * ratio;
        context = canvas.getContext('2d');
        context.scale(ratio, ratio);
        context.strokeStyle = context.fillStyle = 'black';
        context.font = width / 20 + 'px "Yu Mincho", "Hiragino Mincho Pro", serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.translate(width / 2, width / 2);
    }

    function drawClock() {
        context.fillStyle = 'white';
        context.fillRect(-width / 2, -width / 2, width, width);
        context.fillStyle = 'black';
        r = width / 2.1;
        pi = Math.PI;
        context.beginPath();
        context.arc(0, 0, r / 25, 0, 7);
        context.fill();
        context.beginPath();
        context.lineWidth = width / 400;
        context.arc(0, 0, r, 0, 7);
        for(let i = 0; i < 12; i++) {
            let s = 'ⅫⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪ' [i];
            context.fillText(s, r * 0.8 * Math.cos(pi / 6 * (9 + i)), r * 0.8 * Math.sin(pi / 6 * (9 + i)));
            context.moveTo(r * Math.cos(pi / 6 * i), r * Math.sin(pi / 6 * i));
            context.lineTo(r * 0.9 * Math.cos(pi / 6 * i), r * 0.9 * Math.sin(pi / 6 * i));
        }
        context.stroke();
        context.beginPath();
        context.lineWidth = width / 800;
        for(let i = 0; i < 60; i++) {
            context.moveTo(r * Math.cos(pi / 30 * i), r * Math.sin(pi / 30 * i));
            context.lineTo(r * 0.95 * Math.cos(pi / 30 * i), r * 0.95 * Math.sin(pi / 30 * i));
        }
        context.stroke();
        context.beginPath();
        context.lineWidth = width / 1600;
        for(let i = 0; i < 120; i++) {
            context.moveTo(r * Math.cos(pi / 60 * i), r * Math.sin(pi / 60 * i));
            context.lineTo(r * 0.975 * Math.cos(pi / 60 * i), r * 0.975 * Math.sin(pi / 60 * i));
        }
        context.stroke();
        canvas.style.backgroundImage = `url(${canvas.toDataURL()})`;
        canvas.style.backgroundSize = '100%';
    }

    function draw() {
        context.clearRect(-width / 2, -width / 2, width, width);
        let now = (Date.now() + timeDiff * 60000) % 86400000 / 1000;
        let x, y;
        context.beginPath();
        context.lineWidth = width / 80;
        context.moveTo(0, 0);
        context.lineTo(x = r * 0.4 * Math.cos(pi / 6 * (9 + now / 3600)), y = r * 0.4 * Math.sin(pi / 6 * (9 + now / 3600)));
        context.stroke();
        context.beginPath();
        context.arc(x, y, width / 160, 0, 7);
        context.fill();
        context.beginPath();
        context.lineWidth = width / 160;
        context.moveTo(0, 0);
        context.lineTo(x = r * 0.6 * Math.cos(pi / 30 * (45 + now / 60)), y = r * 0.6 * Math.sin(pi / 30 * (45 + now / 60)));
        context.stroke();
        context.beginPath();
        context.arc(x, y, width / 300, 0, 7);
        context.fill();
        context.beginPath();
        context.lineWidth = width / 800;
        context.moveTo(0, 0);
        context.lineTo(r * 0.8 * Math.cos(pi / 30 * (45 + now)), r * 0.8 * Math.sin(pi / 30 * (45 + now)));
        context.stroke();
        displayTime();
    }

    makeCanvas();
    setInterval(draw, 25, drawClock());
};