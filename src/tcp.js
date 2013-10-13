var jayson = require('jayson');

function Server(nconf, manager) {
	this._server = null;
	this._nconf = nconf;
}

Server.prototype.start = function() {
	if(this._server != null)
		return;

	console.info("Running JSON-RPC 2.0 server on TCP port", this._nconf.get('tcp.port'));

	this._server = jayson.server();
	this._server.tcp().listen(this._nconf.get('tcp.port'));
}

module.exports = Server;