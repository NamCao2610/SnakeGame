const { Data } = require('phaser');

const ipc = require('electron').ipcRenderer;
let p = document.getElementById('vuong');
let mytable = document.getElementById('mytable');
let myspeed = document.getElementById('myspeed');

myspeed.addEventListener( 'change', (e) => {
    ipc.send('client-send-change-speed', -(e.target.value));
    speed = -e.target.value;
    console.log(-e.target.value);
})

let soccer = 0;

let hightSoccer = [];

let speed = 500;

ipc.on('main-send-increase-soccer', function(event, arg){
    soccer++;
    if(soccer == 10 || soccer == 20 || soccer == 30 || soccer == 40 ){
        if(speed !== 100){
            speed += 100;
            ipc.send('client-send-change-speed', speed);
        }
    }
    p.innerHTML = `Your soccer: ${soccer}`
});

ipc.on('main-send-resert',function(event, arg){
    changeHightSoccer();
    mytable.innerHTML = `
    <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">Hạng</th>
        <th scope="col">Soccer</th>
        <th scope="col">Id</th>
      </tr>
    </thead>
    <tbody>
        ${handleSoccer()}
    </tbody>
    </table>
    `
    soccer = 0;
    p.innerHTML = `Your soccer: ${soccer}`
});


function changeHightSoccer() {
   
    hightSoccer.push({id: + Date.now().toString(), soccer: soccer});

    hightSoccer.sort( (a,b ) => {
        return -(a.soccer - b.soccer);
    });

    if(hightSoccer.length > 3) {
        hightSoccer.splice(2, (hightSoccer.length - 3));
    }

}


function handleSoccer() {
    let elm = '';
    elm = hightSoccer.map( (item, index) => {
        return ` <tr>
        <th scope="row">${index + 1}</th>
        <td>${item.soccer}</td>
        <td>${item.id}</td>
      </tr>`
    });

    return elm;
}



