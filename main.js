const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
//Used to open index.html
const url = require('url');

//Set ENV
// process.env.NODE_ENV = 'production';

//Init widow
let mainWindow;
let addWindow;

function createWindow() {
  //Create browser window
  mainWindow = new BrowserWindow({width: 600, height: 450});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  console.log('App started!');
  mainWindow.toggleDevTools();
  //Quit App when closed
  mainWindow.on('closed', function(){
    app.quit();
  })

  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert menu
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => {
    console.log('Goodbye!')
    win = null;
  });
}

//Run createWindow function
app.on('ready', createWindow);

//Handle popUpWindow
function popUpWindow() {
  addWindow = new BrowserWindow({width: 400, height: 400, title: 'Add data!'});
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'adddata.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Garbage Collection Handle
  addWindow.on('close', function(){
    addWindow = null;
  })
}

//Quit when all windows are closed
app.on('window-all-closed', () => {
  if(process.platfrom !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

//Catch Added data
ipcMain.on('data:add', function(e, data){
  // console.log(data);
  mainWindow.webContents.send('data:add', data);
  addWindow.close();
})

//Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add data',
        accelerator: process.platform == 'darwin' ? 'command+A' : 'Ctrl+A',
        click(){
          popUpWindow();
        }
      },
      {
        label: 'Clear data',
        accelerator: process.platform == 'darwin' ? 'command+X' : 'Ctrl+X',
        click(){
          mainWindow.webContents.send('data:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Paste',
        accelerator: process.platform == 'darwin' ? 'Command+V' : 'Ctrl+V',
        selector: 'paste:'
      },
      {
        label: 'Undo',
        accelerator: process.platform == 'darwin' ? 'Command+Z' : 'Ctrl+Z',
        selector: 'undo:'
      }
    ]
  }
];
//If Mac add empty object to Menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

//Add developer tools if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'command+I' : 'Ctrl+I',
        click(data, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
