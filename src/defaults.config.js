/**
 * @author Andrew Munsell <andrew@wizardapps.net>
 * @copyright 2015 Andrew Munsell
 * @license http://www.gnu.org/licenses/ GNU GPLv3
 */

module.exports = {
	'server': false,
	'bind': '0.0.0.0',
	'port': 80,

	'db': {
		// Path to the database file, relative to the user's app data folder if the path begins with
		// "$APPDATA".
		'path': '$APPDATA/net.wizardapps.lfx.db',

		'collections': [
			{
				name: 'fixtures',
				options: {
					disableChangesApi: false
				}
			},

			{
				name: 'groups',
				options: {}
			}
		]
	}
};