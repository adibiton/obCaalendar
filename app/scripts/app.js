(function(){
				
		function App(name){
			var ns = demo.app;
			this.storage = new ns.Store(name);
			this.model = new ns.Model(this.storage);
			this.template = new ns.Template();
			this.view = new ns.View(this.template);
			this.utils = ns.utils;
			this.controller = new ns.CalendarController(this.model, this.view, this.utils);	
		};
		var calendarApp = new App('calendar-events');
		
		App.prototype.layoutEvents = function(aEvents, nContainerWidth, nContainerHeight){
			return this.controller.layoutEvents(aEvents, nContainerWidth, nContainerHeight);
		}
		
		/**
		* Lays out events for a single  day
		*
		* @param array  events   An array of event objects. Each event object consists of a start and end
		*                                     time  (measured in minutes) from 9am, as well as a unique id. The
		*                                     start and end time of each event will be [0, 720]. The start time will 
		*                                     be less than the end time.
		*
		* @return array  An array of event objects that has the width, the left and top positions set, in addition to the id,
		*                        start and end time. The object should be laid out so that there are no overlapping
		*                        events.
		*/
		 function layOutDay(events) {
			 var app = new App('calendar-events-layoutDay');
			 var aLayoutEvents = app.controller.layoutEvents(events, 620, 720).getAllEvents();
			 return aLayoutEvents;
			 
		 }
		window.layOutDay = layOutDay || {};		
		window.calendarApp = calendarApp || {};		
}(window));		
