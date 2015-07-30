var demo = demo || {};
demo.app = demo.app || {};

demo.app.Model = (function(){
'use strict';

	/**
	 * Creates a new Model instance and hooks up the storage.
	 *
	 * @constructor
	 * @param {object} storage a reference to the client side storage class
	 */
	function Model(storage) {
		this.storage = storage;
	}

	/**
	 * Creates a new events model
	 *
	 * @param {event} event in the calendar
	 * @param {function} [callback] The callback to fire after the model is created
	 */
	Model.prototype.create = function (event, callback) {
		callback = callback || function () {};

		this.storage.save(event, callback);
	};

	/**
	 * Finds and returns a model in storage. If no query is given it'll simply
	 * return everything. If you pass in a string or number it'll look that up as
	 * the ID of the model to find. Lastly, you can pass it an object to match
	 * against.
	 *
	 * @param {string|number|object} [query] A query to match models against
	 * @param {function} [callback] The callback to fire after the model is found
	 *
	 * @example
	 * model.read(1, func); // Will find the model with an ID of 1
	 * model.read('1'); // Same as above
	 * //Below will find a model with foo equalling bar and hello equalling world.
	 * model.read({ foo: 'bar', hello: 'world' });
	 */
	Model.prototype.read = function (query, callback, context) {
		var queryType = typeof query;
		callback = callback || function () {};

		if(context){
			if(queryType === 'function'){
				query = query.bind(context);
			}
			if(typeof callback === 'function'){
				callback = callback.bind(context);
			}
		}

		if (queryType === 'function') {
			callback = query;
			return this.storage.findAll(callback);
		} else if (queryType === 'string' || queryType === 'number') {
			query = parseInt(query, 10);
			this.storage.find({ id: query }, callback);
		} else {
			this.storage.find(query, callback);
		}
	};

	/**
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is complete.
	 *
	 * @param {number} id The id of the model to update
	 * @param {object} data The properties to update and their new value
	 * @param {function} callback The callback to fire when the update is complete.
	 * @param {boolean} bRemoveOldData if yes, delete the old event data and enter the new one
	 */
	Model.prototype.update = function (id, data, callback, bRemoveOldData) {
		this.storage.save(data, callback, id, bRemoveOldData);
	};

	/**
	 * Removes a model from storage
	 *
	 * @param {number} id The ID of the model to remove
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
	};

	/**
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	Model.prototype.removeAll = function (callback, context) {
		if(context){
			this.storage.drop(callback.bind(context));
		}
		else{
			this.storage.drop(callback);
		}

	};
	return Model;
}());
