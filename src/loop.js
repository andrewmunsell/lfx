/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var _ = require('lodash'),
	animitter = require('animitter');

module.exports = exports = function(fixtures) {
	return animitter({ fps: 30, async: true }, function(frame, deltaTime, next) {
		var n = _.after(fixtures.length, next);

		fixtures.forEach(function(fixture) {
			fixture.fixture.render(frame, deltaTime, n);
		});
	});
}

exports['@singleton'] = true;
exports['@require'] = ['fixtures'];