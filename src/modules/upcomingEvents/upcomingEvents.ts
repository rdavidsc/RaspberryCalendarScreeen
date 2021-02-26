

export class upcomingEvents {

    constructor(){}

    public locale = ['es-ES']
    public roomName = 'La selva'
    

    generateSccreen(upcommingEvents: any, inEvent: boolean = false){

        var newEventList: any[] = []
        let dateGorupedEventList: any[] = []
        var nextEvent: any
        let now = new Date()

        if(upcommingEvents.length != 0){
            // Check if is running an event now
            nextEvent = upcommingEvents[0]
            let firstEventStart = new Date(nextEvent.start.dateTime)
            let firstEventEnd = new Date(nextEvent.end.dateTime)
            
            console.log(firstEventStart < now, now <firstEventEnd, firstEventStart, now, firstEventEnd, nextEvent.summary)

            // Is an event running now?
            if(firstEventStart < now && now <firstEventEnd){
                inEvent = true
                for(let i=1;i<upcommingEvents.length;i++){
                    newEventList.push(upcommingEvents[i])
                }
            } else {
                newEventList = upcommingEvents
            }

            // order list by day
            let eventCounter = 0
            let listGroupedByday: any = {}
            for(let j=0; j<newEventList.length; j++){
                eventCounter++
                let eventDate = new Date(newEventList[j].start.dateTime).setHours(0,0,0,0)
                // Check for today events
                let todayDate = new Date().setHours(0,0,0,0)
                if(todayDate == eventDate){
                    if(!('today' in listGroupedByday)){
                        listGroupedByday.today = new Array()
                    }
                    listGroupedByday.today.push(newEventList[j])
                }

                // Check for tomorrow events
                let tomorrowDate = new Date().setHours(0,0,0,0) + 86400000
                if(tomorrowDate == eventDate){
                    if(!('tomorrow' in listGroupedByday)){
                        listGroupedByday.tomorrow = new Array()
                    } 
                    listGroupedByday.tomorrow.push(newEventList[j])
                }

                // Chek for later events
                let day = this.dateFormat(newEventList[j].start.dateTime,{ year: 'numeric'}) +'-'+ this.dateFormat(newEventList[j].start.dateTime,{month: '2-digit'})+'-'+this.dateFormat(newEventList[j].start.dateTime,{day: '2-digit' })
                if(!(day in listGroupedByday)){
                    listGroupedByday[day] = new Array()
                } 
                listGroupedByday[day].push(newEventList[j])
            }
            console.log("QUE HAY", listGroupedByday)

        }


        if(inEvent){
            return `<div class="row h-100">
            <div class="col-sm-8 h-100 d-flex flex-column">
                ${this.inEventTemplate(nextEvent)}
                ${this.clockInEventTemplate()}
            </div>
            <div class="col-sm-4 h-100 d-flex flex-column">
                ${this.eventListTemplate(newEventList)}
                </div>
            </div>`
        } else {
            return `<div class="row h-100">
            <div class="col-sm-8 h-100 d-flex flex-column">
                ${this.clockTemplate()}
            </div>
            <div class="col-sm-4 h-100 d-flex flex-column">
                ${this.eventListTemplate(upcommingEvents)}
            </div>
        </div>`
        }
    }


    /**
     * Renders a list of events from an array
     * @param events From Google API
     */
    eventListTemplate(events: any , roomName?: string){

        // Sub heading needed?
        let subheader = ``
        if(roomName){
            subheader = `Upcoming:`
        } else {
            roomName = `Upcomin`
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

        return `<div class="card align-self-stretch flex-grow-1 h-100">
                    
                        <div class="card-header">
                            <h1>${roomName}</h1>
                        </div>
                        <div class="card-body events-list-body">
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
        return `<div class="card text-center align-self-start flex-grow-1 h-100 w-100">
                  <div class="card-header text-center">
                    <h1>En este momento</h1>
                  </div>
                  <div class="card-body text-center d-flex h-100 flex-column justify-content-center in-event">
                      <h2>${event.summary} </h2>
                      <p>From ${this.timeFormat(event.start.dateTime)} to ${this.timeFormat(event.end.dateTime)}</p>
                      ${ event.description ? `<p>${event.description}</p>` : `` }
                  </div>
                </div>`;
    }


    /**
     * Functions that returns basic event content from a template
     */
    clockTemplate(){
        let time = new Date()
        let header = ``
        let subheader = ``

        if(this.roomName){
            header = `Sala: ${this.roomName} `
            subheader = this.dateFormat(time.toString())
        } else {
            header = this.dateFormat(time.toString())
        }



        return `<div class="card text-center align-self-stretch flex-grow-1 h-100 w-100">
                    <div class="card-header text-center">
                        <h1>${header}</h1>
                    </div>
                    <div class="card-body text-center d-flex h-100 flex-column justify-content-center">
                        <div class="clock-time-big"> ${this.timeFormat(time.toString())} </div>
                        <h2>${subheader}</h2>

                    </div>
                </div>`;
    }    

/**
     * Functions that returns basic event content from a template
     */
    clockInEventTemplate(){
        let time = new Date()

        return `<div class="card text-center align-self-start w-100 clock-card-in-event">
                    <div class="card-body text-center">
                        <div class="clock-time-small">
                                ${this.timeFormat(time.toString())} 
                        </div>
                        <div class="clock-date-small">
                            ${this.dateFormat(time.toString(),{ year: 'numeric', month: 'numeric', day: 'numeric' })}
                        </div>
                    </div>
                </div>`;
    }    

    /**
     * 
     * @param dateTime 
     * @param locale 
     * @param options 
     */
    timeFormat(dateTime: string, options?: any){

        if(dateTime == undefined) return ``
        if(!options) options = { hour: 'numeric', minute: '2-digit', hour12: true }

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleTimeString(this.locale, options).toLowerCase();
    }
    
    dateFormat(dateTime: string, options?: any){
        if(dateTime == undefined) return ``
        if(!options) options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        let d = new Date(dateTime)
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
        return d.toLocaleDateString(this.locale, options);
    }

}