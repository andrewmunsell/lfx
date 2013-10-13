var jayson = require('jayson');

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
}

/**
 * Functions to expose to the clients over JSON-RPC
 * @type {Object}
 */
var _functions = {
	set: function(offset, r, g, b) {
		this.manager.set(offset, r, g, b);
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
	this._server.tcp().listen(this._nconf.get('tcp.port'));
}

module.exports = Server;