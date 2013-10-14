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

var defaults 	= require("./defaults.config.js"),
	Manager 	= require("lfx-light-manager"),
	Animation 	= (require("animation")).Animation;

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
process.title = 'lfx';

console.info("Starting LFX...");

var manager = new Manager({
	"leds": nconf.get("leds")
});

var animation = new Animation({
	frame: "41ms"
});
animation.on("tick", function(){
	manager.render.call(manager);
});

// Start up the TCP server if needed
if(nconf.get('tcp.server')) {
	var tcp = new (require('./tcp'))(nconf, manager);
	tcp.start();
}

/**
 * Fork the process and exit this one if a daemon was requested.
 */
if(argv.daemon) {
	console.info("Forking into background process.");

	require('daemon')();
}

process.title = 'lfx-daemon';

animation.start();