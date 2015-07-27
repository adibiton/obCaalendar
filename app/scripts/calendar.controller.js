var demo = demo || {};
demo.app = demo.app || {};

demo.app.CalendarController = (function () {
	'use strict';
	/**
	 * Takes a model and view and acts as the controller between them
	 *
	 * @constructor
	 * @param {object} model The model instance
	 * @param {object} view The view instance
	 */
	function CalendarController(model, view, utils) {
		this.model = model;
		this.view = view;
		//this.locUtils = loc;
		this.utils = utils;
		this.columnWidth;
		this.layout = {};
		//this.nContainerWidth = nContainerWidth;
		//this.nContainerHeight = nContainerHeight;
	}
	
	/**
	 * Add event
	 * @param  {Object} event  the event you want to enter
	 * @return {Object} CalendarController 
	 */
	/**
	 * An event to fire whenever you want to add an event. Simply pass in the event
	 * object and it'll handle the model insertion and saving of the new item.
	 */
	CalendarController.prototype.addEvent = function (event) {
		if (event.id === '') {
			throw 'Invalid input';
		}
		this.model.create(event, function () { });
		return this;
	};
	
	/**
	 * Add events
	 * @param  {Array} aEvents array of events
	 * @return {Object} CalendarController 
	 */
	CalendarController.prototype.addEvents = function (aEvents) {
		if (!Array.isArray(aEvents)) {
			throw 'Invalid input';
		};
		aEvents.forEach((function (event) {
			this.addEvent(event);
		}).bind(this));
		return this;
	};
	
	/**
	 * TBD	  
	 */
	CalendarController.prototype.updateEvents = function(aEvents, bRemoveOldData){
		if (!Array.isArray(aEvents)) {
			throw 'Invalid input';
		};
		
		aEvents.forEach((function (event) {
			this.model.update(event.id, event, null, bRemoveOldData);
		}).bind(this));
		return this;
	};
	
	/**
	 * Get 
	 * @param  {number}	nId id of an event	 
	 * @return {object}	event  
	 */
	CalendarController.prototype.getEventById = function (nId) {
		if (!Number.isInteger(nId)) {
			throw 'Invalid id';
		};
		var oEvent;
		this.model.read({ id: nId }, function (data) {
			oEvent = data[0];
		});
		return oEvent;
	};
	
	/**
	 * Calculate longest overlapping chain
	 * @return {object} CalendarController  
	 */
	CalendarController.prototype.calculateLOCAndUpdateModel = function () {
		var aLOC;
		this.model.read(function (aEvents) {
			aLOC = calculateLongestOverlappingChain(aEvents, this.utils);
			aLOC.forEach(function (nLOC, index) {
				aEvents[index].loc = nLOC;
				this.model.update(aEvents[index].id, aEvents[index]);
			}, this);

		}, null, this);
		return this;
	};
		
	/**
	 * Get all events from model	 
	 * @return [array] events  
	 */
	CalendarController.prototype.getAllEvents = function () {
		var oData;
		this.model.read(function (data) {
			oData = data;
		});
		return oData;
	};
	
	/**
	 * Remove all events from model
	 * @return {object} CalendarController 
	 */
	CalendarController.prototype.removeAllEvents = function () {
		this.model.removeAll(function () { });
		return this;
	};
	
	/**
	* sort stored events by their start time	
	* @return {array}  An array of event objects sorted ascending by start property
	*/
	CalendarController.prototype.sortEvents = function () {
		var aSortedEvents;
		this.model.read({}, function (data) {
			data.sort(function (oEvent1, oEvent2) {
				return oEvent1.start > oEvent2.start;
			});
			aSortedEvents = data;
		});
		return aSortedEvents;
	};

	/**
	 * layout events on container
	 * @param  {array}	aEvents array of events events
	 * @param  {number}	nContainerWidth container width
	 * @param  {number}	nContainerHeight container height
	 * @return {object} calendarController 
	 */
	CalendarController.prototype.layoutEvents = function (aEvents, nContainerWidth, nContainerHeight) {
		var nLCM;
		
		setLayoutParams(this.layout, nContainerWidth, nContainerHeight);
		this.removeAllEvents();
		this.addEvents(aEvents).sortEvents();
		var aEventsLOC = getSetOfLOC(this.calculateLOCAndUpdateModel().getAllEvents());

		nLCM = this.layout.nNumberOfColumns = this.utils.calcLcm(aEventsLOC);
		this.layout.columnWidth = this.layout.nContainerWidth / this.layout.nNumberOfColumns;
		this.aGridColumns = initGridColumns(nLCM);
		return this.layoutEventsOnContainer();
	};	
	
	
	
	/**
	 * layout events on container
	 * @return {object} calendarController 
	 */
	CalendarController.prototype.layoutEventsOnContainer = function () {
		var aPositionedEvents = [];
		this.model.read((function (aEvents) {
			aEvents.forEach(function (event, index) {				
				this.aGridColumns.some(function (column, colIndex) {
					//Check where is the exact column the event should resides in
					if (column.length == 0) {
						//No events in this column - enter the event to the column and to the following columns (till you get to the number of columns the event should )
						for (var i = colIndex, last = colIndex + this.layout.nNumberOfColumns / event.loc; i < last; i++) {
							this.aGridColumns[colIndex].push(event);
							event.startColumn = colIndex;
						};
						return true;
					}
					else {
						if (this.utils.isEventsOverlapping(column[column.length - 1], event)) {
							return false;
						}
						else {
							for (var i = colIndex, last = colIndex + this.layout.nNumberOfColumns / event.loc; i < last; i++) {
								this.aGridColumns[i].push(event);
								event.startColumn = colIndex;
							};
							return true;
						}
					}
				}, this);
			}, this);
			aPositionedEvents = calculateEventsPositionAttributes(this, aEvents, normalizeEvents);
			this.updateEvents(aPositionedEvents, true);
		}).bind(this));
		return this;
	};
	
	CalendarController.prototype.showCalendar = function () {
		this.model.read((function (data) {
			this.view.render('showEntries', data);
		}).bind(this));
	};
		
	
	
	
	// Private methods
	/**
	 * Get a set of unique loc values
	 * @param  {array}  aEvents
	 * @return {array} set of the different loc values 
	 */
	function getSetOfLOC(aEvents) {
		var aLOCValues = [];
		aEvents.forEach(function (event) {
			if (aLOCValues.indexOf(event.loc) > -1)
				return;
			aLOCValues.push(event.loc);
		});

		return aLOCValues;
	};
	
	/**
	 * Get a set of unique loc values
	 * @param  {object}  	oObject
	 * @param  {number}  	nContainerWidth
	 * @param  {number}		nContainerHeight
	 */
	function setLayoutParams(oObject, nContainerWidth, nContainerHeight){	
		oObject.nContainerWidth = nContainerWidth - 20;
		oObject.nContainerHeight = nContainerHeight;
	};
	
	/**
	 * Update events structure to the container measures 
	 * @param  {array}	aEvents 
	 * @return {array}	aNormalizedEvents  
	 */
	function normalizeEvents(aEvents) {
		var aNormalizedEvents = [];
		for (var i = 0, length = aEvents.length; i < length; i++) {
			//Foreach event we should determine the position according to it's start place and the overlapingEvents it's has			
			aNormalizedEvents.push({ id: aEvents[i].id, start: aEvents[i].start, end: aEvents[i].end, left: aEvents[i].left + 10, top: aEvents[i].start + 10, width: aEvents[i].width });
		}
		return aNormalizedEvents;
	};
	
	/**
	 * Calculate least common multiple for an array of numbers
	 * @param  {array}  aNumbers  array of numbers
	 * @return {number}  least common multiple for all numbers
	 */
	function columnWidth(nWidth, nNumOfColumns) {
		if (nNumOfColumns) {
			return nWidth / nNumOfColumns;
		}
		else throw "number of column must be a posititve integer";
	};

	/**
	 * Init grid columns
	 * @param  {number}  nNumOfColumns
	 * @return {array} an array of array length nNumOfColumns 
	 */
	function initGridColumns(nNumOfColumns) {
		var aGridColumns = [];
		for (var i = 0; i < nNumOfColumns; i++) {
			aGridColumns.push([]);
		}
		return aGridColumns;
	};
	
	/**
	 * Get max
	 * @param  {number}  nNumber1  	 	
	 * @param  {number}  nNumber2  
	 * @return {number} get the max of the two numbers
	 */
	function getMax(nNumber1, nNumber2) {
		if (nNumber2) {
			return nNumber2 > nNumber1 ? nNumber2 : nNumber1;
		}
		else {
			return nNumber1;
		}
	};
	
	/**
	 * Calculate events positioning attributes 
	 * @param  {object}  oController  	 	
	 * @param  {array}  aEvents
	 * @param  {function}  callback
	 * @return {number} get the max of the two numbers
	 */
	//Input: array of events with numOfNeighbors
	//The array length represts the number of columns the layout is constructed of
	function calculateEventsPositionAttributes(oController, aEvents, callback) {
		for (var i = 0, length = aEvents.length; i < length; i++) {
			//Foreach event we should determine the position according to it's start place and the overlapingEvents it's has
			var iColumns = oController.layout.nNumberOfColumns / aEvents[i].loc;
			aEvents[i].width = iColumns * oController.layout.columnWidth;
			aEvents[i].left = aEvents[i].startColumn * oController.layout.columnWidth;
		}
		return callback(aEvents);
	};
	
	/**
	 * Calculate loc for each event 
	 * @param  {Array} aEvents  array of events objects
	 * @param {Object} utils function
	 * @return {Array} get loc for aEvents
	 */
	function calculateLongestOverlappingChain(aEvents, utils) {
		var aChain = [];
		var resultEvents = [];
		//var eventUtils = demo.app.eventUtils;
		aEvents.forEach(function (event, index) {
				if (index === 0) {
					aChain.push(event);
					return;
				}

				var x = aChain.every(function (e, i) {
					return utils.isEventsOverlapping(event, e);
				}, this);
				//In case all the events in the current chain is overlapping with the iterable event
				//We would like to add it to the chain, otherwise the current chain will not have 
				//new "members" and therfore we can calculate it's length and assigned it as the 
				//event loc
				if (x) {
					aChain.push(event);
				} else {
					var aOverlapping = [];
					aChain.forEach(function (e, i, arr) {
						resultEvents[arr[i].id] = getMax(arr.length, resultEvents[arr[i].id]);
						if (utils.isEventsOverlapping(arr[i], event)) {
							aOverlapping.push(e);
						};
					}, this);
					aChain = aOverlapping;
					aChain.push(event);
				}
			}, this);
		//For the last chain
		if (aChain.length) {
			aChain.forEach(function (e, i, arr) {
				resultEvents[arr[i].id] = getMax(arr.length, resultEvents[arr[i].id]);
			});
		}
		return resultEvents.splice(1);
	};


	return CalendarController;
} ());
