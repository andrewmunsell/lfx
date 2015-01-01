/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

/**
 * JSON-RPC 2.0 compliant server that accepts commands for the light manager
 * over HTTP.
 * @param {object} nconf    Instance of Nconf containing the current options
 * @param {array}  managers lfx-light-manager instances.
 */
function Server(nconf, server, managers) {
	this._nconf = nconf;
	this._server = server;
	this._managers = managers;
}

/**
 * Start the HTTP JSON-RPC 2.0 server if one is not already started.
 */
Server.prototype.start = function() {
	console.info('Running JSON-RPC 2.0 server on HTTP port', this._nconf.get('http.port'));

	this._server.http().listen(this._nconf.get('http.port'), this._nconf.get('http.address'));
}

module.exports = Server;