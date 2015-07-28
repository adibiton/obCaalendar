// /* global layoutDay */
// /* global it */
// /* global describe */
// /* global assert */
// (function () {
//   "use strict";  
//   describe("utils", function () {
//     var utils = demo.app.utils;
//     describe("alcm - calculate lcm for array", function () {
//       it("should return 6 for 1,2,3", function () {
//         var aOverlapingInstances = [1, 2, 3];
//         assert.equal(utils.calcLcm(aOverlapingInstances), 6);
//       });
//       it("should return 12 for 1,2,3,4,6", function () {
//         var aOverlapingInstances = [1, 2, 3, 4, 6];
//         assert.equal(utils.calcLcm(aOverlapingInstances), 12);
//       });
//     });
//     describe("isEventsOverlapping", function () {
//       var oCalendar = new demo.app.Calendar('calendar-events-test');
//       it("should return true for overlap events and false for non overlapping events", function () {
//         oCalendar.clear();
//         //var eventUtils = demo.app.eventUtils;
//         var aEvents = [
//           { id: 1, start: 60, end: 120 },
//           { id: 2, start: 100, end: 240 },
//           { id: 3, start: 700, end: 720 },
//           { id: 4, start: 140, end: 500 },
//           { id: 5, start: 60, end: 120 },
//           { id: 6, start: 710, end: 715 },
//           { id: 7, start: 240, end: 250 }
//         ];
//         oCalendar.addEvents(aEvents);
//         expect(oCalendar.isEventsOverlapping(1, 2)).to.be.true;
//         expect(oCalendar.isEventsOverlapping(1, 4)).to.be.false;
//         expect(oCalendar.isEventsOverlapping(1, 5)).to.be.true;
//         expect(oCalendar.isEventsOverlapping(3, 6)).to.be.true;
//         expect(oCalendar.isEventsOverlapping(2, 7)).to.be.false;
//       });

//     });
//   });


//   describe("Events", function () {
//     var oCalendar = new demo.app.Calendar('calendar-events-test');
//     describe("sortEvents", function () {
//       it("should return sorted array of event objects according to their start time", function () {
//         oCalendar.clear();
//         var aEvents = [
//           { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
//           { id: 2, start: 100, end: 240 }, // an event from 10:40am to 1pm
//           { id: 3, start: 700, end: 720 }, // an event from 8:40pm to 9pm
//           { id: 4, start: 140, end: 500 }
//         ];
//         oCalendar.addEvents(aEvents);
//         //var oEvents = new demo.app.Events(aEvents);

//         var aSortedEvents = [
//           { id: 1, start: 60, end: 120 },  // an event from 10am to 11am
//           { id: 2, start: 100, end: 240 }, // an event from 10:40am to 
//           { id: 4, start: 140, end: 500 },
//           { id: 3, start: 700, end: 720 } // an event from 8:40pm to 9pm 
//         ];
//         assert.deepEqual(oCalendar.sortEvents(), aSortedEvents);
//       });
//     });
//     describe("calculate longest overlapping chain for each event", function () {
//       it("should return an empty array for an empty input array", function () {
//         var aEvents = [];
//         var aExpectedEvents = [];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);

//         assert.deepEqual(oCalendar.calculateLOC(), aExpectedEvents);
//       });
//       it("should return the max number of overlaping events for each event", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120 },
//           { id: 2, start: 100, end: 240 },
//           { id: 3, start: 300, end: 310 }
//         ];
//         var aExpected = [2, 2, 1];

//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.calculateLOC(), aExpected);
//       });

//       it("should return the max number of overlaping events for each event", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 90 },
//           { id: 3, start: 80, end: 100 },
//           { id: 2, start: 140, end: 300 },
//           { id: 4, start: 110, end: 210 },
//           { id: 5, start: 220, end: 250 }
//         ];
//         var aExpected = [2, 2, 2, 2, 2];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.calculateLOC(), aExpected);
//       });

//       it("should return loc = 1 for each event in an array without overlapping events", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120 },
//           { id: 2, start: 120, end: 240 }
//         ];
//         var aExpected = [1, 1];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.calculateLOC(), aExpected);

//       });
//       it("should return the max number of overlaping events for each event", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 300 },
//           { id: 2, start: 100, end: 110 },
//           { id: 3, start: 130, end: 150 },
//           { id: 4, start: 160, end: 190 },
//           { id: 5, start: 180, end: 220 }
//         ];
//         var aExpected = [3, 2, 2, 3, 3];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.calculateLOC(), aExpected);
//       });
//     });
//     describe("getSetOfLOC", function () {
//       it("should return an empty array for an empty input array", function () {
//         var aEvents = [];
//         var aExpected = [];

//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);

//         assert.deepEqual(oCalendar.getSetOfLOC(), aExpected);
//       });
//       it("should return an array with only one instance (2)", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 110, end: 240, loc: 2 }
//         ];

//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.getSetOfLOC(), [2]);
//       });
//       it("should return an array with two different numbers [2,1]", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 110, end: 240, loc: 2 },
//           { id: 2, start: 300, end: 320, loc: 1 }
//         ];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         assert.deepEqual(oCalendar.getSetOfLOC(), [2, 1]);
//       });
//     });
//     // describe("setLOC", function () {
//     //   it("set loc", function () {
//     //     var aEvents = [
//     //       { id: 1, start: 60, end: 120 },
//     //       { id: 2, start: 110, end: 240 },
//     //       { id: 2, start: 300, end: 320 }
//     //     ];
//     //     oCalendar.clear();
//     //     oCalendar.addEvents(aEvents);

//     //     var aLOC = [2, 2, 1];
//     //     var aExpected = [
//     //       { id: 1, start: 60, end: 120, loc: 2 },
//     //       { id: 2, start: 110, end: 240, loc: 2 },
//     //       { id: 2, start: 300, end: 320, loc: 1 }
//     //     ];
//     //     assert.deepEqual(oCalendar.setLOC(aLOC).getEvents(), aExpected);
//     //   });
//     // });
//   });
//   describe("layout", function () {
//     var oCalendar = new demo.app.Calendar('calendar-events-test');
//     describe("layoutEvents", function () {
//       it("should distrubite the two overlaping events in two columns", function () {

//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 110, end: 240, loc: 2 }
//         ];
//         var aExpected = [[
//           { id: 1, start: 60, end: 120, loc: 2 }
//         ], [
//             { id: 2, start: 110, end: 240, loc: 2 }
//           ]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 2, oCalendar.getModel());

//         assert.deepEqual(oCalendar.layoutEvents().getEventsGrid(), aExpected);
//       });

//       it("should use one column for non overlaping events", function () {
//         //var oCalLayout = new demo.app.CalendarLayout(600, 720, 1);
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 1 },
//           { id: 2, start: 130, end: 240, loc: 1 }
//         ];
//         var aExpected = [[
//           { id: 1, start: 60, end: 120, loc: 1 },
//           { id: 2, start: 130, end: 240, loc: 1 }
//         ]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 1, oCalendar.getModel());
//         assert.deepEqual(oCalendar.layoutEvents(aEvents).getEventsGrid(), aExpected);
//       });

//       it("should add 3 events in the first column, 3 in the second column and 3 in the third column", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 3 },
//           { id: 2, start: 100, end: 110, loc: 3 },
//           { id: 3, start: 100, end: 160, loc: 3 },
//           { id: 4, start: 200, end: 210, loc: 1 },
//           { id: 5, start: 240, end: 250, loc: 1 }
//         ];
//         var aExpected = [[
//           { id: 1, start: 60, end: 120, loc: 3 },
//           { id: 4, start: 200, end: 210, loc: 1 },
//           { id: 5, start: 240, end: 250, loc: 1 }
//         ],
//           [{ id: 2, start: 100, end: 110, loc: 3 },
//             { id: 4, start: 200, end: 210, loc: 1 },
//             { id: 5, start: 240, end: 250, loc: 1 }],
//           [{ id: 3, start: 100, end: 160, loc: 3 },
//             { id: 4, start: 200, end: 210, loc: 1 },
//             { id: 5, start: 240, end: 250, loc: 1 }]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 3, oCalendar.getModel());
//         assert.deepEqual(oCalendar.layoutEvents(aEvents).getEventsGrid(), aExpected);
//       });
//       it("should add 2 events in the first column, 3 in the second column", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 90, loc: 2 },
//           { id: 3, start: 80, end: 100, loc: 2 },
//           { id: 2, start: 140, end: 300, loc: 2 },
//           { id: 4, start: 110, end: 210, loc: 2 },
//           { id: 5, start: 220, end: 250, loc: 2 }
//         ];
//         var aExpected = [[
//           { id: 1, start: 60, end: 90, loc: 2 },
//           { id: 2, start: 140, end: 300, loc: 2 }
//         ],
//           [{ id: 3, start: 80, end: 100, loc: 2 },
//             { id: 4, start: 110, end: 210, loc: 2 },
//             { id: 5, start: 220, end: 250, loc: 2 }]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 2, oCalendar.getModel());
//         assert.deepEqual(oCalendar.layoutEvents().getEventsGrid(), aExpected);
//       });
//     });

//     describe("positioningEvents", function () {
//       it("should create 2 columns for 2 overlaping events", function () {
//         //var oCalLayout = new demo.app.CalendarLayout(600, 720, 2);
//         var aEvents = [[
//           { id: 1, start: 60, end: 120, loc: 2 }
//         ], [
//             { id: 2, start: 110, end: 240, loc: 2 }
//           ]];

//         var aExpected = [[
//           { id: 1, start: 60, end: 120, loc: 2, width: 300, left: 0 }
//         ], [
//             { id: 2, start: 110, end: 240, loc: 2, width: 300, left: 300 }
//           ]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 2, oCalendar.getModel());

//         assert.deepEqual(oCalendar.layoutEvents().positioningEvents(aEvents), aExpected);
//       });
//       it("should create 2 columns for 2 overlaping events", function () {

//         var aEvents = [[
//           { id: 1, start: 60, end: 120, loc: 1 },
//           { id: 2, start: 140, end: 170, loc: 2 }
//         ], [
//             { id: 3, start: 130, end: 160, loc: 2 }
//           ]];

//         var aExpected = [[
//           { id: 1, start: 60, end: 120, loc: 1, width: 600, left: 0 },
//           { id: 2, start: 140, end: 170, loc: 2, width: 300, left: 0 }
//         ], [
//             { id: 3, start: 130, end: 160, loc: 2, width: 300, left: 300 }
//           ]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 2, oCalendar.getModel());

//         assert.deepEqual(oCalendar.layoutEvents().positioningEvents(aEvents), aExpected);
//       });
//       it("should create 3 columns for 3 overlaping events", function () {

//         var aEvents = [[
//           { id: 'A', start: 60, end: 120, loc: 3 },
//           { id: 'D', start: 140, end: 170, loc: 3 },
//           { id: 'F', start: 180, end: 220, loc: 3 },
//           { id: 'G', start: 300, end: 320, loc: 1 },
//         ], [
//             { id: 'B', start: 70, end: 150, loc: 3 },
//             { id: 'E', start: 160, end: 190, loc: 3 }
//           ], [
//             { id: 'C', start: 80, end: 200, loc: 3 }
//           ]];

//         var aExpected = [[
//           { id: 'A', start: 60, end: 120, loc: 3, width: 200, left: 0 },
//           { id: 'D', start: 140, end: 170, loc: 3, width: 200, left: 0 },
//           { id: 'F', start: 180, end: 220, loc: 3, width: 200, left: 0 },
//           { id: 'G', start: 300, end: 320, loc: 1, width: 600, left: 0 },
//         ], [
//             { id: 'B', start: 70, end: 150, loc: 3, width: 200, left: 200 },
//             { id: 'E', start: 160, end: 190, loc: 3, width: 200, left: 200 }
//           ], [
//             { id: 'C', start: 80, end: 200, loc: 3, width: 200, left: 400 }
//           ]];
//         oCalendar.clear();
//         oCalendar.addEvents(aEvents);
//         oCalendar.createCalendarLayout(600, 720, 3, oCalendar.getModel());

//         assert.deepEqual(oCalendar.layoutEvents().positioningEvents(aEvents), aExpected);
//       });
//     });
//   })
//   describe("app", function () {
//     describe("layoutDay", function () {
//       it("layout 2 events", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 100, end: 240, loc: 2 }
//         ];

//         var aExpected = [
//           { id: 1, start: 60, end: 120, left: 0, top: 60 },
//           { id: 2, start: 100, end: 240, left: 300, top: 100 },
//         ];
//         assert.deepEqual(layoutDay(aEvents), aExpected);
//       });
//       it("layout 3 events", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 100, end: 240, loc: 3 },
//           { id: 3, start: 110, end: 130, loc: 3 }
//         ];

//         var aExpected = [
//           { id: 1, start: 60, end: 120, left: 0, top: 60 },
//           { id: 2, start: 100, end: 240, left: 200, top: 100 },
//            { id: 3, start: 110, end: 130, left: 400, top: 110 }
//         ];
//         assert.deepEqual(layoutDay(aEvents), aExpected);
//       });
//       it("layout 4 events", function () {
//         var aEvents = [
//           { id: 1, start: 60, end: 120, loc: 2 },
//           { id: 2, start: 100, end: 240, loc: 3 },
//           { id: 3, start: 110, end: 130, loc: 3 },
//           { id: 4, start: 250, end: 290, loc: 1 }
//         ];

//         var aExpected = [
//           { id: 1, start: 60, end: 120, left: 0, top: 60 },
//           { id: 2, start: 100, end: 240, left: 200, top: 100 },
//           { id: 3, start: 110, end: 130, left: 400, top: 110 },
//           { id: 4, start: 250, end: 290, left: 0, top: 250 }
//         ];
//         assert.deepEqual(layoutDay(aEvents), aExpected);
//       });
      
//     });
//   });
//   describe("events.template", function () {
//     describe("show", function () {

//       it("should throw exception in case of invalid input", function () {
//         var aEvents = [
//           { id: 'A', start: 60, end: 120, style: { width: "300px", height: "30px" } },
//           { id: 'D', start: 140, end: 170, style: { width: "300px", height: "60px", top: "30px" } }
//         ];
//         var oTemplate = new demo.app.Template();

//         var view = oTemplate.show(aEvents);
//         assert(true, true);

//       });
//     });
//   });

// } ());
