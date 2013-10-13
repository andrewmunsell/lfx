var optimist = require("optimist")

	.usage('Run the LFX script.\nUsage: $0')

	.boolean('help')
	.describe('help', 'Display help for LFX')
	.alias('help', 'h')

	.string('config')
	.describe('config', 'Path to the configuration file.')
	.alias('config', 'c')

	.boolean('daemon')
	.default('daemon', false)
	.describe('daemon', 'Start the process as a daemon. Only useful if the HTTP server is enabled as well.')
	.alias('daemon', 'd');

var argv = optimist.argv;

var defaults = require("./defaults.config.js");

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
console.info("Starting LFX...");

if(nconf.get('tcp.server')) {
	var tcp = new (require('./tcp'))(nconf, {});
	tcp.start();
}

/**
 * Fork the process and exit this one if a daemon was requested.
 */
if(argv.daemon) {
	console.info("Forking into background process.");

	require('daemon')();

	console.info("LFX now running as a daemon with process ID ", process.pid);
}