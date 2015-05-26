/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = exports = function(nconf) {
	// Load the fixtures
	var fixtures = nconf.get('fixtures') || [];

	return fixtures.map(function(fixture) {
		var Connector = require(fixture.options.connector);
		fixture.fixture = new Connector(fixture.options);

		return fixture;
	});
}

exports['@singleton'] = true;
exports['@require'] = ['conf'];