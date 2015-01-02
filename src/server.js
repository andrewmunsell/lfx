/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var Promise = require('bluebird');

function Server(nconf, managers){
	// Resolve the appropriate manager(s) from the specified offset, ID, or tag(s).
	var resolveManagers = function(fixture) {
		if(typeof(fixture) == 'number') {
			// Find the manager by its offset
			if(fixture >= managers.length) {
				return [];
			}

			return [managers[fixture]];
		} else if(typeof(fixture) == 'string') {
			// Find the manager by its fixture ID
			for (var i = 0; i < managers.length; i++) {
				if(managers[i].id == fixture) {
					return [managers[i]];
				}
			};
		} else if(typeof(fixture) == 'array') {
			// Find the manager by its fixture tags
			var selectedManagers = {};

			for (var i = 0; i < fixture.length; i++) {
				for (var j = 0; j < managers.length; j++) {
					if(typeof(managers[j].tags) == 'object' &&
						managers[j].tags.length &&
						managers[j].tags.indexOf(fixture[i]) > -1) {

						selectedManagers[managers[j].id] = managers[j];
					}
				};
			};

			return _.values(selectedManagers);
		} else if(fixture == null) {
			return managers;
		}

		return [];
	};

	var _functions = {
		/**
		 * Get all of the current fixtures and their information.
		 */
		getAllFixtures: function(callback) {
			return _functions.getFixtures(null, callback);
		},

		/**
		 * Get the fixtures with the specified filters
		 * @param {mixed} fixture Fixture offset, fixture ID, or a set of fixture tags
		 *                        to locate a fixture by
		 */
		getFixtures: function(fixture, callback) {
			var managers = resolveManagers(fixture);

			var fixtures = [];
			for (var i = 0; i < managers.length; i++) {
				var manager = managers[i];

				fixtures.push({
					id: manager.id,
					parent: null,
					description: manager.config.description == null ? null : manager.config.description,
					leds: manager.config.leds,
					tags: manager.tags
				});
			};

			return callback(null, fixtures);
		},

		/**
		 * Clear all tags for the specified fixtures. The client may specify a fixture
		 * offset, fixture ID, or a set of fixture tags as criteria.
		 * @param  {mixed} fixture Fixture offset, fixture ID, or a set of fixture tags
		 *                         to locate a fixture by
		 */
		clearFixtureTags: function(fixture, callback) {
			var managers = resolveManagers(fixture);
			if(managers.length < 1) {
				return callback({
					code: -32002,
					message: 'The specified fixture was not found. Either no fixtures matched' +
						' your criteria or the fixture index was out of bounds.'
				});
			}

			managers.forEach(function(manager) {
				manager.tags = [];
			});

			return _functions.getFixtures(fixture, callback);
		},

		/**
		 * Add a tag to a fixture with the specified ID
		 * @param {string} fixture Fixture ID to add a tag to
		 * @param {string} tag     Tag to add to the fixture
		 */
		addFixtureTag: function(fixture, tag, callback) {
			if(typeof(fixture) != 'string') {
				return callback({
					code: -32600,
					message: 'The specified fixture ID must be a string.'
				});
			}

			if(typeof(tag) != 'string') {
				return callback({
					code: -32600,
					message: 'The specified tag to add to the fixture must be a string.'
				});
			}

			var managers = resolveManagers(fixture);
			if(managers.length < 1) {
				return callback({
					code: -32002,
					message: 'The specified fixture was not found.'
				});
			}

			managers[0].tags.push(tag);

			return _functions.getFixtures(fixture, callback);
		},

		/**
		 * Set the tags for the specified fixture(s). The fixture parameter may be a fixture
		 * offset, fixture ID, or set of tags to find fixtures by.
		 * @param {mixed} fixture Fixture offset, fixture ID, or a set of fixture tags
		 *                        to locate a fixture by
		 * @param {array} tags    Tags to add to the fixture(s) matched by the specified criteria
		 */
		setFixtureTags: function(fixture, tags, callback) {
			var managers = resolveManagers(fixture);
			for (var i = 0; i < managers.length; i++) {
				var manager = managers[i];

				this.clearFixtureTags(manager.id);
				for (var i = 0; i < tags.length; i++) {
					this.addFixtureTag(manager.id, tags[i]);
				};
			};

			return _functions.getFixtures(fixture, callback);
		},

		/**
		 * Set the RGB value of the LED at the specified offset
		 * @param {mixed}    fixture  Offset of the fixture to change, string representing the ID
		 *                            of the fixture to change, or an array containing strings
		 *                            that represent the fixtures to change.
		 * @param {number}   offset   Offset of the LED to change on the specified fixture
		 * @param {number}   r        Red value from 0 to 255
		 * @param {number}   g        Blue value from 0 to 255
		 * @param {number}   b        Green value from 0 to 255
		 */
		set: function(fixture, offset, r, g, b, callback) {
			var managers = resolveManagers(fixture);
			if(managers.length < 1) {
				return callback({
					code: -32002,
					message: 'The specified fixture was not found. Either no fixtures matched' +
						' your criteria or the fixture index was out of bounds.'
				});
			}

			var promises = [];

			managers.forEach(function(manager) {
				promises.push(Promise.resolve()
					.then(function() {
						if(offset < 0 || offset >= manager.size()) {
							throw {
								code: -32001,
								message: 'The specified LED was out of bounds. (Must be 0 < n < ' + manager.size() + ')'
							};
						}

						return manager.set(offset, r, g, b);
					})
				);
			});

			Promise.all(promises)
				.then(function(results) {
					callback(null, results);
				})
				.catch(function(err) {
					callback(err);
				});
		}
	};

	return _functions;
}

module.exports = Server;