import { app, BrowserWindow, Menu, ipcMain, TouchBarPopover } from 'electron';
import * as path from 'path';
import * as googleCal from './modules/googleCalendar/googleCalendar';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function createWindow (htmlPath? : any){
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    //fullscreen: true
    height: 600,
    width: 1200,
    webPreferences:{
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  if(!htmlPath) htmlPath = 'src/index.html'
  mainWindow.loadFile(htmlPath);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function(){

  var htmlPath = null
  const calendar = new googleCal.googleCalendar();
  if(!calendar.getCredentials()){
    htmlPath = 'src/modules/googleAuth/googleAuth.html'
  }
  // Autication passed

  // @TODO -> Check if config file is present

  // Show upcomming events
  var events = await calendar.listEvents(calendar.oAuth2Client)
  console.log(events)
  htmlPath = 'src/modules/googleConnectCal/googleConnect.html'

  createWindow(htmlPath)

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert Menu
  Menu.setApplicationMenu(mainMenu)
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add iTem'
      },
      {
        label: 'Clear iTem'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){ app.quit()}
      }
    ]
  }
]

ipcMain.on('item:name',function(e, item){

})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  app.quit(); // <-- BORRAR
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
