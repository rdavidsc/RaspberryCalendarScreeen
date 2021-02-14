import { app, BrowserWindow, Menu, ipcMain, TouchBarPopover } from 'electron';
import * as path from 'path';
import * as googleCal from './modules/googleCalendar/googleCalendar'
import * as fs from 'fs'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

var mainWindow: BrowserWindow
const calendar = new googleCal.googleCalendar();


/**
 * Create a new window usin a html template
 * @param htmlTemplatePath Optional html template 
 */
async function createWindow (htmlTemplatePath? : any){
  // Create the browser window.
  const window = new BrowserWindow({
    //fullscreen: true
    height: 600,
    width: 1200,
    webPreferences:{
      nodeIntegration: true
    }
  })

  // and load the index.html of the app or the html template given.
  if(!htmlTemplatePath) htmlTemplatePath = 'src/index.html'
  try{
    await window.loadFile(htmlTemplatePath);
    // Open the DevTools.
    window.webContents.openDevTools();
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert Menu
    Menu.setApplicationMenu(mainMenu)
  } catch (err){
    console.log(err)
  }
  return window
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function(){

  mainWindow = await createWindow()

  if(!calendar.getCredentials()){
    // @TODO --> Render error message
    mainWindow.webContents.send('app:router', fs.readFileSync('src/pages/error/error.html', 'utf-8'))
    mainWindow.webContents.send('id:contents', [ 
      { id: 'errorMessage', content: calendar.error.message }, 
      { id: 'errorBody', content: calendar.error.body }
    ])
  } else {
    // oAuth2 ok

    // @TODO -> Check if config file is present

    // @TODO -> if no config file present --> Select calendar

    // Everything is ok, then Show upcomming events
    getUpcomingEvents()
  }
  
});

/**
 * 
 */
async function getUpcomingEvents(){
  var events = await calendar.listEvents(calendar.oAuth2Client)
  console.log(events)
  // Now pass the page will be render render
  mainWindow.webContents.send('app:router', fs.readFileSync('src/pages/upcomingEvents/upcomingEvents.html', 'utf-8'))
  mainWindow.webContents.send('ul:elements', { id: 'events', elements: events, template: fs.readFileSync('src/pages/upcomingEvents/event.html', 'utf-8') }) // @TODO <-- Fill values in template
}

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
