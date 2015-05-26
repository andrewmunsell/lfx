/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = exports = function(app, db) {
	/**
	 * Get all fixtures
	 */
	app.get('/v1/fixtures', function(req, res) {
		res.jsonp(db.getCollection('fixtures').find({}));
	});
};

exports['@singleton'] = true;
exports['@require'] = ['app', 'db'];