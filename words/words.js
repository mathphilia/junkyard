let url = 'https://gist.githubusercontent.com/wchargin/8927565/raw/d9783627c731268fb2935a731a618aa8e95cf465/words';
let words = [];
let request = new XMLHttpRequest();
request.onload = function(){
    words = this.responseText.split('\n');
};
request.open('GET', url);
request.send();

function search(reg){
    let number = document.getElementById('number');
    let result = document.getElementById('result');
    let hit = words.filter(w => reg.test(w));
    let count = hit.length;
    if(count == 0){
        number.innerHTML = 'no words are';
    }else if(count == 1){
        number.innerHTML = '1 word is';
    }else{
        number.innerHTML = count.toLocaleString() + ' words are';
    }
    number.innerHTML += ` found in a search using <a href="${url}">this word list</a>.`;
    result.innerHTML = hit.join(' ');
}

onload = function()  {
    let input = document.getElementById('input');
    let submit = document.getElementById('submit');
    input.focus();

    input.onchange = submit.onclick = function(){
        let reg = new RegExp(input.value, 'g');
        search(reg);
    };
};