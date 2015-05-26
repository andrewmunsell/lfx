/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

var loki = require('lokijs'),
	fs = require('fs');

module.exports = exports = function(nconf) {
	var path = nconf.get('db:path');
	if(path.indexOf('$APPDATA') != -1) {
		var appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');

		path = path.replace('$APPDATA', appData);
	}

	var opts = {
		autosave: true,
		autosaveInterval: 10000,
		autoload: fs.existsSync(path),
		autoloadCallback: addCollectionsIfNotExists
	};

	if(!fs.existsSync(path)) {
		delete opts.autoload;
		delete opts.autoloadCallback;
	}

	var db = new loki(path, opts);

	var addCollectionsIfNotExists = function() {
		var collections = nconf.get('db:collections');
		collections.forEach(function(collection) {
			if(db.getCollection(collection.name) == null) {
				db.addCollection(collection.name, collection.options);
			}
		});

		db.saveDatabase();
	};

	if(!opts.autoloadCallback) {
		addCollectionsIfNotExists();
	}

	return db;
}

exports['@singleton'] = true;
exports['@require'] = ['conf'];