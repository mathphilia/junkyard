onload = function() {
    document.getElementById('html').oninput = function() {
        document.getElementById('container').innerHTML = this.value;
    };

    document.getElementById('run').onclick = function() {
        document.getElementById('container').innerHTML = this.value;
        eval(document.getElementById('script').value);
    };
};