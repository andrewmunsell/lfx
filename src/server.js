/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2014 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

function Server(nconf, manager){
	var _functions = {
		/**
		 * Set the RGB value of the LED at the specified offset
		 * @param {number}   offset   Offset of the LED to change
		 * @param {number}   r        Red value from 0 to 255
		 * @param {number}   g        Blue value from 0 to 255
		 * @param {number}   b        Green value from 0 to 255
		 */
		set: function(offset, r, g, b, callback) {
			if(offset < 0 || offset >= manager.size()) {
				return callback({
					code: -32001,
					message: 'The specified LED was out of bounds. (Must be 0 < n < ' + manager.size() + ')'
				});
			}

			callback(null, manager.set(offset, r, g, b));
		},

		/**
		 * Set the RGB values of multiple LEDs
		 * @param {object} leds Object whose keys represent the LEDs to change and values
		 *                      containing the RGB values
		 */
		setMultiple: function(leds, callback) {
			if(typeof(leds) != 'object') {
				return callback({
					code: -32602,
					message: 'The specified parameter was not an object.'
				})
			}

			for(var i in leds) {
				if(leds.hasOwnProperty(i)) {
					manager.set(parseInt(i, 10), leds[i].r, leds[i].g, leds[i].b);
				}
			}

			return callback(null);
		}
	};

	return _functions;
}

module.exports = Server;