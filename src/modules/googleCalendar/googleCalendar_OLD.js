const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


export class googleCalendar {
}

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'src/modules/googleCalendar/token.json';

var credentials;
var token;
export var oAuth2Client;
export var error;





export function getCredentials(){
  try{
    credentials = JSON.parse(fs.readFileSync('src/modules/googleCalendar/credentials.json','utf-8'));
    if(!credentials.installed){
      error = "Error: Bad credentials";
      return false;
    }
    return authorize();
  }
  catch (err) {
    error = err;
    if (err.code === 'ENOENT'){
      console.log("Cant find file:")
      console.table(err)
      // @TODO --> Show screen App Error
    } else {
      console.log("Error reading file.")
      console.table(err)
      // @TODO --> Show screen App Error
    }
    return false;
  }

  /*
  fs.readFile('src/modules/googleCalendar/credentials.json','utf-8',(err, dataFromFile) =>{
    console.log(JSON.parse(dataFromFile).installed);
    if (err){
      if (err.code === 'ENOENT'){
        console.log("Cant find file:")
        console.table(err)
        // @TODO --> Show screen App Error
      } else {
        console.log("Error reading file.")
        console.table(err)
        throw err
        // @TODO --> Show screen App Error
      }
    } else {
      credentials = JSON.parse(dataFromFile);
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]); //const oAuth2Client = 
    
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client); // , callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        //callback(oAuth2Client);
      });

      console.log("Listo por el momento");

    }
  });

*/

}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
export function authorize(){
  try{
    token = fs.readFileSync(TOKEN_PATH);
    // Token stored in file is valid, prepare oAuth Client
    oAuth2Client.setCredentials(JSON.parse(token));
    return true;
  } catch (err) {
    return false;
  }
}


/*
var checkCal = function(){
  // Load client secrets from a local file.
  fs.readFile('./credentials.json', (err, content) => {
    if (err){
      console.log('Error loading client secret file:', err);
      return false;
    } 
    // Authorize a client with credentials, then call the Google Calendar API.
    return authorize(JSON.parse(content), listEvents);
  });
}*/

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client); // , callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}*/


function getAccessTokenURL(oAuth2Client) { //, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  return authUrl;
}

export async function getTokenFromGoogle(code){
  try{
    await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    try{
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
      return true;
    }
    catch (err){
      console.error("Error saving token in a file:",err);
      return false;
    }
  } catch (err){
    console.error('Error retrieving access token', err);
    return false;
  }

}


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client) { //, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });


  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      //callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'bk6d7u7djsv3be47m4n7u7cpao@group.calendar.google.com', //'primary',
    timeMin: (new Date()).toISOString(),
    imeMax: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}