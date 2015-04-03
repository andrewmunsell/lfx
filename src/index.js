/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var optimist = require('optimist')

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

var argv = optimist.argv;

var defaults 	= require('./defaults.config.js');

/**
 * Show help if requested.
 */
if(argv.help) {
	optimist.showHelp();

	process.exit(0);
}

/**
 * Parse the command line flags and configuration items
 */
var nconf = require('nconf');

nconf.argv();

if(argv.config !== undefined) {
	nconf.file(argv.config);
}

nconf.defaults(defaults);

/**
 * Start up the server
 */
process.title = 'lfxd';

console.info('Starting LFX...');

/**
 * Fork the process and exit this one if a daemon was requested.
 */
if(argv.daemon) {
	console.info('Forking into background process.');

	require('daemon')();
}

// Setup the cleanup
process.on('SIGINT', function() {
	console.info('Exiting LFX');

	process.exit();
});