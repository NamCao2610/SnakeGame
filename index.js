const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
let soccer = 0;
function createWindow() {
    const win = new BrowserWindow({
        width: 740,
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

    ipc.on('client-send-increase-soccer', function(event, arg){
        soccer++;
        event.sender.send("main-send-increase-soccer", soccer);
    });

    ipc.on('client-send-resert', function(event, arg) {
        soccer = 0;
        event.sender.send('main-send-resert')
    });

    ipc.on('client-send-change-speed', function(event, arg){
        soccer++;
        event.sender.send("main-send-change-speed", arg);
    });


app.on('ready', createWindow);

// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static(__dirname + '/public/'));

// app.get('/', (req, res) => res.sendFile('index.html'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));