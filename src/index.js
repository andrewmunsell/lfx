var optimist = require("optimist")

	.boolean('help')
	.describe('help', 'Display help for LFX')

	.boolean('http')
	.describe('http', 'Enable or disable the HTTP server and interface');

var argv = optimist.argv;

if(argv.help) {
	optimist.showHelp();

	process.exit(0);
}