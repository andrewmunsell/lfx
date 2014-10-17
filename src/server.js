/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2013 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

function Server(nconf, manager){
	return {
		set: function(offset, r, g, b, callback) {
			callback(null, manager.set(offset, r, g, b));
		}
	};
}

module.exports = Server;