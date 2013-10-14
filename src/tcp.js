/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2013 Andrew Munsell
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

	self = this;
}

/**
 * Functions to expose to the clients over JSON-RPC
 * @type {Object}
 */
var _functions = {
	set: function(offset, r, g, b) {
		self._manager.set(offset, r, g, b);
	}
};

/**
 * Start the TCP JSON-RPC 2.0 server if one is not already started.
 */
Server.prototype.start = function() {
	if(this._server != null)
		return;

	console.info("Running JSON-RPC 2.0 server on TCP port", this._nconf.get('tcp.port'));

	this._server = jayson.server(_functions);
	this._server.tcp().listen(this._nconf.get('tcp.port'), this._nconf.get('tcp.address'));
}

module.exports = Server;