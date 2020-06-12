const { Data } = require('phaser');

const ipc = require('electron').ipcRenderer;
let p = document.getElementById('vuong');
let mytable = document.getElementById('mytable');
let myspeed = document.getElementById('myspeed');

let myselect = document.getElementById('myselect');

myselect.addEventListener('click', e => {
    ipc.send('main-send-change-speed', (e.target.value));
})


myspeed.addEventListener( 'change', (e) => {
    ipc.send('main-send-change-speed', -(e.target.value));
    speed = -e.target.value;
    console.log(-e.target.value);
});

let score = 0;

let highScore = [];

let speed = 500;

ipc.on('main-send-increase-score', function(event, arg){
    score++;
    if(score == 10 || score == 20 || score == 30 || score == 40 ){
        if(speed !== 100){
            speed -= 100;
            ipc.send('client-send-change-speed', speed);
        }
    }
    p.innerHTML = `Your score: ${score}`
});

ipc.on('main-send-resert',function(event, arg){
    changeHighScore();
    mytable.innerHTML = `
    <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">Hạng</th>
        <th scope="col">Score</th>
        <th scope="col">Id</th>
      </tr>
    </thead>
    <tbody>
        ${handleScore()}
    </tbody>
    </table>
    `
    score = 0;
    p.innerHTML = `Your score: ${score}`
});


function changeHighScore() {
   
    highScore.push({id: + Date.now().toString(), score: score});

    highScore.sort( (a,b ) => {
        return -(a.score - b.score);
    });

    if(highScore.length > 3) {
        highScore.splice(2, (highScore.length - 3));
    }

}


function handleScore() {
    let elm = '';
    elm = highScore.map( (item, index) => {
        return ` <tr>
        <th scope="row">${index + 1}</th>
        <td>${item.score}</td>
        <td>${item.id}</td>
      </tr>`
    });

    return elm;
}



