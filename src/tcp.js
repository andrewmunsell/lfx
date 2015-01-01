/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

/**
 * JSON-RPC 2.0 compliant server that accepts commands for the light manager
 * over a TCP socket.
 * @param {object} nconf    Instance of Nconf containing the current options
 * @param {array}  managers lfx-light-manager instances.
 */
function Server(nconf, server, managers) {
	this._nconf = nconf;
	this._server = server;
	this._managers = managers;
}

/**
 * Start the TCP JSON-RPC 2.0 server if one is not already started.
 */
Server.prototype.start = function() {
	console.info('Running JSON-RPC 2.0 server on TCP port', this._nconf.get('tcp.port'));

	this._server.tcp().listen(this._nconf.get('tcp.port'), this._nconf.get('tcp.address'));
}

module.exports = Server;