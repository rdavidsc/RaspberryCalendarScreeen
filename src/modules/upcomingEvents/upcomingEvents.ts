

export class upcomingEvents {

    constructor(name?: string){
        this.roomName = name
    }

    public locale = ['es-ES']
    public roomName = 'La selva'
    

    generateSccreen(upcommingEvents: any){


        let inEvent: boolean = false
        let newEventList: any[] = []
        let listGroupedByday: any = {}
        let nextEvent: any
        let now = new Date()
        let eventCounter = 0

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
            
            for(let j=0; j<newEventList.length; j++){
                eventCounter++
                if(eventCounter == 6) break

                let day = this.dateFormat(newEventList[j].start.dateTime,{ year: 'numeric'}) +'-'+ this.dateFormat(newEventList[j].start.dateTime,{month: '2-digit'})+'-'+this.dateFormat(newEventList[j].start.dateTime,{day: '2-digit' })
                if(!(day in listGroupedByday)){
                    listGroupedByday[day] = new Array()
                } 
                listGroupedByday[day].push(newEventList[j])
            }
            //console.log("QUE HAY", listGroupedByday)

        }

        let upcomingCardTemplate = `<div class="col-sm-4 h-100 d-flex flex-column">
                ${this.upcomingEventsTemplate(listGroupedByday)}
            </div>`


        if(inEvent){
            return `<div class="row h-100">
            <div class="col-sm-${eventCounter==0 ?'12':'8'}  8 h-100 d-flex flex-column">
                ${this.inEventTemplate(nextEvent)}
                ${this.clockInEventTemplate()}
            </div>
            ${eventCounter==0 ?``:upcomingCardTemplate}
            </div>`
        } else {
            return `<div class="row h-100">
            <div class="col-sm-${eventCounter==0 ?'12':'8'} h-100 d-flex flex-column">
                ${this.clockTemplate()}
            </div>
            ${eventCounter==0 ?``:upcomingCardTemplate}
        </div>`
        }
    }


    /**
     * 
     * @param listGroupedByday object with Events grouped by index "today", "tomorrow" or the day
     */
    upcomingEventsTemplate(listGroupedByday: any){

        // Render Today events
        let todayEvents = ``
        if('today' in listGroupedByday){
            //todayEvents  = `<h2>Today:</h2>${this.eventListTemplate(listGroupedByday.today)}`
        }
        // Render Today events
        let tomorrowEvents = ``
        if('today' in listGroupedByday){
            //tomorrowEvents  = `<h2>Tomorrow:</h2>${this.eventListTemplate(listGroupedByday.tomorrow)}`
        }


        // Render later events
        let laterEvents = ``
        for (let key in listGroupedByday){
            let d = new Date(key)
            if(!isNaN(d.getTime())){
                //console.log(key, listGroupedByday[key][0].start.dateTime)
                laterEvents += `<h2>${this.isTodayOrTomorrow(listGroupedByday[key][0].start.dateTime)}</h2>${this.eventListTemplate(listGroupedByday[key])}`
            }
        }

        return `<div class="card align-self-stretch flex-grow-1 h-100">
                    <div class="card-header">
                        <h1>Upcoming</h1>
                    </div>
                    <div class="card-body events-list-body">
                        ${todayEvents}
                        ${tomorrowEvents}
                        ${laterEvents}
                    </div>
                </div>`;
    }

    isTodayOrTomorrow(date: string){
        let today = new Date()
        let tomorrow = new Date()
        tomorrow.setDate(new Date().getDate()+1)

        let day = new Date(date)
        console.log("TODAY:",today.toDateString(), day.toDateString(), date)

        if(today.toDateString() == day.toDateString()){
            return `Today`
        }
        if(tomorrow.toDateString() == day.toDateString()){
            return `Tomorrow`
        }
        return this.dateFormat(date, { weekday: 'long', month: 'short', day: 'numeric' })
    }

    /**
     * Renders a list of events from an array
     * @param events Array of any
     */
    eventListTemplate(events: any){

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
        return eventListTemplate
        }

    /**
     * Functions that returns basic event content from a template
     * @param event Event to render
     */
    eventTemplate(event:any){
        // @TOD --> Format dates correctly
      
        return `<h3>${event.summary}</h3>
                  <p>From ${this.timeFormat(event.start.dateTime)} to ${this.timeFormat(event.end.dateTime)}</p>`;
                  //${ event.description ? `<p>${event.description}</p>` : `` }`;
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