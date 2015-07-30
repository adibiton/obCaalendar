/* global layOutDay */
/* global it */
/* global describe */
/* global assert */
/* global demo */
(function () {
  'use strict';

  describe('App', function () {
    describe('layOutDay', function () {
      it('layout 4 events', function () {

        var aEvents = [
          { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
          { id: 2, start: 100, end: 240 }, // an event from 10:40am to 1pm
          { id: 3, start: 600, end: 720 }, // an event from 7:00pm to 9pm
          { id: 4, start: 140, end: 500 }
        ];
        var aExpected = [
          { id: 1, start: 60, end: 120, left: 10, top: 60, width: 300, height: 60},
          { id: 2, start: 100, end: 240, left: 310, top: 100, width: 300, height: 140},
          { id: 3, start: 600, end: 720, left: 10, top: 600, width: 600, height: 120},
          { id: 4, start: 140, end: 500, left: 10, top: 140, width: 300, height: 360}
        ];
        var aLayoutedEvents = layOutDay(aEvents);
        assert.deepEqual(aLayoutedEvents, aExpected);
      });
      it('layout one event', function () {
        var oStorage = new demo.app.Store('mocha-calendarController-test');
        var oCalendarController = new demo.app.CalendarController(new demo.app.Model(oStorage), null, null);
        oCalendarController.removeAllEvents();

        var oEvent = { id: 7, start: 240, end: 250 };
        oCalendarController.addEvent(oEvent);
        assert.deepEqual(oCalendarController.getEventById(7), oEvent);
      });
    });


  });
}());
