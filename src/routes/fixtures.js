/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = exports = function(app) {
	app.get('/v1/fixtures', function(req, res) {

	});
};

exports['@singleton'] = true;
exports['@require'] = ['app'];