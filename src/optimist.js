/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = exports = function() {
	return require('optimist')

		.usage('LFX server.\n\nUsage: $0')

		.boolean('help')
		.describe('help', 'Display help for LFX.')
		.alias('help', 'h')

		.string('config')
		.describe('config', 'Path to the configuration file.')
		.alias('config', 'c')

		.boolean('daemon')
		.default('daemon', false)
		.describe('daemon', 'Start the process as a daemon.')
		.alias('daemon', 'd')

		.string('connect')
		.describe('connect', 'Master LFX server to connect to. If omitted, this instance will act as a master.')
		.alias('connect', 'C');
}

exports['@singleton'] = true;
exports['@require'] = [];