var demo = demo || {};
demo.app = demo.app || {};

demo.app.Store = (function () {
	'use strict';

	function Store(name, callback) {
		callback = callback || function () { };

		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				events: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	};

	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var events = JSON.parse(localStorage[this._dbName]).events;

		callback.call(this, events.filter(function (event) {
			for (var q in query) {
				if (query[q] !== event[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	Store.prototype.findAll = function (callback) {
		callback = callback || function () { };
		callback.call(this, JSON.parse(localStorage[this._dbName]).events);
	};

	Store.prototype.save = function (updateData, callback, id, bRemoveOldData) {
		var data = JSON.parse(localStorage[this._dbName]);
		var events = data.events;
		var found = false;

		callback = callback || function () { };
		

		// If an ID was actually given, find the item and update each property
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				if (events[i].id === updateData.id) {
					found = true;
					if(bRemoveOldData){
						var oEvent = {};
						for (var key in updateData) {
							oEvent[key] = updateData[key];
						}
						events[i] = oEvent;
						break;
					} else{
						for (var key in updateData) {
							events[i][key] = updateData[key];
						}
						break;	
					}
					
				}
			}
			if(!found) 
				events.push(updateData);
		}
		else{
			events.push(updateData);
		}
		// 	localStorage[this._dbName] = JSON.stringify(data);
		// 	callback.call(this, JSON.parse(localStorage[this._dbName]).events);
		// } else {
		// 	// Generate an ID
		// 	updateData.id = new Date().getTime();

		
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, [updateData]);
		// }
	};

	/**
* Will remove an item from the Store based on its ID
*
* @param {number} id The ID of the item you want to remove
* @param {function} callback The callback to fire after saving
*/
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var events = data.events;

		for (var i = 0; i < events.length; i++) {
			if (events[i].id == id) {
				events.splice(i, 1);
				break;
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, JSON.parse(localStorage[this._dbName]).events);
	};

	/**
* Will drop all storage and start fresh
*
* @param {function} callback The callback to fire after dropping the data
*/
	Store.prototype.drop = function (callback) {
		localStorage[this._dbName] = JSON.stringify({ events: [] });
		callback.call(this, JSON.parse(localStorage[this._dbName]).events);
	};

	return Store;
} ());
