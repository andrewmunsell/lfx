/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var defaults 	= require('./defaults.config.js');
var nconf = require('nconf');

module.exports = exports = function(optimist) {
	var argv = optimist.argv;
	
	nconf.argv();

	if(argv.config !== undefined) {
		nconf.file(argv.config);
	}

	nconf.defaults(defaults);

	return nconf;
}

exports['@singleton'] = true;
exports['@require'] = ['optimist'];