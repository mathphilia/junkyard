var canvas, context;
onload = function() {
    canvas = document.getElementById('board');
    context = canvas.getContext('2d');
    document.getElementById('run').onclick = function() {
        let container = document.getElementById('container');
        container.removeChild(canvas);
        canvas = document.createElement('canvas');
        container.appendChild(canvas);
        context = canvas.getContext('2d');
        eval(document.getElementById('script').value);
    }
}