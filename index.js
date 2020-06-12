const { app, BrowserWindow ,Menu} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
let score = 0;
let speedWindow
let helpWindow
let inforWindow
//Menu
const menu = [
    {
        label: 'Rank',
        submenu : [
            {
                label: 'Infor Your Rank',
                accelerator: 'Ctrl+N',
                click: () => {
                 inforWindow = new BrowserWindow({width:300, height: 300,
                   webPreferences: {nodeIntegration: true}
                 })
                   inforWindow.loadFile('Rank.html')
                 }   
            }
        ]
    },
   {
       label: 'Speed',
       submenu : [
           {
               label: 'Choose speed',
               accelerator: 'Ctrl+N',
               click: () => {
                speedWindow = new BrowserWindow({width:300, height: 300,
                  webPreferences: {nodeIntegration: true}
                })
                  speedWindow.loadFile('Speed.html')
                }   
           }
       ]
   },
   {
       label: 'Help',
       accelerator: 'Ctrl+H',
       click: () => {
        helpWindow = new BrowserWindow({width:300, height: 300,
          webPreferences: {nodeIntegration: true}
        })
          helpWindow.loadFile('Help.html')
        }   
   },
   {
    label: 'View',
    submenu: [
        {
            label:'Reload',
            accelerator: 'Ctrl+R',
            click: () => {
                BrowserWindow.getFocusedWindow().reload();
            }
        },
        {
            label: 'Toggle DevTools',
            accelerator: 'Alt+Ctrl+I',
            role: 'toggledevtools'
        }
    ]
   },
   {
       label: 'Exit',
       accelerator: 'Ctrl+Q',
       role: 'close'
   }
]
//Ham tao cua so window
function createWindow() {
    const win = new BrowserWindow({
        width: 700,
        height: 740,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
}

    ipc.on('client-send-increase-score', function(event, arg){
        score++;
        event.sender.send("main-send-increase-score", score);
    });

    ipc.on('client-send-resert', function(event, arg) {
        score = 0;
        event.sender.send('main-send-resert')
    });

    ipc.on('client-send-change-speed', function(event, arg){
        score++;
        event.sender.send("main-send-change-speed", arg);
    });


app.on('ready', () => {
    const mainMenu = Menu.buildFromTemplate(menu);
    createWindow();
    Menu.setApplicationMenu(mainMenu);
});

// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static(__dirname + '/public/'));

// app.get('/', (req, res) => res.sendFile('index.html'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));