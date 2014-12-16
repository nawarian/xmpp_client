'use strict';

define(
	'xmpp_client/XMPPConnection',
	[ 'Strophe' ],
	function( StropheJS ) {

		function XMPPConnection() {};
		XMPPConnection.prototype = {

			jid: 'nobody',
			password: 'nobody',
			host: 'http://localhost:7070/http-bind/',
			handler: null,
			connect: function() {

				

			}

		};

		return XMPPConnection;
	}
);