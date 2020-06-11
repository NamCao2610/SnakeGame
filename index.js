const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
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
app.on('ready', createWindow);

// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.static(__dirname + '/public/'));

// app.get('/', (req, res) => res.sendFile('index.html'));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));