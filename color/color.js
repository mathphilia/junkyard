onload = function() {
    document.getElementById('color').oninput = function() {
        let code = document.getElementById('color-code').innerHTML = this.value;
        document.getElementById('RGB').innerHTML = 'rgb(';
        document.getElementById('RGB').innerHTML += parseInt(code.slice(1, 3), 16) + ', ';
        document.getElementById('RGB').innerHTML += parseInt(code.slice(3, 5), 16) + ', ';
        document.getElementById('RGB').innerHTML += parseInt(code.slice(5, 7), 16) + ')';
    };
};