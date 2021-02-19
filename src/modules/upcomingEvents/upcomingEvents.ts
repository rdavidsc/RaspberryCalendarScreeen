

export class upcomingEvents {

    constructor(){}

    /**
     * Renders a list of events from an array
     * @param events From Google API
     */
    eventPageTemplate(events: [] , roomName?: string){

        // Sub heading needed?
        let h2 = ``
        if(roomName){
            h2 = `Upcoming Events:`
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
                      ${ h2 ? `<h2>${h2} </h2>` : `` }
                      ${eventListTemplate}
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-secondary">go back</button>
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
                  <p>From ${this.timeFormat(event.start.dateTime)} to ${this.timeFormat(event.end.dateTime)}
                  </p>
                  ${ event.description ? `<p>${event.description}</p>` : `` }`;
    }


    timeFormat(dateTime: string, options = { hour: 'numeric', minute: '2-digit', hour12: true }){

        if(dateTime == undefined) return ``

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleTimeString([], options);
    }
    
    dateFormat(dateTime: string, options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }){

        if(dateTime == undefined) return ``

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleDateString([], options);
    }




}