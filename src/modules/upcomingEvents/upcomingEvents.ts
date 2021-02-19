

export class upcomingEvents {

    constructor(){}


    /**
     * Functions that returns basic event content from a template
     * @param event Event to render
     */
    eventTemplate(event:any){
        // @TOD --> Format dates correctly
      
        return `<h3>${event.summary}</h3>
                  <p>Start Time: ${event.start.dateTime}<br>
                      End Time: ${event.end.dateTime}
                  </p>
                  ${ event.description ? `<p>${event.description}</p>` : `` }`;
    }
      

    /**
     * Renders a list of events from an array
     * @param events From Google API
     */
    eventPageTemplate(events: [] , roomName?: string){

        let h2 = ``

        if(roomName){
            h2 = `Upcoming Events:`
        } else {
            roomName = `Upcoming Events`
        }

        let eventListTemplate = ``
      
        if(events.length == 0){
            eventListTemplate = `There are no upcomming events`
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

}