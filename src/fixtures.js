/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var _ = require('lodash');

module.exports = exports = function(db) {
	// Load the fixtures
	var fixtures = db.getCollection('fixtures').find({
		active: true
	});

	/**
	 * Process the fixture object
	 * @param  {object} fixture 
	 */
	var processFixture = function(fixture) {
		var Connector = require(fixture.options.connector);
		fixture.fixture = new Connector(fixture.options);

		return fixture;
	};

	/**
	 * Compute all changes on the fixtures
	 */
	var computeFixtureChanges = function() {
		var changes = db.getCollection('fixtures').getChanges();

		changes.forEach(function(change) {
			switch(change.operation.toUpperCase()) {
				case 'I':
					fixtures.push(processFixture(change.obj));
					break;
				case 'U':
					fixtures.map(function(fixture) {
						if(fixture.$loki == change.obj.$loki) {
							fixture = _.merge(fixture, change.obj);
						}

						return fixture;
					});
					break;
				case 'R':
					fixtures = fixtures.filter(function(fixture) {
						return fixture.$loki != changes.obj.$loki;
					});
					break;
			}
		});

		db.getCollection('fixtures').flushChanges();
	};

	// Process all of the fixtures
	fixtures = fixtures.map(processFixture);

	return {
		getChanges: computeFixtureChanges,
		fixtures: fixtures
	};
}

exports['@singleton'] = true;
exports['@require'] = ['db'];