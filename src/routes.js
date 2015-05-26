/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var IoC = require('electrolyte');

module.exports = exports = function() {
	IoC.create('routes/fixtures');
};

exports['@singleton'] = true;
exports['@require'] = [];