

export class upcomingEvents {

    constructor(){}




    generateSccreen(events: any[], inEvent: boolean = false){


        if(inEvent){
            return `<div class="row">
            <div class="col-sm-8">
                ${this.inEventTemplate(events[0])}
            </div>
            <div class="col-sm-4">
                ${this.eventListTemplate(events)}
                ${this.clockTemplate(events[0].summary)}
            </div>
            </div>`
        } else {
            return `<div class="row">
            <div class="col-sm-8">
                ${this.clockTemplate()}
            </div>
            <div class="col-sm-4">
                ${this.eventListTemplate(events)}
            </div>
        </div>`
        }
    }


    /**
     * Renders a list of events from an array
     * @param events From Google API
     */
    eventListTemplate(events: any[] , roomName?: string){

        // Sub heading needed?
        let subheader = ``
        if(roomName){
            subheader = `Upcoming Events:`
        } else {
            roomName = `Upcoming Events`
        }

        // Generate the template for the list of events
        let eventListTemplate = ``
        if(events.length == 0){
            eventListTemplate = `<p>There are no upcoming events</p>`
        } else {
            let eventsList = "<ul>";
            for (let i = 0; i < events.length; i++){
              eventsList += `<li>${ this.eventTemplate(events[i]) }</li>`;
            }
            eventsList += "</ul>";

            eventListTemplate = `<ul id="events"> ${eventsList}</ul>`
        }

        return `<div class="card">
                  <div class="card-header">
                    <h1>${roomName}</h1>
                  </div>
                  <div class="card-body">
                      ${ subheader ? `<h2>${subheader} </h2>` : `` }
                      ${eventListTemplate}
                  </div>
                </div>`;
        }

    /**
     * Functions that returns basic event content from a template
     * @param event Event to render
     */
    eventTemplate(event:any){
        // @TOD --> Format dates correctly
      
        return `<h3>${event.summary}</h3>
                  <p>From ${this.timeFormat(event.start.dateTime)} to ${this.timeFormat(event.end.dateTime)}</p>
                  ${ event.description ? `<p>${event.description}</p>` : `` }`;
    }


    /**
     * Returns the template for an inprogress Event
     * @param event 
     */
    inEventTemplate(event: any){
        return `<div class="card">
                  <div class="card-header text-center">
                    <h1>En este momento</h1>
                  </div>
                  <div class="card-body text-center">
                      <h2>${event.summary} </h2>
                      <p>From ${this.timeFormat(event.start.dateTime)} to ${this.timeFormat(event.end.dateTime)}</p>
                      ${ event.description ? `<p>${event.description}</p>` : `` }
                  </div>
                </div>`;
    }


    /**
     * Functions that returns basic event content from a template
     * @param inEvent (Boolean) Is running an event in the moment?
     * @param eventName The name of the event
     */
    clockTemplate(eventName?: string){
        let time = new Date()
        let header: string
        let subheader: string

        if(eventName){
            header = eventName
            subheader = this.dateFormat(time.toString(),['es-ES'])
        } else {
            header = this.dateFormat(time.toString(),['es-ES'])
        }

        return `<div class="card">
                  <div class="card-header text-center">
                    <h1>${header}</h1>
                  </div>
                  <div class="card-body text-center">
                      ${ subheader ? `<h2>${subheader} </h2>` : `` }
                      <div class="${ eventName ? 'clock-time-small': 'clock-time-big'}"> ${this.timeFormat(time.toString())} </div>
                  </div>
                </div>`;
    }    


    /**
     * 
     * @param dateTime 
     * @param locale 
     * @param options 
     */
    timeFormat(dateTime: string, locale: any[] = [], options = { hour: 'numeric', minute: '2-digit', hour12: true }){

        if(dateTime == undefined) return ``

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleTimeString(locale, options).toLowerCase();
    }
    
    dateFormat(dateTime: string, locale: any[] = [], options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }){

        if(dateTime == undefined) return ``

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleDateString(locale, options);
    }




}