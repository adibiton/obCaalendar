/* global layOutDay */
/* global layoutDay */
/* global it */
/* global describe */
/* global assert */
(function () {
  "use strict";

  describe("App", function () {
    describe("layOutDay", function () {
      it("TBD", function () {
        
        var aEvents = [
          { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
          { id: 2, start: 100, end: 240 }, // an event from 10:40am to 1pm
          { id: 3, start: 700, end: 720 }, // an event from 8:40pm to 9pm
          { id: 4, start: 140, end: 500 }
        ]; 
        var aExpected = [
          { id: 1, start: 60, end: 120, left: 10, top: 60, width: 300},
          { id: 2, start: 100, end: 240, left: 310, top: 100, width: 300},
          { id: 3, start: 700, end: 720, left: 10, top: 700, width: 600},
          { id: 4, start: 140, end: 500, left: 10, top: 140, width: 600}
        ];
        var x = layOutDay(aEvents);
        assert.deepEqual(x, aExpected);
      });
      it("TBD", function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');        
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();
        
        var oEvent = { id: 7, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);
        assert.deepEqual(oCalendarController.getEventById(7), oEvent);
      });
    });


  });
} ());
