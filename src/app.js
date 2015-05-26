/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = exports = function(nconf) {
	var app = require('express')();
	var server = app.listen(nconf.get('port') || 3000, nconf.get('bind') || '127.0.0.1');

	return app;
}

exports['@singleton'] = true;
exports['@require'] = ['conf'];