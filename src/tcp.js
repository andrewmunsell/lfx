/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2014 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var jayson = require('jayson');

var self;

/**
 * JSON-RPC 2.0 compliant server that accepts commands for the light manager
 * over a TCP socket.
 * @param {object} nconf   Instance of Nconf containing the current options
 * @param {object} manager lfx-light-manager instance.
 */
function Server(nconf, manager) {
	this._server = null;
	this._nconf = nconf;
	this._manager = manager;

	this._functions = require('./server')(nconf, manager);

	self = this;
}

/**
 * Start the TCP JSON-RPC 2.0 server if one is not already started.
 */
Server.prototype.start = function() {
	if(this._server != null)
		return;

	console.info('Running JSON-RPC 2.0 server on TCP port', this._nconf.get('tcp.port'));

	this._server = jayson.server(this._functions);
	this._server.tcp().listen(this._nconf.get('tcp.port'), this._nconf.get('tcp.address'));
}

module.exports = Server;