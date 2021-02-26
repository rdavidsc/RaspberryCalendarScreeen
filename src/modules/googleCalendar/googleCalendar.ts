const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


export class googleCalendar {

    // If modifying these scopes, delete token.json.
    private SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    private TOKEN_PATH = 'src/modules/googleCalendar/token.json';
    private CONFIG_PATH = 'appConfig.json';

    private credentials: any
    private token: string
    public oAuth2Client: any
    public error = {
      message: '',
      body: ''
    }

    public calendarId: 'bk6d7u7djsv3be47m4n7u7cpao@group.calendar.google.com'

    constructor(){}

    /**
     * Check for APP credentials and Create an OAuth2 client with the given credentials
     */
    public getCredentials() {
        try{
            this.credentials = JSON.parse(fs.readFileSync('src/modules/googleCalendar/credentials.json','utf-8'));
            if(!this.credentials.installed){
                this.error.message = "Error: Bad credentials.";
                this.error.body = "Please contact info@gobusinessinc.com";
                return false;
            }
            const {client_secret, client_id, redirect_uris} = this.credentials.installed;
            this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            return this.authorize();
        }
        catch (err) {
          if (err.code === 'ENOENT'){
            //console.log("Cant find file:")
            //console.table(err)
            this.error.message = "Cant find credentials file"
            this.error.body = "Please contact info@gobusinessinc.com";
            // @TODO --> Show screen App Error
          } else {
            console.log("Error reading file.")
            console.table(err)
            this.error.message = "Error reading file."
            this.error.body = "File is corrupt. Please contact info@gobusinessinc.com";
            // @TODO --> Show screen App Error
          }
          return false;
        }
    }

    /**
     * Check if there is an exidting Token and set the credentials fot OAuth2 Client
     */
    authorize(){
        try{
            this.token = fs.readFileSync(this.TOKEN_PATH);
            // Token stored in file is valid, prepare oAuth Client
            this.oAuth2Client.setCredentials(JSON.parse(this.token));
            return true;
        } catch (err) {
            this.error = err
            this.error.message = 'No valid Token'
            return false;
        }
    }


    /**
     * Get the URL to look for a new Token
     */
    getAccessTokenURL() { 
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        return authUrl;
    }

    /**
     * Verify Token and store it in a file
     */
    async getTokenFromGoogle(code: string){
        try{
          this.token = await this.oAuth2Client.getToken(code); // <-- OJO Donde queda el token nuevo?
          this.oAuth2Client.setCredentials(this.token);
          // Store the token to disk for later program executions
          try{
            fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(this.token));
            console.log('Token stored to', this.TOKEN_PATH);
            return true;
          }
          catch (err){
            console.error("Error saving token in a file:",err);
            this.error = err
            this.error.message = "Error saving token in a file:"
            return false;
          }
        } catch (err){
          console.error('Error retrieving access token', err);
          this.error = err
          this.error.message = 'Error retrieving access token'
          return false;
        }
      }


    /**
     * Lists the next 10 events on the user's primary calendar
     */
    async listEvents(auth: any, calendarId?: string) {
        const calendar = google.calendar({version: 'v3', auth});
        if(calendarId == undefined) calendarId = 'primary'
        try{
            const result = await calendar.events.list({
                calendarId: calendarId,
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            })
            // Filter only events with start and end time (delete all day events)
            let eventList: any[] = []
            for(let i=0; i< result.data.items.length; i++){
              if(result.data.items[i].start.dateTime != undefined && result.data.items[i].end.dateTime != undefined){
                eventList.push(result.data.items[i])
              }
            }

            return eventList;
        } catch(err){
            console.log('The API returned an error: ' + err)
            this.error = err
            return null;
        }
    }


}



