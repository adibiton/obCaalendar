/* global layoutDay */
/* global it */
/* global describe */
/* global assert */
(function () {
  "use strict";

  describe("calendar.controller", function () {
    describe("addEvent", function () {
      it("should throw an exception in case of an event without id", function () {
        var oCalendarController = new demo.app.CalendarController(null, null, null);
        (function () { oCalendarController.addEvents({ start: 60, end: 120 }); }).should.throw('Invalid input');
      });
      it("should return the event that was enetered", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var oEvent = { id: 7, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);
        assert.deepEqual(oCalendarController.getEventById(7), oEvent);
      });
    });

    describe("addEvents", function () {
      it("should throw an exception in case of invalid input (not array)", function () {
        var oCalendarController = new demo.app.CalendarController(null, null, null);
        (function () { oCalendarController.addEvents(2); }).should.throw('Invalid input');
      });
      it("should enter events to the storage", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var aEvents = [
          { id: 1, start: 60, end: 120 },
          { id: 2, start: 100, end: 240 },
          { id: 3, start: 700, end: 720 },
          { id: 4, start: 140, end: 500 },
          { id: 5, start: 60, end: 120 },
          { id: 6, start: 710, end: 715 },
          { id: 7, start: 240, end: 250 }
        ];
        oCalendarController.addEvents(aEvents);
        assert.deepEqual(oCalendarController.getAllEvents(), aEvents);
      });
    });

    describe("getEventById", function () {
      it("should throw an exception in case of illegl id (not number)", function () {
        var oCalendarController = new demo.app.CalendarController(null, null, null);
        (function () { oCalendarController.getEventById('test'); }).should.throw('Invalid id');
      });
      it("should return event with the given id", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var oEvent = { id: 334, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);
        assert.deepEqual(oCalendarController.getEventById(334), oEvent);
      });
    });

    describe("calculateLOCAndUpdateModel", function () {
      var oStorage = new demo.app.Store('mocha-calendarController-test');
      var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, demo.app.utils);
      it("two overlapping events should have loc = 2 and third event without overlapping should have loc = 1", function () {
        var aEvents = [
          { id: 1, start: 60, end: 120 },
          { id: 2, start: 100, end: 240 },
          { id: 3, start: 300, end: 310 }
        ];
        var aExpected = [
          { id: 1, start: 60, end: 120, loc: 2 },
          { id: 2, start: 100, end: 240, loc: 2 },
          { id: 3, start: 300, end: 310, loc: 1 }
        ];
        oCalendarController.removeAllEvents();
        oCalendarController.addEvents(aEvents);
        assert.deepEqual(oCalendarController.calculateLOCAndUpdateModel().getAllEvents(), aExpected);

      });
      it("All events are has max overlapping of 2 -> should have loc = 2", function () {
        var aEvents = [
          { id: 1, start: 60, end: 90 },
          { id: 3, start: 80, end: 100 },
          { id: 2, start: 140, end: 300 },
          { id: 4, start: 110, end: 210 },
          { id: 5, start: 220, end: 250 }
        ];
        var aExpected = [
          { id: 1, start: 60, end: 90, loc: 2 },
          { id: 3, start: 80, end: 100, loc: 2 },
          { id: 2, start: 140, end: 300, loc: 2 },
          { id: 4, start: 110, end: 210, loc: 2 },
          { id: 5, start: 220, end: 250, loc: 2 }
        ];
        oCalendarController.removeAllEvents();
        oCalendarController.addEvents(aEvents);
        assert.deepEqual(oCalendarController.calculateLOCAndUpdateModel().getAllEvents(), aExpected);

      });
      it("should return loc = 1 for each event in an array without overlapping events", function () {
        var aEvents = [
          { id: 1, start: 60, end: 120 },
          { id: 2, start: 120, end: 240 }
        ];

        var aExpected = [
          { id: 1, start: 60, end: 120, loc: 1 },
          { id: 2, start: 120, end: 240, loc: 1 },
        ];
        oCalendarController.removeAllEvents();
        oCalendarController.addEvents(aEvents);
        assert.deepEqual(oCalendarController.calculateLOCAndUpdateModel().getAllEvents(), aExpected);

      });
      it("should return the max number of overlaping events for each event", function () {
        var aEvents = [
          { id: 1, start: 60, end: 300 },
          { id: 2, start: 100, end: 110 },
          { id: 3, start: 130, end: 150 },
          { id: 4, start: 160, end: 190 },
          { id: 5, start: 180, end: 220 }
        ];
        var aExpected = [
          { id: 1, start: 60, end: 300, loc: 3 },
          { id: 2, start: 100, end: 110, loc: 2 },
          { id: 3, start: 130, end: 150, loc: 2 },
          { id: 4, start: 160, end: 190, loc: 3 },
          { id: 5, start: 180, end: 220, loc: 3 }
        ];

        oCalendarController.removeAllEvents();
        oCalendarController.addEvents(aEvents);
        assert.deepEqual(oCalendarController.calculateLOCAndUpdateModel().getAllEvents(), aExpected);

      });
    });
    
    describe("getAllEvents", function () {
      it("should return an empty array in case there are no events", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        assert.deepEqual(oCalendarController.getAllEvents(), []);        
      });
      it("should return the same event that was given as an input", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var oEvent = { id: 7, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);
        assert.notDeepEqual(oCalendarController.getEventById(7), [{ id: 7, start: 240, end: 250, test: 120}]);
        assert.deepEqual(oCalendarController.getAllEvents(), [oEvent]);
      });
    });
    
    describe("removeAllEvents", function () {
      it("should return an empty array after calling to removeAllEvents", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);        
        oCalendarController.removeAllEvents();
        var oEvent = { id: 7, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);        
        assert.deepEqual(oCalendarController.removeAllEvents().getAllEvents(), []);        
      });      
    });
    
    describe("sortEvents", function () {
      it("should return an array sorted by the start time", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var aEvents = [
          { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
          { id: 2, start: 100, end: 240 }, // an event from 10:40am to 1pm
          { id: 3, start: 700, end: 720 }, // an event from 8:40pm to 9pm
          { id: 4, start: 140, end: 500 }
        ];
        var aSortedEvents = [
          { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
          { id: 2, start: 100, end: 240 }, // an event from 10:40am to 
          { id: 4, start: 140, end: 500 },
          { id: 3, start: 700, end: 720 } // an event from 8:40pm to 9pm 
        ];
                
        oCalendarController.addEvents(aEvents);       
        assert.deepEqual(oCalendarController.sortEvents(), aSortedEvents);        
      });      
    });
    
    describe("layoutEvents", function () {
      it("layout 4 events on container with size 620*720", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, demo.app.utils);
        oCalendarController.removeAllEvents();
        
        var aEvents = [
          { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
          { id: 2, start: 100, end: 240 }, // an event from 10:40am to 1pm
          { id: 3, start: 700, end: 720 }, // an event from 8:40pm to 9pm
          { id: 4, start: 140, end: 500 }
        ];     
        
        var aExpected = [
          { id: 1, start: 60, end: 120, left: 0, top: 60, width: 310},  // an event from 10am to 11am
          { id: 2, start: 100, end: 240, left: 310, top: 100, width: 310}, // an event from 10:40am to 1pm
          { id: 3, start: 700, end: 720, left: 0, top: 700, width: 620}, // an event from 8:40pm to 9pm
          { id: 4, start: 140, end: 500, left: 0, top: 140, width: 620 }
        ];    
                
        //var aLayoutEvents = oCalendarController.layoutEvents(aEvents, 620, 720);
               
        assert.deepEqual(oCalendarController.layoutEvents(aEvents, 620, 720).getAllEvents(), aExpected);        
      });      
    });
    describe("showCalendar", function () {      
      it("should return all events as appears on the calendar", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oTemplate = new demo.app.Template();
        var oView = new demo.app.View(oTemplate);
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage),oView, demo.app.utils);
        oCalendarController.removeAllEvents();
        var aEvents = [
          { id: 1, start: 60, end: 120},
          { id: 2, start: 100, end: 240},
          { id: 3, start: 110, end: 130},
          { id: 4, start: 250, end: 290}
        ];
        
        // var aExpected = [
        //   { id: 1, start: 60, end: 120, left: 10, top: 70, width: 200, height: 60, title: "all day event", location: "tel-aviv" },
        //   { id: 2, start: 100, end: 240, left: 210, top: 110, width: 200, height: 140, title: "all day event", location: "tel-aviv" },
        //   { id: 3, start: 110, end: 130, left: 410, top: 120, width: 200, height: 20, title: "all day event", location: "tel-aviv" },
        //   { id: 4, start: 250, end: 290, left: 10, top: 260, width: 600, height: 40, title: "all day event", location: "tel-aviv" }
        // ];
        oCalendarController.layoutEvents(aEvents, 620, 720);
        oCalendarController.showCalendar();
        var nNumberOfEvents = document.querySelectorAll(".event").length;
        assert.equal(nNumberOfEvents, 4);
      });
    });

  });
} ());
