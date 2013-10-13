var optimist = require("optimist")

	.usage('Run the LFX script.\nUsage: $0')

	.boolean('help')
	.describe('help', 'Display help for LFX')
	.alias('help', 'h')

	.string('config')
	.describe('config', 'Path to the configuration file.')
	.alias('config', 'c')

	.boolean('http')
	.default('http', false)
	.describe('http', 'Start the HTTP server and web interface.')
	.alias('http', 'H')

	.boolean('daemon')
	.default('daemon', false)
	.describe('daemon', 'Start the process as a daemon. Only useful if the HTTP server is enabled as well.')
	.alias('daemon', 'd');

var argv = optimist.argv;

/**
 * Show help if requested.
 */
if(argv.help) {
	optimist.showHelp();

	process.exit(0);
}

console.info("Starting LFX...");

/**
 * Fork the process and exit this one if a daemon was requested.
 */
if(argv.daemon) {
	console.info("Forking into background process.");

	require('daemon')();

	console.info("LFX now running as a daemon with process ID ", process.pid);
}