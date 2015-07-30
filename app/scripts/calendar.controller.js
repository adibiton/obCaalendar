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
		this.utils = utils;
		this.layout = {};
	}

	/**
	 * Add event
	 * @param  {object} event  the event you want to enter
	 * @return {object} CalendarController
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
		}
		aEvents.forEach((function (event) {
			this.addEvent(event);
		}).bind(this));
		return this;
	};

	/**
	 * Update events
	 * @param  {array}	aEvents array of events to update
	 * @return {object}	CalendarController
	 */
	CalendarController.prototype.updateEvents = function(aEvents, bRemoveOldData){
		if (!Array.isArray(aEvents)) {
			throw 'Invalid input';
		}

		aEvents.forEach((function (event) {
			this.model.update(event.id, event, null, bRemoveOldData);
		}).bind(this));
		return this;
	};

	/**
	 * Get event by id
	 * @param  {number}	nId id of an event
	 * @return {object}	event
	 */
	CalendarController.prototype.getEventById = function (nId) {
		if (!Number.isInteger(nId)) {
			throw 'Invalid id';
		}
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
			aEvents = this.sortEvents(aEvents);
			aLOC = calculateLongestOverlappingChain(aEvents, this.utils);
			aEvents.forEach(function(event){
				event.loc = aLOC[event.id - 1];
				this.model.update(event.id, event);
			}, this);
		}, null, this);
		return this;
	};

	/**
	 * Get all events from model
	 * @return {array} events
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
				if(oEvent1.start === oEvent2.start) {
					return oEvent1.end < oEvent2.end;
				}
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
		this.addEvents(aEvents);

		this.calculateLOCAndUpdateModel();

		var aEventsLOC = getSetOfLOC(this.getAllEvents());

		nLCM = this.layout.nNumberOfColumns = this.utils.calcLcm(aEventsLOC);
		this.layout.columnWidth = columnWidth(this.layout.nContainerWidth, this.layout.nNumberOfColumns);
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
			aEvents = this.sortEvents(aEvents);
			aEvents.forEach(function (event) {
				this.aGridColumns.some(function (column, colIndex, arr) {
					var i, last, bNotOverlapping = true;
					//Check where is the exact column the event should resides in
					if (column.length === 0) {
						//No events in this column - enter the event to the column and to the following columns (till you get to the number of columns the event should )
						for (i = colIndex, last = colIndex + this.layout.nNumberOfColumns / event.loc; i < last; i++) {
							this.aGridColumns[i].push(event);
							event.startColumn = colIndex;
						}
						return true;
					}
					else {
						if (this.utils.isEventsOverlapping(column[column.length - 1], event)) {
							return false;
						}
						//Check that events in all other columns are not overlapping also
						else {
							for (i = colIndex, last = colIndex + this.layout.nNumberOfColumns / event.loc; i < last; i++) {
								var oColumn = arr[i];
								if(this.utils.isEventsOverlapping(oColumn[oColumn.length - 1], event)){
									bNotOverlapping = false;
									break;
								}
							}
							if(bNotOverlapping){
								event.startColumn = colIndex;
								for (i = colIndex, last = colIndex + this.layout.nNumberOfColumns / event.loc; i < last; i++) {
									this.aGridColumns[i].push(event);
								}
							}
							return bNotOverlapping;
						}
					}
				}, this);
			}, this);

			aPositionedEvents = calculateEventsPositionAttributes(this, aEvents, normalizeEvents);
			this.updateEvents(aPositionedEvents, true);
		}).bind(this));
		return this;
	};

	/**
	 * Render calendar
	 *
	 */
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
			if (aLOCValues.indexOf(event.loc) > -1){
				return;
			}
			aLOCValues.push(event.loc);
		});

		return aLOCValues;
	}

	/**
	 * Get a set of unique loc values
	 * @param  {object}  	oObject
	 * @param  {number}  	nContainerWidth
	 * @param  {number}		nContainerHeight
	 */
	function setLayoutParams(oObject, nContainerWidth, nContainerHeight){
		oObject.nContainerWidth = nContainerWidth - 20;
		oObject.nContainerHeight = nContainerHeight;
	}

	/**
	 * Update events structure to the container measures
	 * @param  {array}	aEvents
	 * @return {array}	aNormalizedEvents
	 */
	function normalizeEvents(aEvents) {
		var aNormalizedEvents = [];
		for (var i = 0, length = aEvents.length; i < length; i++) {
			//Foreach event we should determine the position according to it's start place and the overlapingEvents it's has
			aNormalizedEvents.push({ id: aEvents[i].id, start: aEvents[i].start, end: aEvents[i].end, left: aEvents[i].left + 10, top: aEvents[i].start, width: aEvents[i].width, height: aEvents[i].height });
		}
		return aNormalizedEvents;
	}

	/**
	 * Calculate least common multiple for an array of numbers
	 * @param  {array}  aNumbers  array of numbers
	 * @return {number}  least common multiple for all numbers
	 */
	function columnWidth(nWidth, nNumOfColumns) {
		if (nNumOfColumns) {
			return nWidth / nNumOfColumns;
		}
		else{
			throw 'number of column must be a posititve integer';
		}
	}

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
	}

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
	}

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
			aEvents[i].height = aEvents[i].end - aEvents[i].start;
		}
		return callback(aEvents);
	}

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
				var aOverlapping = [];
				var nMaxInChain = -1;
				if (index === 0) {
					aChain.push(event);
					return;
				}

				var x = aChain.every(function (e) {
					return utils.isEventsOverlapping(event, e);
				}, this);
				//In case all the events in the current chain is overlapping with the iterable event
				//We would like to add it to the chain, otherwise the current chain will not have
				//new "members" and therfore we can calculate it's length and assigned it as the
				//event loc
				if (x) {
					aChain.push(event);
				} else {
					aChain.forEach(function (e, i, arr) {
//						resultEvents[arr[i].id] = getMax(arr.length, resultEvents[arr[i].id]);
						nMaxInChain = getMax(getMax(arr.length, resultEvents[arr[i].id]), nMaxInChain);
						if (utils.isEventsOverlapping(arr[i], event)) {
							aOverlapping.push(e);
						}
					}, this);
					aChain.forEach(function (e, i, arr) {
						resultEvents[arr[i].id] = nMaxInChain;
					});
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
	}


	return CalendarController;
}());
