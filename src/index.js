/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var IoC = require('electrolyte');
IoC.loader(IoC.node('src'));

var optimist = IoC.create('optimist');

var argv = optimist.argv;

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
var nconf = IoC.create('conf');

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

// Start the event loop and setup the server
var loop = IoC.create('loop');
var app = IoC.create('app');

IoC.create('routes');

// Setup the cleanup
process.on('SIGINT', function() {
	console.info('Exiting LFX');

	// Stop the animation loop
	loop.complete();

	process.exit();
});

// Start the loop for real
loop.start();