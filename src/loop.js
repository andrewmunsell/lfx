/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var _ = require('lodash'),
	animitter = require('animitter');

module.exports = exports = function(fixtures) {
	var fps = 24;

	/**
	 * Create the animation loop
	 */
	return animitter({ fps: fps, async: true }, function(frame, deltaTime, next) {
		// Watch the fixtures changes
		if(frame % fps == 0) {
			fixtures.getChanges();
		}
	
		if(fixtures.fixtures.length > 0) {
			var n = _.after(fixtures.fixtures.length, next);

			fixtures.fixtures.forEach(function(fixture) {
				fixture.fixture.render(frame, deltaTime, n);
			});
		} else {
			next();
		}
	});
}

exports['@singleton'] = true;
exports['@require'] = ['fixtures'];