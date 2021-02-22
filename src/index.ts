import { app, BrowserWindow, Menu, ipcMain, TouchBarPopover } from 'electron';
//import * as path from 'path';
import * as googleCal from './modules/googleCalendar/googleCalendar'
import * as upcomingEvents from './modules/upcomingEvents/upcomingEvents'
import * as fs from 'fs'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

/**
 * Main vars and constants
 */
let mainWindow: BrowserWindow
let minCount = 0
let eventsList: any
const calendar = new googleCal.googleCalendar();
const eventsHandler = new upcomingEvents.upcomingEvents();


/**
 * Create a new window usin a html template
 * @param htmlTemplatePath Optional html template 
 */
async function createWindow (layout? : any){
  // Create the browser window.
  const window = new BrowserWindow({
    fullscreen: true,
    //height: 600,
    //width: 1200,
    webPreferences:{
      nodeIntegration: true
    }
  })

  // and load the layout of the app or the html given.
  if(!layout) layout = 'src/layouts/app.html'
  try{
    await window.loadFile(layout);
    // Open the DevTools.
    // window.webContents.openDevTools();
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
    // Render error message
    mainWindow.webContents.send('app:router', fs.readFileSync('src/layouts/error.html', 'utf-8'))
    mainWindow.webContents.send('id:contents', [ 
      { id: 'errorMessage', content: calendar.error.message }, 
      { id: 'errorBody', content: calendar.error.body }
    ])
  } else {
    // oAuth2 ok

    // @TODO -> Check if config file is present

    // @TODO -> if no config file present --> Select calendar

    // Everything is ok, then go to main loop. 
    mainLoop()
  }
  
});


function mainLoop(){

  // Set hour in clock

  // Every 5 min: Show upcomming events
  getUpcomingEvents();


  setTimeout(() => {
    mainLoop();
  }, 30000)
}


/**
 * Get upcoming events from Google Calendar and wrap them in the HML template
 */
async function getUpcomingEvents(){

  
  if(!eventsList) {
    // Get event list synchronously the first time
    eventsList = await calendar.listEvents(calendar.oAuth2Client) // @TODO <-- Catch conetion error
  } else {
    // Get new event list every five minutes
    minCount += 1
    if( minCount > 10 ){
      minCount = 0
      eventsList = await calendar.listEvents(calendar.oAuth2Client) // @TODO <-- Catch conetion error
    }
  }

  // Now pass the page will be render render
  console.log(eventsList[0].summary)
  mainWindow.webContents.send('app:router', eventsHandler.generateSccreen(eventsList), 'utf-8')
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
